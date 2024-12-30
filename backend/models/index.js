import Sequelize from "sequelize";
import createUserModel from './user.js';
import createShellFolderModel from './shellFolder.js';
import { config } from "dotenv";
// config();

config({
  path: '.env'
})


const sequelize = new Sequelize(process.env.MYSQL_URL_DOCKER, {
  logging: false
});


try {
  await sequelize.authenticate();    // Check whether the connection is established or not.
  console.log('Connection with MySql has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = createUserModel(sequelize, Sequelize);
db.shellFolders = createShellFolderModel(sequelize, Sequelize);

export default db;