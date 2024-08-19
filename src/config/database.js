import dotenv from 'dotenv'
import pg from 'pg'
dotenv.config()

export const configDatabase = {
  dialect: process.env.DB_DIALECT,
  dialectModule: pg,
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DE_PASSOWRD,
  database: process.env.DB_DATABASE,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  }
}