module.exports = (sequelize, DataTypes) => {
  const Menu = sequelize.define('Menu', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    id_category: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Categories', // Fait référence au modèle Category
        key: 'id',
      },
    },
    promotion: {
      type: DataTypes.INTEGER,  // Add promotion as an integer type
      allowNull: true,          // Set to true if promotion is optional
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,  // New attribute, with default value
      allowNull: false,
    },
  }, {
    timestamps: false,
    tableName: 'menus'
  });

  // Association avec Category
  Menu.associate = function(models) {
    Menu.belongsTo(models.Category, {
      foreignKey: 'id_category',
      as: 'category',
    });
    Menu.hasMany(models.LineOrder, {
      foreignKey: 'menu_id',
      as: 'line_orders',
    });
  };

  return Menu;
};
