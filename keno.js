function roll() {
  let games = Number(document.getElementById("games").value);
  let wild = Number(document.getElementById("wild").value);
  let level = Number(document.getElementById("level").value);
  let diceSides = Number(document.getElementById("sides").value);
  let playerChoice = Number(document.getElementById("playerChoice").value);
  let hotSeat = Number(document.getElementById("hotSeat").value); // New input

  if (isNaN(hotSeat) || hotSeat <= 0) hotSeat = 1; // Default multiplier to 1 if not valid

  let playerDice = level + 4;
  let dealerDice = level + 14;
  let leftoverWild = 0;

  // If wildcard is bigger than playerDice, use only playerDice worth
  if (wild > playerDice) {
    leftoverWild = wild - playerDice;
    wild = playerDice;
  }

  // Force people to fill all the cells: if wild < 0 or playerChoice is not valid, abort
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

  let payoutPerHit = Math.pow((wild + leftoverWild + 1) * level, hotSeat);
  let totalPayout = 0;
  let gamesPlayed = 0;

  // Track best result: most hits, then most payout, if tie then latest
  let bestResult = "";
  let bestHits = -Infinity;
  let bestPayout = -Infinity;
  let bestGameNum = -1;

  for (let game = 1; game <= games; game++) {
    // Always use current payoutPerHit for this game
    let payout = -payoutPerHit;
    let hits = 0;
    let playerArray = generatePArray(playerDice, diceSides, playerChoice);
    let dealerArray = generateDArray(dealerDice, diceSides);
    playerArray = playerArray.sort((a, b) => b - a);

    let displayWildCards = playerArray.filter(n => n !== playerChoice);

    // Trim wild cards array to match the used wildcard amount (display only as many as used)
    if (displayWildCards.length > wild) {
      displayWildCards = displayWildCards.slice(0, wild);
    }

    if (document.getElementById("rmult").checked) {
      let playerhits = [];
      for (let i of dealerArray[0].concat(dealerArray[1])) {
        if (playerArray.includes(i)) {
          if (!playerhits.includes(i)) {
            playerhits.push(i);
            payout += payoutPerHit; // already multiplied by hotSeat above
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
          payout += payoutPerHit; // already multiplied by hotSeat above
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
    let thisResult =
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

    // Save best result according to: most hits, then most payout, then latest
    if (
      hits > bestHits ||
      (hits === bestHits && payout > bestPayout) ||
      (hits === bestHits && payout === bestPayout && game > bestGameNum)
    ) {
      bestHits = hits;
      bestPayout = payout;
      bestResult = thisResult;
      bestGameNum = game;
    }

    if (hits >= playerDice) {
      break;
    }
  }

  let results =
    "Total Payout: " + totalPayout + "<br>" +
    "Best Game result:<br>" +
    bestResult +
    "<br>Games Played: " + gamesPlayed;

  document.getElementById("results").innerHTML = results;
}

// Add this input to your HTML where appropriate:
// <input type="number" id="hotSeat" placeholder="Hot Seat (multiplier)" value="1">

function generatePArray(diceAmt, sides, playerChoice) {
  let arr = [];
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
