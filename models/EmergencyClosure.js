module.exports = (sequelize, DataTypes) => {
    const EmergencyClosure = sequelize.define('EmergencyClosure', {
      isClosed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      reopenDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      restaurant_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      date: {
        type: DataTypes.DATEONLY, // Format YYYY-MM-DD
        allowNull: true, // Peut être optionnel
    },
    }, {
        timestamps: false,  // Enables `createdAt` and `updatedAt` fields
      });
  
  
    return EmergencyClosure;
  };
  