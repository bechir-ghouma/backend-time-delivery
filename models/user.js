module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    average_raiting: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    avaibility: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    vehicle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name_restaurant: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'Client',
    },
    verificationCodeExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    verificationCode : {
      type: DataTypes.STRING,
      allowNull: true,
    },
    latitude: { // New attribute for latitude
      type: DataTypes.DECIMAL(15, 10), // Store latitude as DECIMAL
      allowNull: true,
    },
    longitude: { // New attribute for longitude
      type: DataTypes.DECIMAL(15, 10), // Store longitude as DECIMAL
      allowNull: true,
    },
    min_estimated_time: { // New attribute for minimum estimated time
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    max_estimated_time: { // New attribute for maximum estimated time
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    tarif_restaurant: { // New attribute for restaurant rate
      type: DataTypes.DECIMAL(10, 2), // Define DECIMAL with precision 10, scale 2
      allowNull: true,
    },
  }, {
    timestamps: false  // Disable automatic timestamps
  });

  User.associate = function(models) {
    User.hasMany(models.Order, {
      foreignKey: 'client_id',
      as: 'clientOrders',
    });

    User.hasMany(models.Order, {
      foreignKey: 'restaurant_id',
      as: 'restaurantOrders',
    });

    User.hasMany(models.Order, {
      foreignKey: 'delivery_person_id',
      as: 'deliveryPersonOrders',
    });
    User.hasMany(models.Category, {
      foreignKey: 'id_restaurant',
      as: 'categories',
    });
    User.belongsToMany(models.User, {
      through: 'UserFavorites',
      as: 'favoriteRestaurants',  // Alias for user's favorite restaurants
      foreignKey: 'userId',
      otherKey: 'restaurantId',
    });

    // A restaurant can be liked by multiple users (Clients)
    User.belongsToMany(models.User, {
      through: 'UserFavorites',
      as: 'likedByUsers',  // Alias for users who liked the restaurant
      foreignKey: 'restaurantId',
      otherKey: 'userId',
    });
  };

  return User;
};
