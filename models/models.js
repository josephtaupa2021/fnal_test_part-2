const { Model, DataTypes, Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "temp.db"          // temp.db is created in the root directory for storage
})

class User extends Model { }
User.init({
    role: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
}, { freezeTableName: true, sequelize, modelName: 'User' })

class Message extends Model { }
Message.init({
    content: DataTypes.STRING,
    creator: DataTypes.STRING, // creator attribute for  creator: user.username
    time: DataTypes.TIME,
}, { sequelize, modelName: 'Message' })

class Session extends Model { }
Session.init({
    user: DataTypes.STRING,
    sessionID: DataTypes.UUID,
    timeOfLogin: DataTypes.DATE
}, { sequelize, modelName: 'Session' });

User.hasMany(Message)
Message.belongsTo(User);

(async () => {
    await sequelize.sync()   // .sync() is initialized for persistence (especially for count (likes))
})()

module.exports = {
    User,
    Message,
    Session,
    sequelize
}