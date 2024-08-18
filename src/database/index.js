import Sequelize from 'sequelize'


import configDatabase from '../config/database'
import Token from '../app/models/Token'

const models = [Token]

class Database {
  constructor() {
    this.init()
  }

  init() {
    this.connection = new Sequelize(configDatabase)
    models.map((model) => model.init(this.connection))
  }
}

export default new Database()