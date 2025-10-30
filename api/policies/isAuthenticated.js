/**
 * isAuthenticated
 *
 * @description :: Policy to check if user is authenticated
 * @help        :: See https://sailsjs.com/docs/concepts/policies
 */

module.exports = async function (req, res, next) {
  
  // Check if user is logged in
  if (req.session.userId) {
    // User is authenticated, proceed
    return next();
  }

  // User is not authenticated
  if (req.wantsJSON) {
    return res.unauthorized({ error: 'Authentication required' });
  }

  // Redirect to login page
  return res.redirect('/auth/login');
};
