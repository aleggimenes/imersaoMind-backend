'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Database = use('Database')
const History = use("App/Models/History")
const User = use("App/Models/User");
/**
 * Resourceful controller for interacting with histories
 */
class HistoryController {
  /**
   * Show a list of all histories.
   * GET histories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */

  async index({ request, response, view }) {
    try {
      const history = await Database.select("*").from("histories");
      return response.status(200).json({ history })
    } catch (error) {
      console.log('SOM');
      return response.status(400).json({ error });
    }
  }

  /**
   * Render a form to be used for creating a new history.
   * GET histories/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {
  }

  /**
   * Create/save a new history.
   * POST histories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    try {
      const { cpf_sender, cpf_receiver, value } = request.post();

      const user_sender = await User.findBy("cpf", cpf_sender);

      const user_receiver = await User.findBy("cpf", cpf_receiver);

      if (!user_receiver || !user_sender) {
        return response.status(400).send('Usuario não encontrado');
      } else {
        if (value > user_sender.saldo) {
          await History.create({ cpf_sender, cpf_receiver, value, status: 0, transation_log: 'Saldo Insuficiente' })
          return response.status(400).send('Saldo Insuficiente');
        } else {
          user_sender.saldo = (user_sender.saldo - value)
          user_receiver.saldo = (user_receiver.saldo + value)
          await user_receiver.save();
          await user_sender.save();
          await History.create({ cpf_sender, cpf_receiver, value, transation_log: 'Transferência Realizada' })
        }
      }
      return response.status(200).send('Transferencia Realizada')
    } catch (error) {
      console.log(error);
      return response.status(400).send('Algo deu errado');
    }

  }

  /**
   * Display a single history.
   * GET histories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing history.
   * GET histories/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
  }

  /**
   * Update history details.
   * PUT or PATCH histories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
  }

  async userTransations({ params, request, auth, response }) {
    try{
      const user_sender = auth.getUser();
      const history = History.query().where('cpf_sender', user_sender.cpf).orWhere('cpf_receiver', user_sender.cpf).fetch()
      for(var i = 0 ; i < history.rows.length ; i++){
        if(history.rows[i].cpf_sender === user_sender.cpf){
          history.rows[i].entrada = 0;
        }else{
          history.rows[i].entrada = 1;
        }
      }
      return response.status(200).json(history.rows)
    }catch(err){
      return response.status(400).send({err})
    }
  }
  /**
   * Delete a history with id.
   * DELETE histories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
  }
}

module.exports = HistoryController
