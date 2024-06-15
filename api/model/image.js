// image.js
import sequelize from '../database/dbconfig.js'
import { DataTypes } from 'sequelize'

const Image = sequelize.define(
  'image',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    timestamps: false
  }
)

export default Image
