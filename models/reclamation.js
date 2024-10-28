// models/reclamation.js

module.exports = (sequelize, DataTypes) => {
    const Reclamation = sequelize.define('Reclamation', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'En Attente',  // Default status
      },
      client_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'User',  
          key: 'id',
        },
      },
    }, {
      timestamps: false,  // Enables `createdAt` and `updatedAt` fields
    });
  
    Reclamation.associate = (models) => {
      Reclamation.belongsTo(models.User, {
        foreignKey: 'client_id',
        as: 'client',
      });
    };
  
    return Reclamation;
  };
  