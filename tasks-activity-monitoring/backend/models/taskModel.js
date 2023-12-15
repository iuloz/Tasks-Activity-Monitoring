const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.db'
});


class Task extends Model { }
Task.init({
    id: {
        type: DataTypes.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    task: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tags: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            const tagsString = this.getDataValue('tags');
            return tagsString;
        },
        set(value) {
            this.setDataValue('tags', JSON.stringify(value));
        }
    },
    start: {
        type: DataTypes.STRING,
        allowNull: true,
        get() {
            const startTime = this.getDataValue('start');
            return startTime;
        },
        set(value) {
            this.setDataValue('start', JSON.stringify(value));
        }
    },
    end: {
        type: DataTypes.STRING,
        allowNull: true,
        get() {
            const endTime = this.getDataValue('end');
            return endTime;
        },
        set(value) {
            this.setDataValue('end', JSON.stringify(value));
        }
    }
}, {
    sequelize,
    tableName: 'tasks',
    timestamps: false
});


module.exports = Task;
