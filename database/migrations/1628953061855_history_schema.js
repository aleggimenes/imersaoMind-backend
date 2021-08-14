'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class HistorySchema extends Schema {
  up () {
    this.create('histories', (table) => {
      table.increments()
      table.string('cpf_sender').references("cpf").inTable("users").onUpdate("CASCADE")
      .onDelete("CASCADE");
      table.string("cpf_receiver").references("cpf").inTable("users").onUpdate("CASCADE")
      .onDelete("CASCADE");
      table.integer('value');
      table.boolean('status').defaultTo(1);
      table.string('transation_log')
      table.timestamps()
    })
  }

  down () {
    this.drop('histories')
  }
}

module.exports = HistorySchema
