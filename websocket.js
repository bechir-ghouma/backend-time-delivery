// websocket.js
const WebSocket = require('ws');
const wss = new WebSocket.Server({ noServer: true });

// Store active connections with their roles
const connections = new Map();

wss.on('connection', (ws, req) => {
  // Extract user ID and role from URL: /ws/{role}/{userId}
  const [, , role, userId] = req.url.split('/');
  
  if (!userId || !role) {
    ws.close();
    console.warn('Client attempted connection without proper identification');
    return;
  }

  // Store connection with role and userId
  const connectionId = `${role}-${userId}`;
  ws.connectionId = connectionId;
  ws.role = role;
  ws.userId = userId;

  connections.set(connectionId, ws);
  console.log(`WebSocket connected: ${role} ${userId}`);

  // Send connection confirmation
  sendToClient(ws, {
    type: 'connection',
    status: 'connected',
    role,
    userId
  });

  // Handle incoming messages
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received message from', connectionId, ':', data);
      
      // Handle different message types
      switch (data.type) {
        case 'ping':
          sendToClient(ws, { type: 'pong', timestamp: Date.now() });
          break;
        case 'orderAcknowledged':
          handleOrderAcknowledgment(data, ws);
          break;
        default:
          console.log('Unhandled message type:', data.type);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      sendToClient(ws, {
        type: 'error',
        message: 'Invalid message format'
      });
    }
  });

  // Handle disconnection
  ws.on('close', () => {
    console.log(`Client disconnected: ${connectionId}`);
    connections.delete(connectionId);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error for', connectionId, ':', error);
    connections.delete(connectionId);
  });
});

// Helper function to safely send messages to a client
const sendToClient = (ws, data) => {
  if (ws.readyState === WebSocket.OPEN) {
    try {
      ws.send(JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }
  return false;
};

// Notify a specific client
const notifyClient = (role, userId, data) => {
  const connectionId = `${role}-${userId}`;
  const client = connections.get(connectionId);
  
  if (client) {
    console.log(`Sending message to ${role} ${userId}:`, data);
    return sendToClient(client, data);
  } else {
    console.log(`No active connection for ${role} ${userId}`);
    return false;
  }
};

// Notify restaurant about new order
const notifyRestaurant = (restaurantId, orderData) => {
  return notifyClient('restaurant', restaurantId, {
    type: 'newOrder',
    timestamp: Date.now(),
    order: orderData
  });
};
// Notify livreur about new order
const notifyLivreur = (delivery_person_id, orderData) => {
  return notifyClient('delivery_person', delivery_person_id, {
    type: 'newOrder',
    timestamp: Date.now(),
    order: orderData
  });
};

// Notify customer about order status
const notifyCustomer = (customerId, orderData) => {
  return notifyClient('customer', customerId, {
    type: 'orderUpdate',
    timestamp: Date.now(),
    order: orderData
  });
};

// Handle order acknowledgment
const handleOrderAcknowledgment = (data, ws) => {
  const { orderId, status } = data;
  console.log(`Order ${orderId} acknowledged by restaurant ${ws.userId}`);
  // You can add additional logic here if needed
};

const setupWebSocket = (server) => {
  server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });
};

// Keep connections alive
setInterval(() => {
  connections.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      sendToClient(ws, { type: 'ping' });
    }
  });
}, 30000); // Send ping every 30 seconds

module.exports = {
  wss,
  notifyClient,
  notifyRestaurant,
  notifyLivreur,
  notifyCustomer,
  setupWebSocket
};