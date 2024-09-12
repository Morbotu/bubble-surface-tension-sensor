function drawStats() {
  push();
  textAlign(RIGHT, TOP);
  textSize(30);

  let lineHeight = textSize(); // Dynamically calculate line height based on font size
  let initialYOffset = 20;     // Initial Y offset from the top
  
  // List of stats
  const stats = [
    "Time: " + time.toFixed(3) + " s",
    "y: " + barY.toFixed(2) + " mm",
    "dy: " + (barY - equilibrium).toFixed(2) + " mm",
    "angle: " + degrees(barRot).toFixed(2) + " °",
  ];

  // Loop through stats and draw them with appropriate Y offsets
  stats.forEach((stat, index) => {
    drawStat(stat, initialYOffset + index * lineHeight);
  });

  pop();
}

// Helper function to draw each stat
function drawStat(statText, yOffset) {
  text(statText, width - 20, yOffset);
}