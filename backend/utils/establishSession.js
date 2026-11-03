function establishSession(req, user) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((regenerateError) => {
      if (regenerateError) {
        return reject(regenerateError);
      }

      req.login(user, (loginError) => {
        if (loginError) {
          return reject(loginError);
        }
        resolve();
      });
    });
  });
}

module.exports = establishSession;