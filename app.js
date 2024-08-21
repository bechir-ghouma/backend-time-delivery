const express = require('express');
const { sequelize } = require('./models');
const userRoutes = require('./src/routes/userRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const lineOrderRoutes = require('./src/routes/lineOrderRoutes');

const app = express();

app.use(express.json());
app.use('/users', userRoutes);
app.use('/orders', orderRoutes);
app.use('/line-orders', lineOrderRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await sequelize.sync(); // Sync models with the database
});
