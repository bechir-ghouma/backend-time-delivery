const WebSocket = require('ws');
const wss = new WebSocket.Server({ noServer: true });

const initializeWebSocket = async () => {
  const storedUserId = await AsyncStorage.getItem('id');
  // Replace with your actual server URL
  const ws = new WebSocket(`ws://192.168.1.110:3000/ws/${storedUserId}`);
  
  ws.onopen = () => {
    console.log('WebSocket Connected');
  };

  ws.onmessage = async (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log('Received WebSocket message:', data);
      
      if (data.type === 'NEW_ORDER') {
        // Add new order to the beginning of the list
        setPendingOrders(prevOrders => {
          const newOrder = {
            ...data.order,
            isReady: false
          };
          
          // Create new array with new order at the beginning
          const updatedOrders = [newOrder, ...prevOrders];
          return updatedOrders;
        });

        // Start ringing
        await startRinging();

        Alert.alert(
          "Nouvelle Commande!",
          `Commande #${data.order.id}\nClient: ${data.order.client?.first_name || data.order.name_client}`,
          [
            {
              text: "Voir la commande",
              onPress: () => {
                stopRinging();
                openOrderDetails(data.order);
              },
            },
            {
              text: "Plus tard",
              onPress: () => stopRinging(),
              style: "cancel"
            },
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  ws.onclose = () => {
    console.log('WebSocket disconnected');
    // Attempt to reconnect after 5 seconds
    setTimeout(initializeWebSocket, 5000);
  };
// Broadcast message to all connected clients
function broadcast(data) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// Notify specific client by userId
function notifyClient(userId, data) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN && client.userId === userId) {
      client.send(JSON.stringify(data));
    }
  });
}

module.exports = { wss, broadcast, notifyClient };

  webSocketRef.current = ws;
};