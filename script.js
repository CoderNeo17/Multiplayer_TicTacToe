var blocks = document.getElementsByClassName("block");
var res=document.getElementById("win_msg");

var board = [0,0,0,0,0,0,0,0,0]
curr_turn = true

move_count=0

function gameOver(){
  let flag=0;
  for(let i=0;i<3;i++){
    if((board[3*i+0]==board[3*i+1] && board[3*i+1]==board[3*i+2])&&board[3*i]){
      flag=board[3*i];
      console.log(i);
      break;
    }else if((board[i]==board[i+3] && board[i+3]==board[i+6])&&board[i]){
      flag=board[i];
      console.log(`c${i}`);
      break;
    }
  }
  if(!flag){
    for(let i=0;i<2;i++){
      if((board[2*i]==board[4] && board[4]==board[8-2*i])&&board[4]){
        flag=board[4];
        console.log(`d${i}`);
        break;
      }
    }
  }
  if(!flag && move_count==9){flag=3}
  return flag;
}

function mark(position, player){
  board[position-1] = player?1:2;
  for(let i=0;i<3;i++){
    console.log(board[3*i+0]+" "+board[3*i+1]+" "+board[3*i+2]+"\n");
  }
  move_count+=1;
  let status=gameOver();
  if(status){
    res.style.setProperty("visibility","visible");
    if(status!=3){
      res.children[0].innerHTML=`Player-${status} wins`
    }else{
      res.children[0].innerHTML=`That is a tie!!!`
    }
  }
}

function restart(){
  board = [0,0,0,0,0,0,0,0,0]
  curr_turn = true
  move_count=0
  res.style.setProperty("visibility","hidden");
  for (var pos of blocks) {
    pos.children[0].innerHTML=""
  }
}

for (let i = 0; i < blocks.length; i++) {
  (function (index) {
      blocks[index].addEventListener("click", function () {
        if(board[index]){}
        else{
          mark(index + 1, curr_turn);
          this.children[0].innerHTML=curr_turn?"X":"O";
          curr_turn=!curr_turn;
        }
      });
  })(i);
}
