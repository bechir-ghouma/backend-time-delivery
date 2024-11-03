module.exports = (sequelize, DataTypes) => {
    const RegularSchedule = sequelize.define('RegularSchedule', {
      day: {
        type: DataTypes.STRING, // e.g., 'monday', 'tuesday'
        allowNull: false,
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      openTime: {
        type: DataTypes.STRING, // e.g., '08:00'
        allowNull: true,
      },
      closeTime: {
        type: DataTypes.STRING, // e.g., '21:00'
        allowNull: true,
      },
      restaurant_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    }, {
        timestamps: false,  // Enables `createdAt` and `updatedAt` fields
      });
  
    return RegularSchedule;
  };
  