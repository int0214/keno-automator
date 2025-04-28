import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class ReplicantiGameGUI {
    private double replicanti = 1;
    private double timeSpent = 0;  // 플레이 시간
    private double timeSpeed = 1 / (128 * Math.pow(replicanti, 0.5));  // 게임 속도 (너프 적용)
    private double productionMultiplier = 1;  // 생산력 곱셈
    private double upgradeCostMultiplier = 1;  // 업그레이드 비용
    private boolean nerfsActive = false;  // Nerfs 버튼 활성화 여부
    
    private JLabel replicantiLabel;
    private JLabel timeLabel;
    private JLabel nerfsLabel;

    public ReplicantiGameGUI() {
        // GUI 초기 설정
        JFrame frame = new JFrame("Replicanti Game");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(400, 300);
        frame.setLayout(new BorderLayout());
        
        JPanel panel = new JPanel();
        panel.setLayout(new GridLayout(5, 1));
        
        // Replicanti 값 출력 라벨
        replicantiLabel = new JLabel("Replicanti: " + String.format("%.3f", replicanti));
        panel.add(replicantiLabel);
        
        // 플레이 시간 출력 라벨
        timeLabel = new JLabel("Time Spent: " + timeSpent + " seconds");
        panel.add(timeLabel);
        
        // Nerfs 상태 출력 라벨
        nerfsLabel = new JLabel("Nerfs: Inactive");
        panel.add(nerfsLabel);
        
        // Nerfs 버튼
        JButton nerfsButton = new JButton("Toggle Nerfs");
        nerfsButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                onNerfsButtonPressed();
            }
        });
        panel.add(nerfsButton);
        
        frame.add(panel, BorderLayout.CENTER);
        frame.setVisible(true);
        
        // Game loop simulation (time-based update)
        Timer timer = new Timer(1000, new ActionListener() {  // 1 second interval
            @Override
            public void actionPerformed(ActionEvent e) {
                updateGame(1.0);  // 1 second passed
            }
        });
        timer.start();
    }
    
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
            nerfsLabel.setText("<html><b>Nerfs Activated:</b><br>" +
                "1. Game speed slowed by 128x<br>" +
                "2. All production is divided by replicanti^0.5<br>" +
                "3. All production is divided by (timeSpent * 10)^2<br>" +
                "4. Replicanti duplicates itself as replicanti^0.5<br>" +
                "5. Upgrade costs are squared<br>" +
                "6. Replicanti is halved every second</html>");
        } else {
            nerfsLabel.setText("Nerfs: Inactive");
        }
    }
    
    public void updateGame(double deltaTime) {
        timeSpent += deltaTime;
        
        // Apply nerfs periodically or as needed
        if (timeSpent > 1) {  // Example: Nerfs applied every second or game loop
            applyNerfs();
        }
        
        // Update labels with current game state
        updateLabels();
    }
    
    public void updateLabels() {
        // Update GUI labels to show the current game state
        SwingUtilities.invokeLater(new Runnable() {
            @Override
            public void run() {
                replicantiLabel.setText("Replicanti: " + String.format("%.3f", replicanti));
                timeLabel.setText("Time Spent: " + String.format("%.1f", timeSpent) + " seconds");
            }
        });
    }

    public static void main(String[] args) {
        // Start the game with the GUI
        new ReplicantiGameGUI();
    }
}
