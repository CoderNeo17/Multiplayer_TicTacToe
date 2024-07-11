var board = [0,0,0,0,0,0,0,0,0]

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
  return flag;
}

function mark(position, player){
  board[position-1] = player;
  for(let i=0;i<3;i++){
    console.log(board[3*i+0]+" "+board[3*i+1]+" "+board[3*i+2]+"\n");
  }
  let status=gameOver();
  if(status){
    /*let res=document.getElementsByClassName("result");
    res.style.setProperty("visibility","visible");
    res.innerHTML=`Player-${status} wins`;*/
  }
}

var blocks = document.getElementsByClassName("block");

for (let i = 0; i < blocks.length; i++) {
  (function (index) {
      blocks[index].addEventListener("click", function () {
        mark(index + 1, 2);
        var elem = this.children;
        elem[0].innerHTML = "O";
      });
  })(i);
}
