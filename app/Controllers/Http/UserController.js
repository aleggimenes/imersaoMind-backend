'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const Database = use('Database')
const User = use("App/Models/User");
/**
 * Resourceful controller for interacting with users
 */
class UserController {
  /**
   * Show a list of all users.
   * GET users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    try{
      const users = await Database.select("*").from("users");
      return response.json({users});
    } catch(error){
      console.log('Erro index: ',error);
      return response.status(400).json({error});
    }

  }

  /**
   * Create/save a new user.
   * POST users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    try{
      const data = request.post();
      const user = await User.create(data);
      return response.json({user});
    } catch(error){
      console.log('Erro create: ',error);
      return response.status(400).json({error})
    }
  }

  /**
   * Display a single user.
   * GET users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    try{
      if(params.id){
        const user = await Database.table("users")
        .where({ id: params.id})
        .first();
        return response.json({user});
      }else{
        const user = await Database.table("users")
        .where({ id: auth.user.id})
        .first();
        return response.json({ user});
      }
    }catch(error){
      console.log('Erro show: ',error);
      return response.status(400).json({error});
    }
  }


  async auth({auth, request, response}){
    try{
        const {login, password} = request.post();
        const isEmail = login.indexOf('@') >= 0;
        if(isEmail){
          const access = await auth.attempt(login, password);
          const user = await User.findBy("email", login)
          return response.send({ user, access});
        }else{
          const user = await User.findBy("cpf", login);
          const access = await auth.authenticator('cpf').attempt(login,password)
          return response.send({ user, access});
        }    
    }catch(err){
        console.log(err)
        return response.status(400).send('ruim')
    }
}
  /**
   * Update user details.
   * PUT or PATCH users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    try{
      const data = request.post();
      const user = await User.find(params.id);
      if(user.email == data.email){
        return response.status(400).send('Email ja existe');
      }
      if(user.cpf == data.email){
        return response.status(400).send('CPF ja existe');
      }
      
      user.merge(data);
      await user.save();
      return response.json({user})
    } catch(error){
      console.log('Erro update: ',error);
      return response.status(400).json({error});
    }
  }

  /**
   * Delete a user with id.
   * DELETE users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    try{
      await Database.table("users").where({ id: params.id}).delete()
      return response.json('Deletado com sucesso');
    } catch(error){
      console.log('Erro destroy: ',error);
      return response.status(400).json({error})
    }
  }
}

module.exports = UserController
