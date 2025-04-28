let replicanti = 1;

const replicantiDisplay = document.getElementById('replicanti');
const manualButton = document.getElementById('manualMultiply');
const resetButton = document.getElementById('resetGame');

// 함수: Replicanti를 2배로 늘림
function multiplyReplicanti() {
    replicanti *= 2;
    updateDisplay();
}

// 함수: 화면에 Replicanti 숫자 업데이트
function updateDisplay() {
    replicantiDisplay.textContent = `Replicanti: ${Math.floor(replicanti)}`;
}

// 1초마다 자동으로 2배 증가
setInterval(multiplyReplicanti, 1000);

// 수동으로 버튼 눌러서도 증가 가능
manualButton.addEventListener('click', multiplyReplicanti);

// 리셋 버튼
resetButton.addEventListener('click', function() {
    replicanti = 1;
    updateDisplay();
});

// 처음 화면 세팅
updateDisplay();
