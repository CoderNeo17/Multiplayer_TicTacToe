const { server } = require("./server.js");
const {Server} = require('socket.io')

const io = new Server(server)

io.on('connection',(socket)=>{
  console.log(`a user connected. ID: ${socket.id}`)
  console.log(`Total number of Live Users: ${io.engine.clientsCount}`)
  socket.paired=false
  socket.join(socket.id)
  socket.on('disconnecting',()=>{
    console.log(`User ${socket.id} has disconnected`)
    console.log(`Total Number of live user: ${io.engine.clientsCount}`)

  })
  socket.emit('message',{
    msg:'`Connection Established Succesfully.',
    id:`${socket.id}`,
  })

  socket.on('pairRequest',(msg)=>{
    console.log('pair request recieved')
    io.to(msg.req_to).emit('pairRequest',{
      paired_status:msg.paired_status,
      req_to:msg.req_to,
      req_by:msg.req_by
    })
  })
  socket.on('mark',(msg)=>{
    console.log(`marked`)
    io.to(msg.id).emit('mark',msg.position)
  })
  socket.on('reset',(id)=>{
    io.to(id).emit('reset',null)
  })
})

module.exports={io}