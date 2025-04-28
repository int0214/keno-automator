let replicanti = 1;
const replicantiDisplay = document.getElementById('replicanti');
const resetButton = document.getElementById('resetGame');

function updateDisplay() {
    replicantiDisplay.textContent = `Replicanti: ${Math.floor(replicanti)}`;
}

// 서서히 증가 설정
const targetMultiplierPerSecond = 2;
const updateRate = 30; // 초당 30번 업데이트 (frame rate)
const interval = 1000 / updateRate; // 밀리초 간격
const growthPerTick = Math.pow(targetMultiplierPerSecond, 1 / updateRate);

// 매 tick마다 살짝씩 복제
setInterval(() => {
    replicanti *= growthPerTick;
    updateDisplay();
}, interval);

// 리셋 버튼
resetButton.addEventListener('click', function() {
    replicanti = 1;
    updateDisplay();
});

// 초기 화면 세팅
updateDisplay();
