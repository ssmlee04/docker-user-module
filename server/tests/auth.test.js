import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import should from 'should';
import equals from 'array-equal';
import chai, { expect } from 'chai';
import app from '../../index';
import User from '../models/user.model';
import config from '../../config/config';

chai.config.includeStack = true;

const validUserCredentials = {
  email: 'admin@gmail.com',
  username: 'username',
  name: 'name',
  password: 'password',
};
let savedValidUser;

const invalidUserCredentials = {
  email: 'admin@gmail.com',
  password: 'wrong',
};


/**
 * root level hooks
 */

describe('## Auth APIs', () => {
  let jwtToken;

  before(done => {
    User.remove().exec()
    .then(() => User.insert(validUserCredentials))
    .then(d => {
      savedValidUser = JSON.parse(JSON.stringify(d));
    })
    .then(() => User.verify(savedValidUser._id))
    .then(() => done())
    .catch(err => {
      should.not.exist(err);
      done();
    });
  });

  describe('# POST /api/auth/login', () => {
    it('should return Authentication error', done => {
      request(app)
        .post('/api/auth/login')
        .send(invalidUserCredentials)
        .expect(httpStatus.UNAUTHORIZED)
        .then(res => {
          expect(res.body.error).to.equal('text-invalid-password');
          done();
        });
    });

    it('should get valid JWT token', done => {
      request(app)
        .post('/api/auth/login')
        .send(validUserCredentials)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.have.property('token');
          jwt.verify(res.body.token, config.jwtSecret, (err, decoded) => {
            should.not.exist(err); // eslint-disable-line no-unused-expressions
            decoded._id.should.equal(savedValidUser._id);
            equals(decoded.roles, savedValidUser.roles).should.equal(true);
            jwtToken = `Bearer ${res.body.token}`;
            done();
          });
        })
        .catch(done);
    });
  });

  describe('# GET /api/auth/random-number', () => {
    it('should fail to get random number because of missing Authorization', done => {
      request(app)
        .get('/api/auth/random-number')
        .expect(httpStatus.UNAUTHORIZED)
        .then(res => {
          expect(res.body.message).to.equal('Unauthorized');
          done();
        })
        .catch(done);
    });

    it('should fail to get random number because of wrong token', done => {
      request(app)
        .get('/api/auth/random-number')
        .set('Authorization', 'Bearer inValidToken')
        .expect(httpStatus.UNAUTHORIZED)
        .then(res => {
          expect(res.body.message).to.equal('Unauthorized');
          done();
        })
        .catch(done);
    });

    it('should get a random number', done => {
      request(app)
        .get('/api/auth/random-number')
        .set('Authorization', jwtToken)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.num).to.be.a('number');
          done();
        })
        .catch(done);
    });
  });

  after(done => {
    // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
    User.remove().exec()
    .then(() => {
      // mongoose.models = {};
      // mongoose.modelSchemas = {};
      // mongoose.connection.close();
      done();
    });
  });
});
