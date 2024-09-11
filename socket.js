const { server } = require("./server.js");
const { Server } = require('socket.io')

const io = new Server(server)

io.on('connection', (socket) => {
  console.log(`a user connected. ID: ${socket.id}`)
  console.log(`Total number of Live Users: ${io.engine.clientsCount}`)
  socket.join(socket.id)
  socket.on('disconnecting', () => {
    console.log(`User ${socket.id} has disconnected`)
    console.log(`Total Number of live user: ${io.engine.clientsCount}`)

  })
  socket.emit('message', {
    msg: '`Connection Established Succesfully.',
    id: `${socket.id}`,
  })

  socket.on('pairRequest', (msg) => {
    console.log('pair request recieved')
    io.to(msg.to).emit("pairRequest", msg)
  })
  socket.on('mark', (msg) => {
    io.to(msg.to).emit('mark', msg.position)
  })
  socket.on('reset', (id) => {
    io.to(id).emit('reset', null)
  })
})

module.exports = { io }