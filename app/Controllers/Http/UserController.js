'use strict'
const moment = require('moment');
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
  async index({ request, response, view }) {
    try {
      const users = await Database.select("*").from("users");
      return response.json({ users });
    } catch (error) {
      console.log('Erro index: ', error);
      return response.status(400).json({ error });
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
  async generateToken({ request, response }) {
    try {
      const { cpf } = request.post();
      const user = User.findBy('cpf', cpf);
      const rand = Math.floor(10000000 + Math.random * 90000000);
      const expiration = moment().add(1, 'hour').format('YYYY:MM:DD HH:mm:ss')
      user.recovery_token = rand;
      user.token_expiration = expiration
      user.save()
      return response.status(200).send('Email enviado');
    } catch (error) {
      return response.status(400).send({ error });
    }
  }

  async confirmToken({request, response, auth}){
    try{
      const {token} = request.post();
      const user = User.findBy('token', token);
      if(user){
        const now = moment().format('YYYY:MM:DD HH:mm:ss')
        const expiration = moment(user.token_expiration).format('YYYY:MM:DD HH:mm:ss')
        if(expiration >= now){
          const access =  await auth.generate(user)
          return response.status(200).send({access})
        }else{
          return response.status(400).send('Token expirado')
        }
      }else{
        return response.status(400).send('Token Inválido');
      }
    }catch(error){
      return response.status(400).send('Deu ruim')
    }
  }
  async updatePassword({request, response, auth}){
    try{
      const user = await auth.getUser()
      const {newPassword} =  request.post();
      user.password = newPassword
      user.save();
      return response.status(200).send({user});
    }catch(error){
      return response.status(400).send({error})
    }
  }
  async store({ request, response }) {
    try {
      const { name, email, cpf, password } = request.post();
      const isEmail = await User.find('email', email);
      const isCPF = await User.find('cpf', cpf);
      if (isCPF) {
        return response.status(400).send('CPF ja existe');
      }
      if (isEmail) {
        return response.status(400).send('Email já existe');
      }
      const user = await User.create({ name, email, cpf, password });
      return response.json({ user });
    } catch (error) {
      console.log('Erro create: ', error);
      return response.status(400).json({ error })
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
  async show({ params, request, response, view }) {
    try {
      if (params.id) {
        const user = await Database.table("users")
          .where({ id: params.id })
          .first();
        return response.json({ user });
      } else {
        const user = await Database.table("users")
          .where({ id: auth.user.id })
          .first();
        return response.json({ user });
      }
    } catch (error) {
      console.log('Erro show: ', error);
      return response.status(400).json({ error });
    }
  }


  async auth({ auth, request, response }) {
    try {
      const { login, password } = request.post();
      const isEmail = login.indexOf('@') >= 0;
      if (isEmail) {
        const access = await auth.attempt(login, password);
        const user = await User.findOrFail("email", login)
        return response.status(200).send({ user, access });
      } else {
        const user = await User.findOrFail("cpf", login);
        const access = await auth.authenticator('cpf').attempt(login, password)
        return response.send({ user, access });
      }
    } catch (err) {
      console.log(err)
      return response.status(400).send({err})
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
  async update({ params, request, response }) {
    try {
      const { name, email, cpf, password } = request.post();
      const user = await User.find(params.id);
      const isEmail = await User.findBy('email', email);
      const isCPF = await User.findBy('cpf', cpf);
      if (isCPF && isEmail) {
        return response.status(400).send('Email e CPF ja existe');
      }
      if (isCPF) {
        return response.status(400).send('CPF ja existe');
      }

      if (isEmail) {
        return response.status(400).send('Email já existe');
      }
      user.merge({ name, email, cpf, password });
      await user.save();
      return response.json({ user })
    } catch (error) {
      console.log('Erro update: ', error);
      return response.status(400).json({ error });
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
  async destroy({ params, request, response }) {
    try {
      await Database.table("users").where({ id: params.id }).delete()
      return response.json('Deletado com sucesso');
    } catch (error) {
      console.log('Erro destroy: ', error);
      return response.status(400).json({ error })
    }
  }
}

module.exports = UserController
