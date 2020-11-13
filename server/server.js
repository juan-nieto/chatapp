var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
app.set('socketio', io); //save reference to socketio
var allSocketIds = [];

http.listen(8080, () => {
    console.log("listening on *:8080");
});

io.on('connection', (socket) => {
    console.log('new client connected');
    let idNamePair = {
        id: socket.id,
        name: ''
    }
    allSocketIds.push(idNamePair);
    socket.emit('connection', null);
       
    io.emit('connected-clients', allSocketIds);
    socket.on('send-message', (message) => {
        let d = new Date();
        d = d.toLocaleTimeString();
        console.log("Message received: " + message.messageVal);
        io.emit('message', {message, d});     
    });

    socket.on('username-change-request', (nameChangeRequest) => {
        let isUnique = true;
        let newUsername = nameChangeRequest.messageVal;
        allSocketIds.forEach(sock => {
            if(newUsername === sock.name) {
                isUnique = false;
            }            
        });
        if(!isUnique) {
            socket.emit('username-change-fail', null);
            return;
        } else {
            allSocketIds.forEach(sock => {
                if(nameChangeRequest.user == sock.id) {
                    sock.name = newUsername;
                }
            })
            socket.emit('username-change-success', newUsername);
            io.emit('connected-clients', allSocketIds);
        }
    });

    socket.on('disconnect', () => {
        console.log("User disconnected, removing from active users");
        let index = allSocketIds.findIndex(i => i.id === socket.id);
        allSocketIds.splice(index, 1);
        io.emit('connected-clients', allSocketIds);
    });
});



