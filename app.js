// const express = require('express');
// const { sequelize } = require('./models');
// const userRoutes = require('./src/routes/userRoutes');
// const orderRoutes = require('./src/routes/orderRoutes');
// const lineOrderRoutes = require('./src/routes/lineOrderRoutes');
// const categoryRoutes = require('./src/routes/categoryRoutes');
// const menuRoutes  = require('./src/routes/menuRoutes');
// const favoritesRoutes  = require('./src/routes/favoritesRoutes');
// const reclamationsRoutes  = require('./src/routes/reclamationRoutes');
// const ratingRoutes  = require('./src/routes/ratingRoutes');
// const scheduleRoutes  = require('./src/routes/scheduleRoutes');
// const cors = require('cors'); // Import the cors package
// const path = require('path');


// const app = express();
// app.use(express.json()); // This line is crucial

// app.use(cors());

// app.use('/users', userRoutes);
// app.use('/orders', orderRoutes);
// app.use('/line-orders', lineOrderRoutes);
// app.use('/categories', categoryRoutes);
// app.use('/menus', menuRoutes);
// app.use('/favorites', favoritesRoutes);
// app.use('/reclamations', reclamationsRoutes);
// app.use('/ratings', ratingRoutes);
// app.use('/schedule', scheduleRoutes);
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, async () => {
//   console.log(`Server is running on port ${PORT}`);
//   await sequelize.sync();
// });

const express = require('express');
const { sequelize } = require('./models');
const userRoutes = require('./src/routes/userRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const lineOrderRoutes = require('./src/routes/lineOrderRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const menuRoutes  = require('./src/routes/menuRoutes');
const favoritesRoutes  = require('./src/routes/favoritesRoutes');
const reclamationsRoutes  = require('./src/routes/reclamationRoutes');
const ratingRoutes  = require('./src/routes/ratingRoutes');
const scheduleRoutes  = require('./src/routes/scheduleRoutes');
const cors = require('cors'); // Import the cors package
const path = require('path');
const { createServer } = require('http');
const WebSocket = require('ws');
const http = require('http');
const { broadcast, notifyClient } = require('./websocket');

const app = express();
const server = http.createServer(app);

const wss = new WebSocket.Server({ noServer: true });;

app.use(express.json());
app.use(cors());

app.use('/users', userRoutes);
app.use('/orders', orderRoutes);
app.use('/line-orders', lineOrderRoutes);
app.use('/categories', categoryRoutes);
app.use('/menus', menuRoutes);
app.use('/favorites', favoritesRoutes);
app.use('/reclamations', reclamationsRoutes);
app.use('/ratings', ratingRoutes);
app.use('/schedule', scheduleRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

wss.on('connection', (ws, req) => {
  const userId = req.url.split('/').pop();
  if (!userId) {
    ws.close();
    console.warn('Client attempted connection without user ID');
    return;
  }
  console.log(`Client connected with ID: ${userId}`);

  ws.userId = userId;
  console.log(`WebSocket connected for user ${userId}`);

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received:', data);
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    console.log(`Client disconnected: ${userId}`);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Helper function to send messages to specific clients
// function notifyClient(userId, data) {
//   wss.clients.forEach(client => {
//     if (client.readyState === WebSocket.OPEN && client.userId === userId) {
//       client.send(JSON.stringify(data));
//     }
//   });
// }

const sendToUser = (userId, data) => {
  wss.clients.forEach((client) => {
    if (client.userId === userId && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

// Export the sendToUser function so it can be used in your routes
app.locals.sendToUser = notifyClient;

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, ws => {
    wss.emit('connection', ws, request);
  });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});

module.exports = { wss, notifyClient };