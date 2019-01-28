const DARTSSTATE = ["MISS", "SINGLE ", "DOUBLE ", "TRIPLE "];
const DARTSMAGBTN = ["btnMiss", "btnSingle", "btnDouble", "btnTriple"];
const HITNUMICONNAME = ["null.png", "single_w.png", "double_w.png", "triple_w.png"];
const MAXPLAYERNUM = 4;
const DARTSSCORE = [20, 19, 18, 17, 16, 15, 25];
const PLAYERINDEXORDERINHTML = [
  [1],
  [1, 2],
  [0, 1, 2],
  [0, 1, 2, 3]
];
var hitTimes = 0;
var numPlayer = 4,
  numRound = 15;
var hitNumRec, hitMagRec, hitNumTimes, playerScore;
var currentRoundNum = [0, 0, 0],
  currentRoundMag = [1, 1, 1],
  currentRoundDartInd = 0,
  currentRoundInd = 0,
  currentPlayer = 0,
  currentPlayerIndexOrder = [0, 1, 2, 3];
var MPR80Stuts, MPR100Stuts, close6Num;

function initialize() {
  hitTimes = 0;
  currentRoundNum = [0, 0, 0];
  currentRoundMag = [1, 1, 1];
  currentRoundDartInd = 0;
  currentRoundInd = 0;
  currentPlayer = 0;
  currentPlayerIndexOrder = PLAYERINDEXORDERINHTML[numPlayer - 1];
  hitNumRec = new Array(numPlayer);
  hitMagRec = new Array(numPlayer);
  hitNumTimes = new Array(numPlayer);
  playerScore = new Array(numPlayer);
  MPR80Stuts = new Array(numPlayer);
  MPR100Stuts = new Array(numPlayer);
  close6Num = new Array(numPlayer);
  for (var player = 0; player < numPlayer; ++player) {
    hitNumRec[player] = new Array(numRound);
    hitMagRec[player] = new Array(numRound);
    hitNumTimes[player] = new Array(0, 0, 0, 0, 0, 0, 0); // 20, 19, 18, 17, 16, 15, Bull
    playerScore[player] = 0;
    MPR80Stuts[player] = 0;
    MPR100Stuts[player] = 0;
    close6Num[player] = 0;
    for (var round = 0; round < numRound; ++round) {
      hitNumRec[player][round] = [0, 0, 0];
      hitMagRec[player][round] = [0, 0, 0];
    }
  }

  for (var player = 0; player < MAXPLAYERNUM; ++player){
    for (var scoreInd = 0; scoreInd < DARTSSCORE.length; ++scoreInd) {
      document.getElementById("player" + player + "Num" + DARTSSCORE[scoreInd]).src = HITNUMICONNAME[0];
    }
    document.getElementById("player" + player + "Score").innerText = 0;
    document.getElementById("player" + player + "ScoreDiv").style.backgroundColor = "black";
    document.getElementById("player" + player + "Result").style.backgroundColor = "black";
    document.getElementById("player" + player + "MPR").innerHTML = "0 (0)";
  }

  document.getElementById("roundInd").innerText = "1 / " + numRound;
  clearCurrentDart();
  whitenPlayerScore();
  claerHitHistory();
  document.getElementById("player" + currentPlayerIndexOrder[0] + "ScoreDiv").style.backgroundColor = "red";
  document.getElementById("player" + currentPlayerIndexOrder[0] + "Result").style.backgroundColor = "DimGray";
  document.getElementById(DARTSMAGBTN[1]).style.backgroundColor = "DimGray";
  document.getElementById("btnEnter").style.color = "white";
}

function hitNum(num) {
  if (currentRoundDartInd < 3) {
    currentRoundNum[currentRoundDartInd] = num;
    showCurrentDart(currentRoundDartInd);
    ++currentRoundDartInd;
    clearMagBackground();
    document.getElementById(DARTSMAGBTN[1]).style.backgroundColor = "DimGray";
  }
  if (currentRoundDartInd == 3) {
    document.getElementById("btnEnter").style.color = "red";
  }
}

function showCurrentDart(index) {
  var showText = DARTSSTATE[currentRoundMag[index]];
  var showColor = "white";
  if (currentRoundNum[index] == 25) { // BULL
    if (currentRoundMag[index] == 1){
      showText = "BULL";
    }else if (currentRoundMag[index] == 2){
      showText = "D-BULL";
    }else if (currentRoundMag[index] == 3){
      showText = "T-BULL";
    }
    showColor = "red";
  } else if (currentRoundNum[index] >= 15) {
    showText += currentRoundNum[index];
    if (currentRoundMag[index] == 3) {
      showColor = "Lime";
    } else if (currentRoundMag[index] == 2) {
      showColor = "Cyan";
    }
  }
  document.getElementById("currentDart" + index).innerText = showText;
  document.getElementById("currentDart" + index).style.color = showColor;

}

function hitMiss() {
  if (currentRoundDartInd < 3) {
    currentRoundNum[currentRoundDartInd] = 0;
    currentRoundMag[currentRoundDartInd] = 0;
    clearMagBackground();
    document.getElementById(DARTSMAGBTN[1]).style.backgroundColor = "DimGray";
    document.getElementById("currentDart" + currentRoundDartInd).innerText = "MISS";
    ++currentRoundDartInd;
  }

  if (currentRoundDartInd == 3) {
    document.getElementById("btnEnter").style.color = "red";
  }
  // printlog("hitMiss");
}
function clearMagBackground() {
  for (var i = 1; i <= 3; ++i){
    document.getElementById(DARTSMAGBTN[i]).style.backgroundColor = "black";
  }
}
function hitMag(mag) {
  if (currentRoundDartInd < 3) {clearMagBackground()
    document.getElementById(DARTSMAGBTN[mag]).style.backgroundColor = "DimGray";
    currentRoundMag[currentRoundDartInd] = mag;
  }
  // printlog("hitMag");
}

function pressEnter() {
  if (currentRoundDartInd == 3 && currentRoundInd < numRound) {
    hitNumRec[currentPlayer][currentRoundInd] = currentRoundNum;
    hitMagRec[currentPlayer][currentRoundInd] = currentRoundMag;

    // init current round

    whitenPlayerScore();
    if ((currentPlayer + 1) < numPlayer) {
      ++currentPlayer;
    } else {
      if ((currentRoundInd + 1) < numRound) {
        currentPlayer = 0;
        ++currentRoundInd;
        document.getElementById("roundInd").innerText = (currentRoundInd + 1) + " / " + numRound;
      } else {
        if (confirm("Are you sure want to end this game?")) {
          ++currentRoundInd;
          currentPlayer = 0;
          updatePlayerScore();
          updateHitDartsHistory();
          currentRoundDartInd = 0;
          currentRoundNum = [0, 0, 0];
          currentRoundMag = [1, 1, 1];
          //clearCurrentDart();
          whitenPlayerScore();
          if(numPlayer >2){
            var winnerScore = 65535;
            for (var player = 0; player < numPlayer; ++player) {
              if (winnerScore > playerScore[player]) {
                winnerScore = playerScore[player];
                whitenPlayerScore();
                document.getElementById("player" + currentPlayerIndexOrder[player] + "Score").style.color = "yellow";
              } else if (winnerScore == playerScore[player]) {
                document.getElementById("player" + currentPlayerIndexOrder[player] + "Score").style.color = "yellow";
              }
            }
          }else{
            var winnerScore = -1;
            for (var player = 0; player < numPlayer; ++player) {
              if (winnerScore < playerScore[player]) {
                winnerScore = playerScore[player];
                whitenPlayerScore();
                document.getElementById("player" + currentPlayerIndexOrder[player] + "Score").style.color = "yellow";
              } else if (winnerScore == playerScore[player]) {
                document.getElementById("player" + currentPlayerIndexOrder[player] + "Score").style.color = "yellow";
              }
            }
          }
          
        } else {}

        if (currentRoundDartInd < 3) {
          document.getElementById("btnEnter").style.color = "white";
        }
        return;
      }
    }

    updatePlayerScore();
    updateHitDartsHistory();
    currentRoundNum = [0, 0, 0];
    currentRoundMag = [1, 1, 1];
    currentRoundDartInd = 0;
    clearCurrentDart();
    document.getElementById("player" + currentPlayerIndexOrder[currentPlayer] + "ScoreDiv").style.backgroundColor = "red";
    document.getElementById("player" + currentPlayerIndexOrder[currentPlayer] + "Result").style.backgroundColor = "DimGray";
  }

  if (currentRoundDartInd < 3) {
    document.getElementById("btnEnter").style.color = "white";
  }
  // printlog("pressEnter");
}

function clearCurrentDart() {
  for (var i = 0; i < 3; ++i) {
    document.getElementById("currentDart" + i).innerText = "-";
    document.getElementById("currentDart" + i).style.color = "white";
  }
}

function whitenPlayerScore() {
  for (var player = 0; player < MAXPLAYERNUM; ++player) {
    document.getElementById("player" + player + "ScoreDiv").style.backgroundColor = "black";
    document.getElementById("player" + player + "Result").style.backgroundColor = "black";
    document.getElementById("player" + player + "Score").style.color = "black";
    document.getElementById("player" + player + "MPR").style.color = "black";
  }
  for (var player = 0; player < currentPlayerIndexOrder.length; ++player){
    document.getElementById("player" + currentPlayerIndexOrder[player] + "Score").style.color = "white";
    document.getElementById("player" + currentPlayerIndexOrder[player] + "MPR").style.color = "white";
  }
}


function pressDelete() {
  if (currentRoundDartInd > 0) {
    --currentRoundDartInd;
    currentRoundNum[currentRoundDartInd] = 0;
    currentRoundMag[currentRoundDartInd] = 1;
    document.getElementById("currentDart" + currentRoundDartInd).innerText = "-";
    document.getElementById("currentDart" + currentRoundDartInd).style.color = "white";
  } else {
    whitenPlayerScore();
    clearCurrentDart();
    if (currentPlayer > 0) { // goto previous player
      // document.getElementById("player" + currentPlayer + "Score").style.color = "white";
      --currentPlayer;

    } else if (currentRoundInd > 0) { // goto previous round
      // document.getElementById("player" + currentPlayer + "Score").style.color = "white";
      currentPlayer = numPlayer - 1;
      --currentRoundInd;
    } else {
      return;
    }
    currentRoundDartInd = 2;
    document.getElementById("player" + currentPlayerIndexOrder[currentPlayer] + "ScoreDiv").style.backgroundColor = "red";
    document.getElementById("player" + currentPlayerIndexOrder[currentPlayer] + "Result").style.backgroundColor = "DimGray";
    currentRoundMag = hitMagRec[currentPlayer][currentRoundInd];
    currentRoundNum = hitNumRec[currentPlayer][currentRoundInd];
    hitMagRec[currentPlayer][currentRoundInd] = [0, 0, 0];
    hitMagRec[currentPlayer][currentRoundInd] = [1, 1, 1];
    currentRoundNum[currentRoundDartInd] = 0;
    currentRoundMag[currentRoundDartInd] = 1;
    showCurrentDart(0);
    showCurrentDart(1);
    updatePlayerScore();
    updateHitDartsHistory();
  }
  if (currentRoundDartInd < 3) {
    document.getElementById("btnEnter").style.color = "white";
  }
  // printlog("pressDelete");
}

function updatePlayerScore() {
  playerHitTimes = new Array(numPlayer);
  for (var player = 0; player < numPlayer; ++player) {
    playerScore[player] = 0;
    playerHitTimes[player] = new Array(DARTSSCORE.length);
    for (var score_i = 0; score_i < DARTSSCORE.length; ++score_i) {
      playerHitTimes[player][score_i] = 0;
    }
  }
  for (var round = 0; round <= currentRoundInd; ++round) {
    for (var player = 0; player < numPlayer; ++player) {
      if (round == (numRound - 1) && player == (numPlayer - 1) && currentRoundDartInd == 3) {} 
      else if (round == currentRoundInd && player >= currentPlayer) {
        break;
      }
      for (var i = 0; i < 3; ++i) {
        var score_i = DARTSSCORE.indexOf(hitNumRec[player][round][i]);
        if (score_i < 0) continue;
        var currentHit = playerHitTimes[player][score_i];
        playerHitTimes[player][score_i] += hitMagRec[player][round][i];
        var maxi = (currentHit > 3) ? currentHit : 3;
        var scoreGain = (playerHitTimes[player][score_i] - maxi) * DARTSSCORE[score_i];
        for (var otherPlayer = 0; otherPlayer < numPlayer; ++otherPlayer) {
          if (scoreGain > 0 && otherPlayer != player && playerHitTimes[otherPlayer][score_i] < 3) {
            if(numPlayer <= 2){
              playerScore[player] += scoreGain;
            }else{
              playerScore[otherPlayer] += scoreGain;
            }
          }else if(scoreGain > 0 && numPlayer == 1){
            playerScore[player] += scoreGain;
          }
        }
      }
    }
  }
  hitNumTimes = playerHitTimes;
  updateDartsResultPic();
  calculateMPR();
  document.getElementById("currentPlayer").innerHTML = "P" + (currentPlayer + 1);
}
function updateDartsResultPic(){
  var allPlayerClose = [0, 0, 0, 0, 0, 0, 0]; // 20, 19, 18 ... 15,  Bull
  for (var player = 0; player < numPlayer; ++player) {
    document.getElementById("player" + currentPlayerIndexOrder[player] + "Score").innerText = playerScore[player];
    for (var score_i = 0; score_i < DARTSSCORE.length; ++score_i) {
      updatePicture("player" + currentPlayerIndexOrder[player] + "Num" + DARTSSCORE[score_i], hitNumTimes[player][score_i]);
      if (hitNumTimes[player][score_i] >= 3){
        ++allPlayerClose[score_i];
      }
    }
  }
  for (var score_i = 0; score_i < DARTSSCORE.length; ++score_i) {
    for (var player = 0; player < numPlayer; ++player) {
      // console.log("player" + player + "Num" + DARTSSCORE[score_i]);
      if(allPlayerClose[score_i] == numPlayer){
        document.getElementById("player" + currentPlayerIndexOrder[player] + "Num" + DARTSSCORE[score_i]).style.opacity = "0.3";
      }else{
        document.getElementById("player" + currentPlayerIndexOrder[player] + "Num" + DARTSSCORE[score_i]).style.opacity = "1";
      }
    }
  }
}
//var MPR80Stuts, MPR100Stuts, close6Num;
function calculateMPR() {
  for (var player = 0; player < numPlayer; ++player) {
    var totalCount = 0,
      toatalClose = 0;
    for (var score_i = 0; score_i < DARTSSCORE.length; ++score_i) {
      totalCount += hitNumTimes[player][score_i];
      if (hitNumTimes[player][score_i] >= 3) {
        ++toatalClose;
      }
    }
    if (player < currentPlayer) {
      MPR100Stuts[player] = totalCount / (currentRoundInd + 1);
    } else if (currentRoundInd != 0) {
      MPR100Stuts[player] = totalCount / (currentRoundInd);
    }
    if (close6Num[player] == 0) {
      MPR80Stuts[player] = MPR100Stuts[player];
      if (toatalClose >= 6) close6Num[player] = 1;
    }
    document.getElementById("player" + currentPlayerIndexOrder[player] + "MPR").innerHTML = Number((MPR80Stuts[player]).toFixed(2)) + " (" + Number((MPR100Stuts[player]).toFixed(2)) + ")";
  }
}

function pressReset() {
  if (confirm('Are you sure you want to reset this game?')) {
    initialize();
  } else {
    // Do nothing!
  }
}

function printlog(fun) {
  console.log("=====" + fun + "=====");
  console.log("Round: " + currentRoundNum);
  console.log("Mag: " + currentRoundMag);
  console.log("DartsIndex: " + currentRoundDartInd);
  console.log("Round: " + currentRoundInd);
  console.log("currentPlayer: " + currentPlayer);
}

function updatePicture(id, hitTimes) {
  if (hitTimes < 3) {
    document.getElementById(id).src = HITNUMICONNAME[hitTimes];
  } else {
    document.getElementById(id).src = HITNUMICONNAME[3];
  }
}

function pressFullScreen() {
  var elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
}

function changeRound(round) {
  if (round != numRound && confirm("It will reset the game. Press OK to continiue.")) {
    numRound = round;
    initialize();
  } else {
    // Do nothing!
  }
}

function changePlayer(player) {
  if (player != numPlayer && confirm("It will reset the game. Press OK to continiue.")) {
    numPlayer = player;
    initialize();
  } else {
    // Do nothing!
  }
}
function claerHitHistory(){
  var parent = document.getElementById("histroyResult");

  for( var i = parent.childElementCount; i > 0; --i){
    parent.removeChild(parent.lastElementChild);
  }
  if (currentPlayer == 0 && currentRoundInd == 0){
    var DIV = document.createElement("DIV");
    var P = document.createElement("P");
    P.className = "round";
    P.innerHTML = 'R' + (currentRoundInd + 1);
    DIV.appendChild(P);
    parent.appendChild(DIV);
  }
}
// const todoList = document.querySelector('histroyResult');
function updateHitDartsHistory(){
  var parent = document.getElementById("histroyResult");
  claerHitHistory();

  for (var round = 0; round < currentRoundInd; ++round){
    var DIV = document.createElement("DIV");
    var P = document.createElement("P");
    P.className = "round";
    P.innerHTML = 'R' + (round + 1);
    DIV.appendChild(P);
    for (var darts = 2; darts >= 0; --darts){
      var hitDartsNum = hitMagRec[currentPlayer][round][darts];
      var IMG = document.createElement("IMG");
      IMG.className = "round";
      if (hitDartsNum == 0){
        IMG.src = "miss_w.png";
      } else {
        IMG.src = HITNUMICONNAME[hitDartsNum];
      }
      DIV.appendChild(IMG);
    }
    parent.appendChild(DIV);
    // console.log(DIV);
  }
  if (currentRoundInd != numRound){
    var DIV = document.createElement("DIV");
    var P = document.createElement("P");
    P.className = "round";
    P.innerHTML = 'R' + (currentRoundInd + 1);
    DIV.appendChild(P);
    parent.appendChild(DIV);
  }
}