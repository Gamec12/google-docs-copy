const io = require('socket.io')(3001, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }                           // for corss origin request support (make request from a diffrent url to a diffrent url since server and client are on diffrent locations)


});                      // this is a function that takes a port number to where you want it to run


io.on('connection', (socket) => {
    socket.on('send-changes', (delta) => { // the delta is passed in
        socket.broadcast.emit('receive-changes', delta) // broadcast to everyone else  recive changes is a function name?
    })



})