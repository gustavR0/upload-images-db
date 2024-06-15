import { Sequelize } from 'sequelize'

const dataConnections = {
  host: process.env.HOST || 'localhost',
  user: process.env.DBUSERNAME || 'develop',
  password: process.env.DBPASSWORD || 'develop22',
  database: process.env.DATABASE || 'puntoventa',
  dialect: 'postgres',
  port: 5432,
  pool: {
    max: 1000,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
}

const { host, user, password, database, dialect, port, pool } = dataConnections

const sequelize = new Sequelize(database, user, password, {
  host,
  dialect,
  port,
  logging: false,
  pool
});

(async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
})();

(async () => {
  await sequelize.sync()
  console.log('All models were synchronized successfully')
})()

export default sequelize
