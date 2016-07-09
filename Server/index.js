//服务器端代码
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.send('<h1>Welcome Realtime Server</h1>');
});

//在线用户
var onlineUsers = {};
//在线人数
var onlineCount = 0;

io.on('connection', function(socket){
    console.log('a user connected');

    //监听新用户加入
    socket.on('login', function(obj){
        socket.name = obj.userid;

        if(!onlineUsers.hasOwnProperty(obj.userid)){
            onlineUsers[obj.userid] = obj.username;
            onlineCount++;
        }

        io.emit('login', {onlineUsers: onlineUsers, onlineCount: onlineCount, user: obj});
        console.log(obj.username+'加入了聊天室');
    });

    //监听用户退出
    socket.on('disconnect', function(){
        if(onlineUsers.hasOwnProperty(socket.name)){
            var obj = {userid: socket.name, username:onlineUsers[socket.name]};

            delete onlineUsers[socket.name];
            onlineCount--;

            io.emit('logout', {onlineUsers:onlineUsers, onlineCount:onlineCount, user: obj});
            console.log(obj.username+'退出了聊天室');
        }
    });

    //监听用户发布内容
    socket.on('message', function(obj){
        io.emit('message', obj);
        console.log(obj.username+'说'+obj.content);
    })
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
