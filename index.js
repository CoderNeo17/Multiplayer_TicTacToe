const { server } = require("./server.js");
const { io } = require("./socket.js");

server.listen(3000, ()=>{
  console.log('Server listening at port:3000')
})