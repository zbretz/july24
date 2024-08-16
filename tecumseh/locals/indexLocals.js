const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const httpRouterLocals = require('./httpRouterLocals');

// middleware to send responses as json
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', `*`);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', false);
    next();
});

const { Server } = require("socket.io");
const io = new Server(server);

app.set('socketio', io); // https://stackoverflow.com/questions/18856190/use-socket-io-inside-a-express-routes-file
app.use('/locals', httpRouterLocals);

const socketRouter = require('./socketRouterLocals')(io)

// app.use('/test', socketRouter)

server.listen(7100, () => {
    console.log('listening on *:7100');
});


module.exports = {
    server: server,
    app: app,
    io: io
}



