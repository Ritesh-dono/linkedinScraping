
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

const Profile = sequelize.define('Profile', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  about: {
    type: DataTypes.TEXT
  },
  bio: {
    type: DataTypes.TEXT
  },
  location: {
    type: DataTypes.STRING
  },
  followerCount: {
    type: DataTypes.INTEGER
  },
  connectionCount: {
    type: DataTypes.INTEGER
  }
});

sequelize.sync();

module.exports = Profile;
