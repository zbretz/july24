const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const httpRouter = require('./httpRouter');
const auth = require('./auth')
const driver = require('./driver')
const user = require('./user')

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
app.use('/user', user);
app.use('/driver', driver);
app.use('/auth', auth);
app.use('/', httpRouter);


const socketRouter = require('./socketRouter')(io)

server.listen(9100, () => {
    console.log('listening on *:9100');
});


module.exports = {
    server: server,
    app: app,
    io: io
}



