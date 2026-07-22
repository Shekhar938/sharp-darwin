const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 3000;
const filePath = path.join(__dirname, 'index.html');

const server = http.createServer((req, res) => {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error loading index.html');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        }
    });
});

function getLocalIp() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

server.listen(PORT, '0.0.0.0', () => {
    const localIp = getLocalIp();
    console.log(`\n==================================================`);
    console.log(`🚀 Floor Plan App Server Running!`);
    console.log(`💻 On your PC:     http://localhost:${PORT}`);
    console.log(`📱 On your Mobile: http://${localIp}:${PORT}`);
    console.log(`   (Ensure phone and PC are on the same Wi-Fi)`);
    console.log(`==================================================\n`);
});
