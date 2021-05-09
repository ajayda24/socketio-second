const path = require('path')
const http = require('http')
const express = require('express')

const { userJoinHelper,userDeleteHelper, usersArray } = require('./utils/users-socket')

const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, 'public','index-socket.html'))
})

const port = process.env.PORT || 3000
const server = app.listen(port, () => {
  console.log(`Server started at port ${port}`)
})

const io = require('socket.io')(server)
io.on('connection', (socket) => {
  console.log('User has connected')

  socket.on('joinRoom', (data) => {
    const checkRoom = usersArray.find((el) => el.room == data.joinCode)
    if (checkRoom) {
      console.log('Room Exist')
      socket.join(data.joinCode)
      const user = userJoinHelper(socket.id, data.username, data.joinCode)
      socket.emit('joinRoomSuccess', {
        user: user,
      })
      io.to(user.room).emit('joinNotification', {
        msg: `${user.username} Joined Room`,
      })
    } else {
      console.log('Room not exist')
    }
  })

  socket.on('createRoom', (data) => {
    const user = userJoinHelper(socket.id, data.username, data.joinCode)
    socket.join(user.room)
    socket.emit('createRoomSuccess', {
      user: user,
    })
    io.to(user.room).emit('joinNotification', {
      msg: `${user.username} Created Room`,
    })
  })

  socket.on('roomChat', (data) => {
    io.to(data.room).emit('roomChatMsg', {
      username: data.username,
      msg: data.chat,
    })

    socket.on('disconnect', () => {
      userDeleteHelper(socket.id)
      io.to(data.room).emit('roomUserLeave', {
        username: data.username,
      })
    })
  })

  
})


