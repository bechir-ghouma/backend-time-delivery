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
  }, {
    timestamps: false,
  });

  // Association avec Category
  Menu.associate = function(models) {
    Menu.belongsTo(models.Category, {
      foreignKey: 'id_category',
      as: 'category',
    });
  };

  return Menu;
};
