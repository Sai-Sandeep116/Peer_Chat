'use strict';

const { GlobalKeyboardListener } = require('node-global-key-listener');
const http = require('http');
const WebSocket = require('ws');

// Create HTTP server
const server = http.createServer();
const wss = new WebSocket.Server({ server });

// Array to store connected clients
let clients = [];

// Listen for WebSocket connections
wss.on('connection', (ws) => {
    clients.push(ws);
    ws.on('close', () => {
        clients = clients.filter((client) => client !== ws);
    });
    console.log('Client connected');
});

// Keyboard listener setup
const keyboardListener = new GlobalKeyboardListener();

keyboardListener.addListener((event) => {
    if (event.state === 'DOWN') {
        const key = event.name;

        // Send the key to all connected clients
        clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(key);
            }
        });
    }
});

// Start the server
server.listen(3000, () => {
    console.log('WebSocket server is running on port 3000');
});
