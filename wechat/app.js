var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/static'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/static/index.html');
});

var messages = [];
io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('getAllMessages', function () {
        socket.emit('allMessages', messages);
    });

    socket.on('createMessage', function (message) {
        messages.push("message");
        socket.emit('messageAdded', message);
    });

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});

console.log('wechat is on port: ' + port + '!');