// websocket.js
const WebSocket = require('ws');
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws, req) => {
  const userId = req.url.split('/').pop();
  if (!userId) {
    ws.close();
    console.warn('Client attempted connection without user ID');
    return;
  }
  ws.userId = userId;
  console.log(`WebSocket connected for user ${userId}`);

  // Send a test message to this user
  notifyClient(userId, { type: 'test', message: 'Hello from server!' });

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received:', data);
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => console.log(`Client disconnected: ${userId}`));
  ws.on('error', (error) => console.error('WebSocket error:', error));
});


const notifyClient = (userId, data) => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN && client.userId === userId) {
      console.log(`Sending message to user ${userId}:`, data);  // Add log here
      client.send(JSON.stringify(data));
    }
  });
};


const setupWebSocket = (server) => {
  server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });
};

module.exports = { wss, notifyClient, setupWebSocket };
