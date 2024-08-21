module.exports = (sequelize, DataTypes) => {
  const LineOrder = sequelize.define('LineOrder', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Orders',
        key: 'id',
      },
    },
    product: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unit_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  }, {
    timestamps: false  // Disable automatic timestamps
  });

  LineOrder.associate = function(models) {
    LineOrder.belongsTo(models.Order, {
      foreignKey: 'order_id',
      as: 'order',
    });
  };

  return LineOrder;
};
