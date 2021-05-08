const socket = io()

const createJoinDiv = document.getElementById('create-join-room')
const joinRoomForm = document.getElementById('join-room-form')
const createRoomForm = document.getElementById('create-room-form')
const roomDiv = document.getElementById('room')
const chatForm = document.getElementById('chat-form')
const chatList = document.getElementById('chat')

roomDiv.style.display = 'none'

createRoomForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const joinCode = Math.random().toString(36).substr(2, 5)
  const username = e.target.elements.username.value
  socket.emit('createRoom', { username, joinCode })
})

joinRoomForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const joinCode = e.target.elements.joinCode.value
  const username = e.target.elements.username.value
  socket.emit('joinRoom', { username, joinCode })
})

socket.on('createRoomSuccess', (data) => {
  roomDiv.style.display = 'block'
  createJoinDiv.style.display = 'none'

  document.getElementById('shareJoinCode').innerHTML =
    'Join Code : ' + data.user.room
  document.getElementById('showUsername').innerHTML =
    'Username : ' + data.user.username
})

socket.on('joinRoomSuccess', (data) => {
  roomDiv.style.display = 'block'
  createJoinDiv.style.display = 'none'

  document.getElementById('shareJoinCode').innerHTML =
    'Join Code : ' + data.user.room
  document.getElementById('shareJoinCode').style.display = 'none'
  document.getElementById('showUsername').innerHTML = 'Username : '+data.user.username
  
})

socket.on('joinNotification', data => {
  document.getElementById('info').innerHTML = data.msg
})

socket.on('roomUserLeave', data => {
  document.getElementById('info').innerHTML = data.username+' Leaves the room'
})

chatForm.addEventListener('submit', (ev) => {
  ev.preventDefault()
  const chat = ev.target.elements.roomChat.value
  const username = document.getElementById('showUsername').innerHTML.substring(11)
  const room = document.getElementById('shareJoinCode').innerHTML.substring(12)
  socket.emit('roomChat', {
    room: room,
    username: username,
    chat: chat,
  })
  ev.target.elements.roomChat.value = ''
})

socket.on('roomChatMsg', (data) => {
  const li = document.createElement('li')
  li.innerHTML = `${data.username} : ${data.msg}`
  chatList.appendChild(li)
})
