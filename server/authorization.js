/*
 * Generic require login routing middleware
 */
exports.requiresLogin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.json(401, {
      error: 'text-error-user-unauthorized'
    });
  }
  return next();
};

/*
 * Generic require Admin routing middleware
 * Basic Role checking - future release with full permission system
 */
exports.requiresAdmin = (req, res, next) => {
  if (!req.isAuthenticated() || !(req.user.hasRole('admin') || req.user.hasRole('root'))) {
    return res.json(401, {
      error: 'text-error-user-not-admin'
    });
  }
  return next();
};

/*
 * Generic require Root Admin routing middleware
 * Basic Role checking - future release with full permission system
 */
exports.requiresRootAdmin = (req, res, next) => {
  if (!req.isAuthenticated() || !req.user.hasRole('root')) {
    return res.json(401, {
      error: 'text-error-user-not-root'
    });
  }
  return next();
};
