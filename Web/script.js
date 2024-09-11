//SOCKET HANDLING SECTION
const socket = io();

socket.on("message", (res) => {
  console.log(res.msg);
  myid = res.id;
  notif(`Your ID: ${res.id}`);
  document.getElementById("id").innerHTML = myid;
});

socket.on("pairRequest", (msg) => {

  if (msg.status == "request") {
    if (!paired) {
      pairAlert.children[0].innerHTML = msg.by
      pairAlert.style.setProperty("visibility", "visible");
      let responded = new Promise(function (resolve, reject) {
        pairAlert.children[1].children[0].addEventListener('click', function () {
          resolve()
          pairAlert.style.setProperty("visibility", "hidden")
        })
        pairAlert.children[1].children[1].addEventListener('click', function () {
          reject()
          pairAlert.style.setProperty("visibility", "hidden")
        })
      })
      responded.then(function () {
        paired = true;
        opponent = msg.by;
        console.log(`paired with ${opponent}`);
        my_turn = false
        socket.emit("pairRequest", {
          status: "accepted",
          to: msg.by,
          by: myid,
        })
        you.innerHTML = my_turn ? `${you.innerHTML} X` : `${you.innerHTML} O`
        curr.innerHTML = curr_turn ? `${curr.innerHTML} X` : `${curr.innerHTML} O`
      })
        .catch(function () {
          socket.emit("pairRequest", {
            status: "rejected",
            to: msg.by,
            by: myid,
          })
        })
    } else {
      socket.emit("pairRequest", {
        paired_status: "rejected",
        to: msg.req_by,
        by: myid,
      });
    }
  } else if (msg.status == "accepted") {
    paired = true
    opponent = msg.by
    notif(`Paired with ${opponent}`)
    you.innerHTML = my_turn ? `${you.innerHTML} X` : `${you.innerHTML} O`
    curr.innerHTML = curr_turn ? `${curr.innerHTML} X` : `${curr.innerHTML} O`
  } else {
    notif(`Pair Request Rejected`)
  }
});
socket.on("mark", (position) => {
  blocks[position - 1].dispatchEvent(click_event);
});
socket.on('reset', () => {
  restart()
})

function notif(string) {
  let noti = document.getElementById("notif")
  noti.innerHTML = string;
  noti.style.setProperty("visibility", "visible")
  setTimeout(() => {
    noti.style.setProperty("visibility", "hidden")
  }, 5000)
}

//GAME HANDLING SECCTION
var blocks = document.getElementsByClassName("block");
var res = document.getElementById("win_msg");
var you = document.getElementById("you_id");
var curr = document.getElementById("curr_id");
var pairAlert = document.getElementById("request");

var board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var curr_turn = true;
var paired = false;
var my_turn = true;
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
      to: opponent,
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
  you.innerHTML = my_turn ? `Your Sign: X` : `Your Sign: O`
  curr.innerHTML = curr_turn ? `Current Turn: X` : `Current Turn: O`
}
function reset() {
  restart();
  socket.emit('reset', opponent);
}

for (let i = 0; i < blocks.length; i++) {
  (function (index) {
    blocks[index].addEventListener("click", function () {
      if (board[index]) {
      } else {
        mark(index + 1);
        this.children[0].innerHTML = curr_turn ? "X" : "O";
        my_turn = !my_turn
        curr_turn = !curr_turn;
      }
      curr.innerHTML = curr_turn ? `Current Turn: X` : `Current Turn: O`
    });
  })(i);
}

function pair() {
  let opp_id = document.getElementById("opp_id");
  socket.emit("pairRequest", {
    status: "request",
    to: opp_id.value,
    by: socket.id,
  })
}