const path = require('path')
const http = require('http')
const express = require('express')

const { userJoinHelper,userDeleteHelper, usersArray } = require('./utils/users')

const app = express()

app.use(express.static(path.join(__dirname, 'public')))

const port = process.env.PORT || 3000
const server = app.listen(port, () => {
  console.log(`Server started at port ${port}`)
})

const io = require('socket.io')(server)
io.on('connection', (socket) => {
  console.log('User has connected')

  socket.on('createGame', data => {
    const user = userJoinHelper(socket.id, data.room,data.players)
    socket.join(data.room)
    if (io.sockets.adapter.rooms.get(data.room).size == data.players) {
      io.to(data.room).emit('startGame', { room: data.room, user: user })
    }
  })

  socket.on('joinGame', data => {
    console.log('join game server');
    const checkRoom = usersArray.find((el) => el.room == data.room)
    if (checkRoom) {
      
      const user = userJoinHelper(socket.id, data.room, checkRoom.players)
      socket.join(data.room)
      if (io.sockets.adapter.rooms.get(data.room).size == checkRoom.players) {
        io.to(data.room).emit('startGame', { room: data.room, user: user })
      } else {
        socket.emit('waitForPlayers', { room: data.room, user: user })
      }
    } else {
      console.log('Room not Exist');
      socket.emit('roomNotExist')
    }
  })

  socket.on('playGame', data => {
    socket.broadcast.to(data.room).emit('gameBoxClick', { btnInfo: data.btnInfo, room: data.room, players: data.players, playerId: socket.id })
    
    socket.emit('playerWhoClicked')
  })
})
