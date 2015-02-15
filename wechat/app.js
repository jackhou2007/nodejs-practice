var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var bodyParser = require('body-parser');
var multer = require('multer');

var cookieParser = require('cookie-parser');
var session = require('express-session');

var User = require('./controllers/user');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data

app.use(cookieParser());
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'wechat',
    cookie: {
        maxAge: 600 * 1000
    }
}));

app.get('/api/validate', function (req, res) {
    _userId = req.session._userId;
    if (_userId) {
        User.findUserById(_userId, function (err, user) {
            if (err) {
                res.status(401).json({msg: err});
            } else {
                res.json(user);
            }
        })
    } else {
        res.status(401).json(null);
    }
})

app.post('/api/login', function (req, res) {
    email = req.body.email;
    if (email) {
        User.findByEmailOrCreate(email, function (err, user) {
            if (err) {
                res.status(500).json({msg: err});
            } else {
                req.session._userId = user._id;
                res.json(user);
            }
        });
    } else {
        res.status(403);
    }
});


app.get('/api/logout', function (req, res) {
    req.session._userId = null;
    res.status(401);
});
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