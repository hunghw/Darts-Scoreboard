const dartState = ["Miss", "S", "D", "T"];
const dartScore = [20, 19, 18, 17, 16, 15, 25];
var hitTimes = 0;
var numPlayer = 4,
  numRound = 15;
var hitNumRec, hitMagRec, hitNumTimes, playerScore;
var currentRoundNum = [0, 0, 0],
  currentRoundMag = [1, 1, 1],
  currentRoundDartInd = 0,
  currentRoundInd = 0,
  currentPlayer = 0;
var MPR80Stuts, MPR100Stuts, close6Num;

function initialize() {
  hitTimes = 0, currentRoundNum = [0, 0, 0], currentRoundMag = [1, 1, 1], currentRoundDartInd = 0, currentRoundInd = 0, currentPlayer = 0;
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
    for (var scoreInd = 0; scoreInd < dartScore.length; ++scoreInd) {
      document.getElementById("player" + player + "Num" + dartScore[scoreInd]).src = "null.png";
    }
    document.getElementById("player" + player + "Score").innerText = 0;
  }
  document.getElementById("roundInd").innerText = "1 / " + numRound;
  clearCurrentDart();
  whitenPlayerScore();
  document.getElementById("player0Score").style.backgroundColor = "red";
}

function hitNum(num) {
  if (currentRoundDartInd < 3) {
    currentRoundNum[currentRoundDartInd] = num;
    showCurrentDart(currentRoundDartInd);
    ++currentRoundDartInd;
  }
  //printlog("hitNum");
}

function showCurrentDart(index) {
  if (currentRoundNum[index] == 25) {
    document.getElementById("currentDart" + index).innerText = dartState[[currentRoundMag[index]]] + "-Bull";
  } else if (currentRoundNum[index] == 0) {
    document.getElementById("currentDart" + index).innerText = "Miss";
  } else {
    document.getElementById("currentDart" + index).innerText = dartState[[currentRoundMag[index]]] + currentRoundNum[index];
  }
}

function hitMiss() {
  if (currentRoundDartInd < 3) {
    currentRoundNum[currentRoundDartInd] = 0;
    currentRoundMag[currentRoundDartInd] = 0;
    document.getElementById("currentDart" + currentRoundDartInd).innerText = "Miss";
    ++currentRoundDartInd;
  }
  // printlog("hitMiss");
}

function hitMag(mag) {
  if (currentRoundDartInd < 3) {
    currentRoundMag[currentRoundDartInd] = mag;
  }
  // printlog("hitMag");
}

function pressEnter() {
  if (currentRoundDartInd == 3) {
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
          currentRoundDartInd = 0;
          currentRoundNum = [0, 0, 0];
          currentRoundMag = [1, 1, 1];
          //clearCurrentDart();
          var winnerScore = 65535;
          whitenPlayerScore();
          for (var player = 0; player < numPlayer; ++player) {
            if (winnerScore > playerScore[player]) {
              winnerScore = playerScore[player];
              whitenPlayerScore();
              document.getElementById("player" + player + "Score").style.color = "yellow";
            } else if (winnerScore == playerScore[player]) {
              document.getElementById("player" + player + "Score").style.color = "yellow";
            }
          }
        } else {}
        return;
      }
    }

    updatePlayerScore();
    currentRoundNum = [0, 0, 0];
    currentRoundMag = [1, 1, 1];
    currentRoundDartInd = 0;
    clearCurrentDart();
    document.getElementById("player" + currentPlayer + "Score").style.backgroundColor = "red";

  }
  // printlog("pressEnter");
}

function clearCurrentDart() {
  document.getElementById("currentDart" + 0).innerText = "-";
  document.getElementById("currentDart" + 1).innerText = "-";
  document.getElementById("currentDart" + 2).innerText = "-";
}

function whitenPlayerScore() {
  for (var player = 0; player < numPlayer; ++player) {
    document.getElementById("player" + player + "Score").style.backgroundColor = "black";
    document.getElementById("player" + player + "Score").style.color = "white";
  }
}


function pressDelete() {
  if (currentRoundDartInd > 0) {
    --currentRoundDartInd;
    currentRoundNum[currentRoundDartInd] = 0;
    currentRoundMag[currentRoundDartInd] = 1;
    document.getElementById("currentDart" + currentRoundDartInd).innerText = "-";
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
    document.getElementById("player" + currentPlayer + "Score").style.backgroundColor = "red";
    currentRoundMag = hitMagRec[currentPlayer][currentRoundInd];
    currentRoundNum = hitNumRec[currentPlayer][currentRoundInd];
    hitMagRec[currentPlayer][currentRoundInd] = [0, 0, 0];
    hitMagRec[currentPlayer][currentRoundInd] = [1, 1, 1];
    currentRoundNum[currentRoundDartInd] = 0;
    currentRoundMag[currentRoundDartInd] = 1;
    showCurrentDart(0);
    showCurrentDart(1);
    updatePlayerScore();
  }
  // printlog("pressDelete");
}


function updatePlayerScore() {
  playerHitTimes = new Array(numPlayer);
  for (var player = 0; player < numPlayer; ++player) {
    playerScore[player] = 0;
    playerHitTimes[player] = new Array(dartScore.length);
    for (var score_i = 0; score_i < dartScore.length; ++score_i) {
      playerHitTimes[player][score_i] = 0;
    }
  }
  for (var round = 0; round <= currentRoundInd; ++round) {
    for (var player = 0; player < numPlayer; ++player) {
      if (round == (numRound - 1) && player == (numPlayer - 1) && currentRoundDartInd == 3) {} else if (round == currentRoundInd && player >= currentPlayer) {
        break;
      }
      for (var i = 0; i < 3; ++i) {
        var score_i = dartScore.indexOf(hitNumRec[player][round][i]);
        if (score_i < 0) continue;
        var currentHit = playerHitTimes[player][score_i];
        playerHitTimes[player][score_i] += hitMagRec[player][round][i];
        var maxi = (currentHit > 3) ? currentHit : 3;
        var scoreGain = (playerHitTimes[player][score_i] - maxi) * dartScore[score_i];
        if (scoreGain > 0) {
          for (var otherPlayer = 0; otherPlayer < numPlayer; ++otherPlayer) {
            if (otherPlayer != player && playerHitTimes[otherPlayer][score_i] < 3) {
              playerScore[otherPlayer] += scoreGain;

            }
          }
        }
      }
    }
  }
  hitNumTimes = playerHitTimes;
  for (var player = 0; player < numPlayer; ++player) {
    document.getElementById("player" + player + "Score").innerText = playerScore[player];
    for (var score_i = 0; score_i <= dartScore.length; ++score_i) {
      updatePicture("player" + player + "Num" + dartScore[score_i], hitNumTimes[player][score_i]);
    }
  }
  calculateMPR();
}

//var MPR80Stuts, MPR100Stuts, close6Num;
function calculateMPR() {
  for (var player = 0; player < numPlayer; ++player) {
    var totalCount = 0,
      toatalClose = 0;
    for (var score_i = 0; score_i < dartScore.length; ++score_i) {
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
    document.getElementById("player" + player + "MPR").innerHTML = Number((MPR80Stuts[player]).toFixed(2)) + " (" + Number((MPR100Stuts[player]).toFixed(2)) + ")";
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
  if (hitTimes == 0) {
    document.getElementById(id).src = "null.png";
  } else if (hitTimes == 1) {
    document.getElementById(id).src = "single_w.png";
  } else if (hitTimes == 2) {
    document.getElementById(id).src = "double_w.png";
  } else if (hitTimes >= 3) {
    document.getElementById(id).src = "triple_w.png";
  }
}
function hitFullScreen(){
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