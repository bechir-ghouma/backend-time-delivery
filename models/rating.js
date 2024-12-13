// models/Rating.js
module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define('Rating', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    restaurantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
  }, {
    timestamps: false,  // Enables `createdAt` and `updatedAt` fields
  });
  Rating.associate = function (models) {
    Rating.belongsTo(models.User, {
      foreignKey: 'restaurantId',
      as: 'restaurantDetails', // Alias utilisé dans la requête
    });
  };
  

  return Rating;
};
