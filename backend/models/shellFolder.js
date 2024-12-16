
export default (sequelize, Sequelize) => {
    const ShellFolder = sequelize.define("ShellFolder", {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4, // Or you can use `defaultValue: uuidv4()`
        primaryKey: true,
      },
      folder_name: { 
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      username: { 
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
      tableName: 'shellFolders',
      timestamps: true
    });
    
    return ShellFolder;
  };