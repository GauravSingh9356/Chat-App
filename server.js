const path= require('path');
const express= require('express');
const socketio=require('socket.io');
const http=require('http');
const app=express();
const server=http.createServer(app);
const io=socketio(server);
const formatMessage=require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers}=require('./utils/users')





app.use(express.static(path.join(__dirname,'public')));

const botName='RealChat Bot';
io.on('connection',socket=>{
    socket.on('joinRoom', ({username, room})=>{
        const user=userJoin(socket.id, username, room);
    socket.join(user.room);

        socket.emit('message', formatMessage(botName,'Welcome to RealChat!!'));
    socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));

    io.to(user.room).emit('roomUsers',{
        room:user.room,
        users:user.room,
        users:getRoomUsers(user.room)
    })


});
    
    
    socket.on('chatMessage', msg=>{
        const user=getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username,
            msg));
    });


    socket.on('disconnect', function(){
        const user=userLeave(socket.id);
        if(user){
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));
        }
       
    });
});

const PORT=3000 || process.env.PORT;
server.listen(PORT, function(){
    console.log('Server is running!! ');
});