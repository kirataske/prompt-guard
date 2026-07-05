import { DataTypes, Sequelize } from "sequelize";

// TODO: should we encrypt incidents database?
export const logDb = new Sequelize({
  dialect: "sqlite",
  storage: ".storage/logs.db",
});

export const logDbModel = logDb.define("Logs", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userIp: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  happenedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  severity: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "low",
  },
  attackType: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "none",
  },
  verdict: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "none",
  },
  segment: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: "",
  },
});
