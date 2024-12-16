
export default (sequelize, Sequelize) => {
  const User = sequelize.define("User", {
    _id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4, // Or you can use `defaultValue: uuidv4()`
      primaryKey: true,
    },
    username: { 
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    email: { 
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: { 
      type: Sequelize.STRING,
      allowNull: false,
    },
    github_id: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    github_username: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    avatar_url: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    auth_provider: {
      // github if login with github 
      // else local
      type: Sequelize.STRING,
      allowNull: false,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'users',
    timestamps: true
  });
  
  return User;
};