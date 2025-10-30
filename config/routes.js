/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': { view: 'pages/homepage' },

  // Auth routes (public)
  'GET /auth/login': 'AuthController.showLogin',
  'POST /auth/send-otp': 'AuthController.sendOTP',
  'GET /auth/verify': { view: 'pages/auth/verify-otp' },
  'POST /auth/verify-otp': 'AuthController.verifyOTP',
  'POST /auth/logout': 'AuthController.logout',
  'GET /auth/me': 'AuthController.me',

  // Deck routes (protected)
  'GET /deck': { controller: 'DeckController', action: 'index', policy: 'isAuthenticated' },
  'GET /deck/new': { controller: 'DeckController', action: 'new', policy: 'isAuthenticated' },
  'POST /deck': { controller: 'DeckController', action: 'create', policy: 'isAuthenticated' },
  'GET /deck/:id': { controller: 'DeckController', action: 'show', policy: 'isAuthenticated' },
  'GET /deck/:id/edit': { controller: 'DeckController', action: 'edit', policy: 'isAuthenticated' },
  'PUT /deck/:id': { controller: 'DeckController', action: 'update', policy: 'isAuthenticated' },
  'POST /deck/:id': { controller: 'DeckController', action: 'update', policy: 'isAuthenticated' },
  'DELETE /deck/:id': { controller: 'DeckController', action: 'destroy', policy: 'isAuthenticated' },
  'POST /deck/:id/delete': { controller: 'DeckController', action: 'destroy', policy: 'isAuthenticated' },

  // API routes
  'GET /api/deck': 'DeckController.find',
  'POST /api/deck': 'DeckController.create',
  'GET /api/deck/:id': 'DeckController.show',
  'PUT /api/deck/:id': 'DeckController.update',
  'DELETE /api/deck/:id': 'DeckController.destroy',

  // Legacy routes (keep for compatibility)
  'GET /deck/get': 'DeckController.find',
  'GET /puzzle-image/get': 'PuzzleImageController.find',

  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


};
