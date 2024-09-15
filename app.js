const express = require('express');
const { sequelize } = require('./models');
const userRoutes = require('./src/routes/userRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const lineOrderRoutes = require('./src/routes/lineOrderRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const menuRoutes  = require('./src/routes/menuRoutes');
const cors = require('cors'); // Import the cors package
const path = require('path');


const app = express();
app.use(express.json()); // This line is crucial

app.use(cors());

app.use('/users', userRoutes);
app.use('/orders', orderRoutes);
app.use('/line-orders', lineOrderRoutes);
app.use('/categories', categoryRoutes);
app.use('/menus', menuRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await sequelize.sync(); // Sync models with the database
});
