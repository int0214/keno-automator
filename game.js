let replicanti = 1;
const replicantiDisplay = document.getElementById('replicanti');
const resetButton = document.getElementById('resetGame');

function updateDisplay() {
    replicantiDisplay.textContent = `Replicanti: ${Math.floor(replicanti)}`;
}

// 서서히 증가 설정
const targetMultiplierPerSecond = 2;
const updateRate = 30; // 초당 30번 업데이트
const interval = 1000 / updateRate;
const growthPerTick = Math.pow(targetMultiplierPerSecond, 1 / updateRate);

// 저장 함수
function saveGame() {
    localStorage.setItem('replicanti', replicanti);
}

// 불러오기 함수
function loadGame() {
    const savedReplicanti = localStorage.getItem('replicanti');
    if (savedReplicanti !== null) {
        replicanti = parseFloat(savedReplicanti);
    }
    updateDisplay();
}

// 매 tick마다 복제 + 표시 + 저장
setInterval(() => {
    replicanti *= growthPerTick;
    updateDisplay();
    saveGame();
}, interval);

// 리셋 버튼
resetButton.addEventListener('click', function() {
