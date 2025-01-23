module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    restaurant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    delivery_person_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    order_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    delivery_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estimated_delivery_time: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name_client: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ingredientExclure: { // New attribute for excluded ingredients
      type: DataTypes.STRING,
      allowNull: true, // Allow null if you don't want it to be mandatory
    },
    phone: { // New attribute for phone number
      type: DataTypes.STRING,
      allowNull: true, // Allow null if you don't want it to be mandatory
    },
    latitude: { // New attribute for latitude
      type: DataTypes.DECIMAL(15, 10), // Store latitude as DECIMAL
      allowNull: true, // Allow null if you don't want it to be mandatory
    },
    longitude: { // New attribute for longitude
      type: DataTypes.DECIMAL(15, 10), // Store longitude as DECIMAL
      allowNull: true, // Allow null if you don't want it to be mandatory
    },
    tarif_livraison: { // Nouveau champ pour tarif de livraison
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true, // Optionnel, selon vos besoins
    },
  }, {
    timestamps: false,  // Disable automatic timestamps
    tableName: 'orders'
  });

  Order.associate = function(models) {
    Order.belongsTo(models.User, {
      foreignKey: 'client_id',
      as: 'client',
    });

    Order.belongsTo(models.User, {
      foreignKey: 'restaurant_id',
      as: 'restaurant',
    });

    Order.belongsTo(models.User, {
      foreignKey: 'delivery_person_id',
      as: 'delivery_person',
    });

    Order.hasMany(models.LineOrder, {
      foreignKey: 'order_id',
      as: 'lines_order',
    });
  };

  return Order;
};
