import randomstring from 'randomstring';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import FacebookTokenStrategy from 'passport-facebook-token';
import User from './models/user.model';
import config from './../config/config';

module.exports = (() => {
  // Serialize the user id to push into the session
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // Deserialize the user object based on a pre-serialized token
  // which is the user id
  passport.deserializeUser((id, done) => {
    User.findOne({ _id: id }, '-salt -hashed_password').exec()
    .then((d) => {
      done(null, d);
    }).catch((err) => {
      done(err, null);
    });
  });

  // Use local strategy
  passport.use('user', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  (req, email, password, done) => {
    User.findOne({
      $or: [{ email }, { username: email }],
      roles: {
        $in: ['user']
      }
    }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {
          msg: 'text-unknown-user'
        });
      }
      if (!user.authenticate(password)) {
        return done(null, false, {
          msg: 'text-invalid-password'
        });
      }
      if (!user.verified) {
        return done(null, false, {
          msg: 'text-error-email-not-verified'
        });
      }
      return done(null, user);
    });
  }));

  passport.use('facebook-token', new FacebookTokenStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    passReqToCallback: true
  },
  (req, accessToken, refreshToken, profile, done) => {
    User.findOne({ 'facebook.id': profile.id }, (err, info) => {
      if (err) {
        return done(err);
      }
      if (info) {
        return done(err, info);
      }
      const user = new User({
        name: profile.displayName,
        email: (profile.emails && profile.emails[0].value) || `${randomstring.generate()}'@ami.com'`,
        username: profile.username || profile.emails[0].value.split('@')[0],
        provider: 'facebook',
        facebook: profile._json,
        roles: ['authenticated'],
        image: profile.photos && profile.photos[0].value,
        avatar: profile.photos && profile.photos[0].value
      });
      return user.save((error) => {
        if (error) {
          done(null, false, { message: 'text-error-facebook-login' });
        } else {
          done(error, user);
        }
      });
    });
  }));

  return passport;
})();
