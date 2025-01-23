module.exports = (sequelize, DataTypes) => {
  const UserFavorites = sequelize.define('UserFavorites', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',  // Reference to the User model
        key: 'id',
      },
    },
    restaurantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',  // Reference to the Restaurant model (which is also a User with the role of 'Restaurant')
        key: 'id',
      },
    },
  }, {
    timestamps: false,
    tableName: 'userfavorites',
  });

  return UserFavorites;
};
