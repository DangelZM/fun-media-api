const jwtAuthz = require('express-jwt-authz');

module.exports = (scopes) => {
  return jwtAuthz(scopes);
};