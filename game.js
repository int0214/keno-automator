public class ReplicantiGame {
    private double replicanti = 1;
    private double timeSpent = 0;  // 플레이 시간
    private double timeSpeed = 1 / (128 * Math.pow(replicanti, 0.5));  // 게임 속도 (너프 적용)
    
    private double productionMultiplier = 1;  // 생산력 곱셈
    private double upgradeCostMultiplier = 1;  // 업그레이드 비용
    private boolean nerfsActive = false;  // Nerfs 버튼 활성화 여부
    
    public void applyNerfs() {
        // 게임 속도 너프
        timeSpeed = 1 / (128 * Math.pow(replicanti, 0.5));  // 게임 속도 너프
        productionMultiplier /= Math.pow(replicanti, 0.5);  // 생산력 나누기
        productionMultiplier /= Math.pow(timeSpent * 10, 2);  // 시간 기반 생산력 나누기
        
        // replicanti 복제 너프
        replicanti *= Math.pow(replicanti, 0.5);
        
        // 업그레이드 비용 너프
        upgradeCostMultiplier = Math.pow(upgradeCostMultiplier, 2);
        
        // replicanti 감소 너프 (매 초마다 2로 나누어짐)
        replicanti /= 2;
    }
    
    public void onNerfsButtonPressed() {
        nerfsActive = !nerfsActive;  // Nerfs 상태 토글
        if (nerfsActive) {
            System.out.println("Nerfs Activated:");
            System.out.println("1. Game speed slowed by 128x");
            System.out.println("2. All production is divided by replicanti^0.5");
            System.out.println("3. All production is divided by (timeSpent * 10)^2");
            System.out.println("4. Replicanti duplicates itself as replicanti^0.5");
            System.out.println("5. Upgrade costs are squared");
            System.out.println("6. Replicanti is halved every second");
        } else {
            System.out.println("Nerfs Deactivated.");
        }
    }
    
    public void updateGame(double deltaTime) {
        timeSpent += deltaTime;
        
        // Apply nerfs periodically or as needed
        if (timeSpent > 1) {  // Example: Nerfs applied every second or game loop
            applyNerfs();
        }
        
        // Output current game state
        displayGameState();
    }
    
    public void displayGameState() {
        System.out.println("Replicanti: " + replicanti);
        System.out.println("Time Spent: " + timeSpent + " seconds");
        System.out.println("Current Time Speed: " + timeSpeed);
        System.out.println("Production Multiplier: " + productionMultiplier);
        System.out.println("Upgrade Cost Multiplier: " + upgradeCostMultiplier);
    }
    
    public static void main(String[] args) {
        ReplicantiGame game = new ReplicantiGame();
        
        // Simulate game update (could be in a game loop)
        game.updateGame(1.0);  // Simulate 1 second passed
        
        // Simulate pressing the Nerfs button
        game.onNerfsButtonPressed();  // Activate Nerfs
        game.updateGame(1.0);  // Another second passed
        
        game.onNerfsButtonPressed();  // Deactivate Nerfs
        game.updateGame(1.0);  // Another second passed
    }
}
