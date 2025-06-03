
const { driverCheckIn, message, requestScheduledRide, acceptScheduledRide, completeScheduledRide, cancelScheduledRide, acceptPayScheduledRide, paymentCompleteScheduledRide, enRouteScheduledRide, walletTest } = require("./socketFunctions/schedule");
const { requestLocalRide, acceptLocalRide, completeLocalRide } = require("./socketFunctions/local");
const { requestDirectBooking, acceptDirectBooking } = require("./socketFunctions/directBooking");

module.exports = function (io) {

    io.on('connection', async (socket) => {

        console.log('socket id: ', socket.id);
        console.log('socket rooms1: ', socket.rooms);

        socket.on('register socket', ({ userid, userType }) => {
            console.log('logging in as: ', userid, userType);
            socket.join(userid)

            if (userType == 'driver') {
                socket.join('drivers')
            }

            console.log('socket rooms2: ', socket.rooms);

        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });

        socket.on('message', (data) => {
            message(io, data)
        })


        socket.on('driver_check_in', (data) => {
            driverCheckIn(data)
        })


        //Local Rides
        socket.on('request_local_ride', async (rideRequest) => {
            requestLocalRide(io, rideRequest)
        })

        socket.on('accept_local_ride', async (rideRequest) => {
            console.log('accepting')
            acceptLocalRide(io, socket, rideRequest)
        })

        socket.on('complete_local_ride', async (rideRequest, callback) => {
            completeLocalRide(io, rideRequest, callback)
        })


        //Scheduled Rides
        socket.on('request_scheduled_ride', async (rideRequest, callback) => {
            requestScheduledRide(io, rideRequest, callback)
        })

        socket.on('accept_scheduled_ride', async (rideRequest) => {
            console.log('ello')
            acceptScheduledRide(io, rideRequest)
        })

        socket.on('en_route_scheduled_ride', async (rideRequest) => {
            console.log('en route')
            enRouteScheduledRide(io, rideRequest)
        })

        socket.on('complete_scheduled_ride', async (rideRequest) => {
            completeScheduledRide(io, rideRequest)
        })

        socket.on('wallet_test', async (rideRequest) => {
            walletTest(io, rideRequest)
        })

        socket.on('cancel_scheduled_ride', async (rideRequest, callback) => {
            cancelScheduledRide(io, rideRequest, callback)
        })

        socket.on('accept_pay_scheduled_ride', async (inc_dec, amount) => {
            acceptPayScheduledRide(io, inc_dec, amount)
        })

        socket.on('payment_complete_scheduled_ride', async (rideRequest) => {
            paymentCompleteScheduledRide(io, rideRequest)
        })

        // socket.on('reassign_scheduled_ride', async (rideRequest) => {
        //     reassignScheduledRide(io, rideRequest)
        // })

        // Direct Bookings
        socket.on('request_direct_booking', async (rideRequest, callback) => {
            requestDirectBooking(io, rideRequest, callback)
        })

        socket.on('accept_direct_booking', async (rideRequest, callback) => {
            acceptDirectBooking(io, rideRequest, callback)
        })


    });


}



