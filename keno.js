function roll() {
  let games = Number(document.getElementById("games").value);
  let wild = Number(document.getElementById("wild").value);
  let level = Number(document.getElementById("level").value);
  let diceSides = Number(document.getElementById("sides").value);
  let playerChoice = Number(document.getElementById("playerChoice").value);

  let playerDice = wild + 4;
  let dealerDice = level + 14;

  // If wildcard is bigger than playerDice, use only playerDice
  if (wild > playerDice) wild = playerDice;

  // Force people to fill all the cells: if wild < 1 or playerChoice is not valid, abort
  if (
    isNaN(playerChoice) ||
    playerChoice < 1 ||
    playerChoice > diceSides ||
    isNaN(wild) ||
    wild < 0
  ) {
    document.getElementById("results").innerHTML = "You must fill all the cells with valid values!";
    return;
  }

  let payoutPerHit = (wild + 1) * level;
  let totalPayout = 0;
  let gamesPlayed = 0;
  let finalResult = "";

  for (let game = 1; game <= games; game++) {
    let payout = -payoutPerHit;
    let hits = 0;
    let playerArray = generatePArray(playerDice, diceSides, playerChoice);
    let dealerArray = generateDArray(dealerDice, diceSides);
    playerArray = playerArray.sort((a, b) => b - a);

    // Remove the chosen number from the wild cards displayed
    let displayWildCards = playerArray.filter(n => n !== playerChoice);

    // Trim wild cards array to match the entered wild card amount or playerDice, whichever is smaller
    if (displayWildCards.length > wild) {
      displayWildCards = displayWildCards.slice(0, wild);
    }

    if (document.getElementById("rmult").checked) {
      let playerhits = [];
      for (let i of dealerArray[0].concat(dealerArray[1])) {
        if (playerArray.includes(i)) {
          if (!playerhits.includes(i)) {
            playerhits.push(i);
            payout += payoutPerHit;
          } else {
            payout += payoutPerHit * 3 / 2;
          }
        }
      }
    } else {
      for (let i in playerArray) {
        if (
          dealerArray[0].includes(playerArray[i]) ||
          dealerArray[1].includes(playerArray[i])
        ) {
          payout += payoutPerHit;
          if (i > 0) {
            if (
              document.getElementById("fmult").checked &&
              playerArray[i] == playerArray[i - 1]
            )
              payout += payoutPerHit / 2;
          }
        }
      }
    }

    // Count hits
    for (let i of dealerArray[0]) {
      if (playerArray.includes(i)) {
        hits++;
      }
    }
    for (let i of dealerArray[1]) {
      if (playerArray.includes(i)) {
        hits++;
      }
    }
    payout = Math.floor(payout);
    totalPayout += payout;
    dealerArray[0] = dealerArray[0].sort((a, b) => b - a);
    gamesPlayed++;

    let playerNumberStr =
      typeof playerChoice === "number" &&
      !isNaN(playerChoice) &&
      playerChoice > 0 &&
      playerChoice <= diceSides
        ? playerChoice
        : "-";
    // Only keep the last game's result
    finalResult =
      "Your Number: " +
      playerNumberStr +
      "; Wild Cards: " +
      displayWildCards.join(", ") +
      "; Dealer Rolls: " +
      dealerArray[0].join(", ") +
      (dealerArray[1].length > 0
        ? ", Dealer Rerolls: " + dealerArray[1].join(", ")
        : "") +
      ". Payout: " +
      payout +
      "; Hits: " +
      hits +
      "<br>";

    if (hits >= playerDice) {
      break;
    }
  }

  let results =
    "Total Payout: " + totalPayout + "<br>" +
    "Final Game result:<br>" +
    finalResult +
    "<br>Games Played: " + gamesPlayed;

  document.getElementById("results").innerHTML = results;
}

function generatePArray(diceAmt, sides, playerChoice) {
  let arr = [];
  // Always include the player's chosen number if valid
  if (
    typeof playerChoice === "number" &&
    !isNaN(playerChoice) &&
    playerChoice > 0 &&
    playerChoice <= sides
  ) {
    arr.push(playerChoice);
  }
  for (let i = arr.length; i < diceAmt; i++) {
    let x = Math.floor(Math.random() * sides) + 1;
    if (!arr.includes(x) || document.getElementById("fmult").checked) {
      arr.push(x);
    } else {
      while (arr.includes(x)) {
        x = Math.floor(Math.random() * sides) + 1;
      }
      arr.push(x);
    }
  }
  return arr;
}

function generateDArray(diceAmt, sides) {
  let arr = [[], []];
  let rerolls = 0;
  for (let i = 0; i < diceAmt; i++) {
    let newnum = Math.floor(Math.random() * sides) + 1;
    if (arr[0].includes(newnum)) rerolls++;
    arr[0].push(newnum);
  }
  while (rerolls > 0) {
    let newnum = Math.floor(Math.random() * sides) + 1;
    if (arr[0].includes(newnum) || arr[1].includes(newnum)) {
      rerolls++;
    }
    arr[1].push(newnum);
    rerolls--;
  }
  return arr;
}
