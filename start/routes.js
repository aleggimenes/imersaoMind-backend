'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
Route.resource("users", "UserController").apiOnly();
Route.resource("histories", "HistoryController").apiOnly();
Route.post("auth", "UserController.auth")
Route.post("generateToken", "UserController.generateToken")
Route.post("confirmToken", "UserController.confirmToken")
Route.post("updatePassword", "UserController.updatePassword")
Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})