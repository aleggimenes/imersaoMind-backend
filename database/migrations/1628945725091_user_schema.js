'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('name', 80).notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.string('cpf', 20).notNullable().unique()
      table.string('recovery_token', 100)
      table.string('access_level').notNullable().defaultTo(1)
      .comment('0 - Admin');
      table.integer('saldo').notNullable().defaultTo(50000)
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
