//SOCKET HANDLING SECTION
const socket = io();

socket.on("message", (res) => {
  console.log(res.msg);
  myid = res.id;
  console.log(`Your ID: ${res.id}`);
  document.getElementById("id").innerHTML=myid;
});

socket.on("pairRequest", (msg) => {
  paired = true;
  opponent = msg.req_by;
  console.log(`paired with ${opponent}`);
  if (!msg.paired_status) {
    my_turn=false
    socket.emit("pairRequest", {
      paired_status: true,
      req_to: msg.req_by,
      req_by: msg.req_to,
    });
  }
});
socket.on("mark", (position) => {
  blocks[position - 1].dispatchEvent(click_event);
});
socket.on('reset',()=>{
  restart()
})

//GAME HANDLING SECCTION
var blocks = document.getElementsByClassName("block");
var res = document.getElementById("win_msg");

var board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var curr_turn = true;
var paired = false;
var my_turn=true;
var myid = "";
var opponent = "";

move_count = 0;

var click_event = new CustomEvent("click");

function gameOver() {
  let flag = 0;
  for (let i = 0; i < 3; i++) {
    if (
      board[3 * i + 0] == board[3 * i + 1] &&
      board[3 * i + 1] == board[3 * i + 2] &&
      board[3 * i]
    ) {
      flag = board[3 * i];
      console.log(i);
      break;
    } else if (
      board[i] == board[i + 3] &&
      board[i + 3] == board[i + 6] &&
      board[i]
    ) {
      flag = board[i];
      console.log(`c${i}`);
      break;
    }
  }
  if (!flag) {
    for (let i = 0; i < 2; i++) {
      if (
        board[2 * i] == board[4] &&
        board[4] == board[8 - 2 * i] &&
        board[4]
      ) {
        flag = board[4];
        console.log(`d${i}`);
        break;
      }
    }
  }
  if (!flag && move_count == 9) {
    flag = 3;
  }
  return flag;
}

function mark(position) {
  board[position - 1] = curr_turn ? 1 : 2;
  move_count += 1;
  if (my_turn) {
    socket.emit('mark', {
      id: opponent,
      position: position,
    });
  }
  let status = gameOver();
  if (status) {
    res.style.setProperty("visibility", "visible");
    if (status != 3) {
      res.children[0].innerHTML = `Player-${status} wins`;
    } else {
      res.children[0].innerHTML = `That is a tie!!!`;
    }
  }
}

function restart() {
  board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  curr_turn = true;
  move_count = 0;
  res.style.setProperty("visibility", "hidden");
  for (var pos of blocks) {
    pos.children[0].innerHTML = "";
  }
}
function reset(){
  restart();
  socket.emit('reset',opponent);
}

for (let i = 0; i < blocks.length; i++) {
  (function (index) {
    blocks[index].addEventListener("click", function () {
      if (board[index]) {
      } else {
        mark(index + 1);
        this.children[0].innerHTML = curr_turn ? "X" : "O";
        my_turn=!my_turn
        curr_turn = !curr_turn;
      }
    });
  })(i);
}

function pair() {
  let opp_id = document.getElementById("opp_id");
  socket.emit("pairRequest", {
    paired_status: false,
    req_to: opp_id.value,
    req_by: socket.id,
  })
}