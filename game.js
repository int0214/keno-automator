function roll(){
  let a = "<font color='#ffffff'>"
  let games = Number(document.getElementById("games").value)
  let wild = Number(document.getElementById("wild").value)
  let level = Number(document.getElementById("level").value)
  let diceSides = Number(document.getElementById("sides").value)
  
  let payoutPerHit = wild * level
  let playerDice = level+4
  let dealerDice = level+14
  let totalPayout = 0
  let results = ""
  let gamesPlayed = 0;
  for (let game = 1; game <= games; game++){
    let payout = -(playerDice * level)
    let hits = 0
    let playerArray = generatePArray(playerDice, diceSides)
    let dealerArray = generateDArray(dealerDice, diceSides)
    playerArray = playerArray.sort((a,b)=>b-a)
    if (document.getElementById("rmult").checked){
      let playerhits = []
      for (let i of dealerArray[0].concat(dealerArray[1])){
        if (playerArray.includes(i)){
        if (!playerhits.includes(i)){
          playerhits.push(i)
          payout += payoutPerHit
        } else {
          payout += payoutPerHit*3/2
        }
        }
      }
    }else {
    for (let i in playerArray) {
      if (dealerArray[0].includes(playerArray[i]) || dealerArray[1].includes(playerArray[i])){
        payout += payoutPerHit
        if (i > 0){
        if (document.getElementById("fmult").checked && playerArray[i] == playerArray[i-1])
          payout += payoutPerHit/2
        }
      }
    }
    }
    for (let i of dealerArray[0]){
      if (playerArray.includes(i)){
        hits++;
      }
    }
    for (let i of dealerArray[1]){
      if (playerArray.includes(i)){
        hits++;
      }
    }
    payout = Math.floor(payout)
    totalPayout += payout
    dealerArray[0] = dealerArray[0].sort((a,b)=>b-a)
    gamesPlayed++;
    if (games <= 10000 || game == games || hits >= playerDice)
    results += "Wild Cards: "+playerArray.join(", ")+"; Dealer Rolls: "+dealerArray[0].join(", ")+(dealerArray[1].length>0?", Dealer Rerolls: "+dealerArray[1].join(", "):"")+". Payout: "+payout+", Hits: "+hits+"<br>"
    if (hits >= playerDice){
      break;
    }
  }
  if (games <= 10000) results = "Total Payout: "+totalPayout+"<br>"+results
  else  results = "Total Payout: "+totalPayout+"<br>Final Game result:<br>"+results+"<br>Games Played: "+gamesPlayed
  if (wild < level+4) {
    results = "You do not have enough wild cards to automate keno"
  }
  document.getElementById("results").innerHTML = results;
}

function generatePArray(diceAmt, sides) {
  let arr = []
  for (let i = 0; i < diceAmt; i++){
    let x = Math.floor(Math.random()*sides)+1
    if (!arr.includes(x) || document.getElementById("fmult").checked){arr.push(x)}
    else {
      while (arr.includes(x)){
        x = Math.floor(Math.random()*sides)+1
      }
      arr.push(x)
    }
  }
  return arr
}

function generateDArray(diceAmt, sides) {
  let arr = [[],[]]
  let rerolls = 0
  for (let i = 0; i < diceAmt; i++){
    let newnum = Math.floor(Math.random()*sides)+1
    if (arr[0].includes(newnum)) rerolls++
    arr[0].push(newnum)
  }
  while (rerolls > 0) {
    let newnum = Math.floor(Math.random()*sides)+1
    if (arr[0].includes(newnum) || arr[1].includes(newnum)){rerolls++}
    arr[1].push(newnum)
    rerolls--
    
  }
  return arr
}
