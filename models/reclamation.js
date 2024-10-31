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
      name_restaurant: {  // New attribute for restaurant name
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone_number: {  // New attribute for phone number
        type: DataTypes.STRING,
        allowNull: true,
      },
      order_id: {  // New foreign key for order
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Order',
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
      Reclamation.belongsTo(models.Order, {
        foreignKey: 'order_id',
        as: 'order',
      });
    };
  
    return Reclamation;
  };
  