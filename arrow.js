function drawArrow(vec) {
  let length = calculateArrowLength(vec);
  let headScaling = calculateHeadScaling(length);

  push();
  rotateArrow(vec);
  drawArrowBody(length);
  drawArrowHead(length, headScaling);
  pop();
}

// Helper function to calculate the arrow's length
function calculateArrowLength(vec) {
  return 5 * log(vec.mag());
}

// Helper function to calculate the scaling for the arrowhead
function calculateHeadScaling(length) {
  return length / 10;
}

// Helper function to rotate the arrow based on its vector
function rotateArrow(vec) {
  rotate(-vec.angleBetween(createVector(0, 1)));
}

// Helper function to draw the arrow's body (line)
function drawArrowBody(length) {
  strokeWeight(2);
  line(0, 0, 0, length);
}

// Helper function to draw the arrowhead (triangle)
function drawArrowHead(length, headScaling) {
  triangle(-2 * headScaling, length, 0, length + 3 * headScaling, 2 * headScaling, length);
}