var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

app.get('/', (req,res) =>{
    res.sendFile(__dirname + '/client/index.html');
});

app.use('/client', express.static(__dirname + '/client'));

server.listen(server_port, server_ip_address, listen);
function listen() {
    console.log( "Listening on " + server_ip_address + ", port " + server_port )
}

var players = [];
var hand_s = [];
var map_el = {};

function Player(id, x, y, r, speed){
    this.id = id;
    this.x = x;
    this.y = y;
    this.r = r;
    this.speed = speed;
}

function Hands(id, x, y, mouseX, mouseY){
    this.id = id;
    this.x = x;
    this.y = y;
    this.mouseX = mouseX;
    this.mouseY = mouseY;
}

setInterval(heartbeat,1000/60);

function heartbeat(){
    io.sockets.emit('heartbeat', players, hand_s);
}

io.sockets.on('connection',
  // We are given a websocket object in our function
  function (socket) {

    console.log("We have a new client: " + socket.id);

    // When this user emits, client side: socket.emit('otherevent',some data);
    socket.on('start',
      function(data_pl, data_hd) {
        // console.log(socket.id + " " + data.x + " " + data.y + " " + data.r + " " + data.speed + " " + data.dx + " " + data.dy);
        var player = new Player(socket.id, data_pl.x, data_pl.y, data_pl.r, data_pl.speed);
        var hand = new Hands(socket.id, data_hd.x, data_hd.y, data_hd.mouseX, data_hd.mouseY);
        players.push(player);
        hand_s.push(hand);
      }
    );

    socket.on('map_el',
        function(data){
            if(isEmpty(map_el)){
                map_el = data;
            }
            else
                io.sockets.emit('map_update',map_el);
        }
    );

    socket.on('update',
      function(data_pl, data_hd) {

        for(var i = 0; i < players.length; i++){
            if(socket.id == players[i].id){
                players[i].x = data_pl.x;
                players[i].y = data_pl.y;
                players[i].r = data_pl.r;
                players[i].speed = data_pl.speed;
            }
        }
        for(var i = 0; i < hand_s.length; i++){
            if(socket.id == hand_s[i].id){
                hand_s[i].x = data_hd.x;
                hand_s[i].y = data_hd.y;
                hand_s[i].mouseX = data_hd.mouseX;
                hand_s[i].mouseY = data_hd.mouseY;
            }
        }
      }
    );

    socket.on('disconnect', function() {
        for(var i = 0, y = 0; i < players.length && y < hand_s.length; i++, y++){
            if(socket.id == players[i].id){
                players.splice(i, 1);
            }
            if(socket.id == hand_s[y].id){
                hand_s.splice(y, 1);
            }
        }
        if(players.length == 0){
            for(el in map_el)
                delete map_el[el];
        }
        console.log("Client has disconnected: " + socket.id);
    });
  }
);

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
