import { sequelize } from './dbSequelize.js'
import * as model from './models/models.js'
import dotenv from "dotenv";
dotenv.config();

(async () => {
  try {
    await sequelize.authenticate();
    console.log(model)
    await sequelize.sync()
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})()
