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
// const { createServer } = require('http');
// const WebSocket = require('ws');
// // const http = require('http');
// const { wss, notifyClient } = require('./websocket');

// const app = express();
// const server = createServer(app);

// // const wss = new WebSocket.Server({ noServer: true });

// app.use(express.json());
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



// // Export the sendToUser function so it can be used in your routes
// app.locals.sendToUser = notifyClient;

// server.on('upgrade', (request, socket, head) => {
//   wss.handleUpgrade(request, socket, head, ws => {
//     wss.emit('connection', ws, request);
//   });
// });

// server.listen(3000, () => {
//   console.log('Server listening on port 3000');
// });

// module.exports = app;
const express = require('express');
const { sequelize } = require('./models');
const userRoutes = require('./src/routes/userRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const lineOrderRoutes = require('./src/routes/lineOrderRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const menuRoutes = require('./src/routes/menuRoutes');
const favoritesRoutes = require('./src/routes/favoritesRoutes');
const reclamationsRoutes = require('./src/routes/reclamationRoutes');
const ratingRoutes = require('./src/routes/ratingRoutes');
const scheduleRoutes = require('./src/routes/scheduleRoutes');
// const notifRoutes = require('./src/routes/notificationRoutes');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { createServer } = require('http');
const { wss, notifyClient } = require('./websocket');
const cors = require('cors');

const app = express();
const server = createServer(app);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  headers: true,
});

app.use(limiter);

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
// app.use('/notif', notifRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.locals.sendToUser = notifyClient;

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, ws => {
    wss.emit('connection', ws, request);
  });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});

module.exports = app;
