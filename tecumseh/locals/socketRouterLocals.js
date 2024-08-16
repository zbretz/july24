const router = require("express").Router();

module.exports = function (io) {

    io.on('connection', async (socket) => {

        console.log('socket id: ', socket.id);
        console.log('socket rooms1: ', socket.rooms);

        socket.on('register socket', (partner) => {
            console.log('logging in as: ', partner);
            socket.join(partner)

            console.log('socket rooms2: ', socket.rooms);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });

        socket.on('message', (data) => {
            console.log('Received message:', data);
            io.emit('message', data); // Broadcast message to all connected clients
        });
    });

    // return router.get('/sockettest', async (req, res) => {
    //     console.log('test')
    //     io.emit('order_received')
    // });

}



