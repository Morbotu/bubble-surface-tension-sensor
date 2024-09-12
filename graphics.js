

function drawBubbleRect() {
  push();
  noStroke();
  fill(bubbleGradientBottom);
  beginShape();
  if (barRot > 0) {
    vertex(RECT_WIDTH, barY + (RECT_WIDTH / 2 + tolerance.value()) * sin(barRot));
    vertex(0, barY + (RECT_WIDTH / 2 + tolerance.value()) * sin(barRot));
    vertex(0, barY - (RECT_WIDTH / 2 + tolerance.value()) * sin(barRot));  
  } else {
    vertex(RECT_WIDTH, barY + (RECT_WIDTH / 2 + tolerance.value()) * sin(barRot));
    vertex(RECT_WIDTH, barY - (RECT_WIDTH / 2 + tolerance.value()) * sin(barRot));
    vertex(0, barY - (RECT_WIDTH / 2 + tolerance.value()) * sin(barRot));
  }
  endShape();
  for (let i = 0; i < GRADIENT_STEPS; i++) {
    fill(lerpColor(bubbleGradientBottom, bubbleGradientTop, i / GRADIENT_STEPS));
    rect(0, barY + (RECT_WIDTH / 2 + tolerance.value()) * abs(sin(barRot)) + i * gradientStepSize, RECT_WIDTH, gradientStepSize);
  }
  pop();
}

function drawFrame() {
  push();
  fill("grey");

  // Draw the outer frame with inner contour
  drawOuterFrameWithContour();

  // Draw frame lines
  drawFrameLines();

  pop();
}

// Helper function to draw the outer frame with the inner contour (cutout)
function drawOuterFrameWithContour() {
  beginShape();
  vertex(-2 * tolerance.value(), -30);
  vertex(-2 * tolerance.value(), RECT_HEIGHT + 2 * tolerance.value());
  vertex(RECT_WIDTH + 2 * tolerance.value(), RECT_HEIGHT + 2 * tolerance.value());
  vertex(RECT_WIDTH + 2 * tolerance.value(), -30);

  // Draw the inner cutout using contour
  beginContour();
  vertex(0, -30);
  vertex(RECT_WIDTH, -30);
  vertex(RECT_WIDTH, RECT_HEIGHT);
  vertex(0, RECT_HEIGHT);
  endContour();

  endShape();
}

// Helper function to draw frame lines (horizontal)
function drawFrameLines() {
  stroke("black");
  strokeWeight(2);
  line(0, 0, RECT_WIDTH, 0);  // Top line of the frame

  stroke("red");
  line(0, equilibrium, RECT_WIDTH, equilibrium);  // Equilibrium line
}


function drawBar() {
  push();

  // Draw the horizontal line indicating the bar's position
  drawBarLine();

  // Draw the rotating bar itself
  drawRotatingBar();

  pop();

  // Draw the force arrow acting on the bar
  drawForceArrow();
}

// Helper function to draw the horizontal line at barY
function drawBarLine() {
  stroke("cyan");
  line(0, barY, RECT_WIDTH, barY); // Horizontal line across the bar's position
}

// Helper function to draw the rotating bar rectangle
function drawRotatingBar() {
  noStroke();
  fill("orange");
  rectMode(CENTER);
  translate(RECT_WIDTH / 2, barY);
  rotate(barRot);
  rect(0, 0, RECT_WIDTH + tolerance.value() * 2, BAR_HEIGHT); // Rotating rectangle representing the bar

  // Draw the bar endpoints
  drawBarEndpoints();
}

// Helper function to draw the bar's endpoints
function drawBarEndpoints() {
  strokeWeight(5);
  stroke(0);
  point(-RECT_WIDTH / 2 - tolerance.value(), 0);  // Left endpoint
  point(RECT_WIDTH / 2 + tolerance.value(), 0);   // Right endpoint
}

// Helper function to draw the force arrow acting on the bar
function drawForceArrow() {
  push();
  translate(RECT_WIDTH / 2 + d.value(), barY + d.value() * sin(barRot)); // Adjust position based on bar rotation
  fill(0);
  drawArrow(createVector(0, 2 * RECT_WIDTH * surfaceTension.value()));  // Draw force vector arrow
  pop();
}


function drawAxis() {
  push();
  setupAxis();
  drawYAxisArrow();
  drawYAxisLabel();
  pop();
}

// Helper function to set up the axis translation and color
function setupAxis() {
  fill("black");
  translate(-30, 0);
}

// Helper function to draw the Y-axis arrow
function drawYAxisArrow() {
  drawArrow(createVector(0, 100)); // Arrow indicating the positive Y direction
}

// Helper function to draw the Y-axis label
function drawYAxisLabel() {
  scale(1, -1);  // Invert to make the label right-side-up
  textSize(20);
  textAlign(CENTER);
  text("y", 0, -50);  // Positioning the "y" label above the arrow
}

function drawGraph() {
  push();
  translate((-GRAPH_WIDTH + RECT_WIDTH * unitScale.value()) / 2, -200);

  // Draw graph axes
  drawGraphAxes();

  // Plot points on the graph
  plotGraphPoints();

  // Draw axis labels
  drawAxisLabels();

  // Draw ticks on the X and Y axes
  drawXTicks();
  drawYTicks();

  pop();
}

// Helper function to draw the X and Y axes
function drawGraphAxes() {
  line(0, 0, 0, GRAPH_HEIGHT); // Y-axis
  line(0, 0, GRAPH_WIDTH, 0);  // X-axis
}

// Helper function to plot points on the graph
function plotGraphPoints() {
  push();
  stroke("red");
  for (let i = 0; i < barYPoints.length; i++) {
    point(i * GRAPH_X_SCALE, barYPoints[i] * GRAPH_Y_SCALE); // Plot points based on barYPoints
  }
  pop();
}

// Helper function to draw the X and Y axis labels
function drawAxisLabels() {
  scale(1, -1);  // Invert for correct text orientation
  text("0", -10, 0); // Label for X-axis origin
  text("0", 0, 12);  // Label for Y-axis origin

  // Y-axis label
  push();
  rotate(-HALF_PI);
  textAlign(CENTER);
  text("y (mm)", GRAPH_HEIGHT / 2, -40);
  pop();

  // X-axis label
  push();
  textAlign(CENTER);
  text("t (s)", GRAPH_WIDTH / 2, 50);
  pop();
}

// Helper function to draw ticks and labels on the X-axis
function drawXTicks() {
  for (let x = X_TICK_SPACING; x < GRAPH_WIDTH + X_TICK_SPACING; x += X_TICK_SPACING) {
    line(x - startXGraph % X_TICK_SPACING, 3, x - startXGraph % X_TICK_SPACING, -3); // Tick marks

    // Tick labels
    push();
    translate((x - startXGraph % X_TICK_SPACING), 15);
    rotate(QUARTER_PI);  // Rotate labels for better readability
    text(((x + X_TICK_SPACING * Math.floor(startXGraph / X_TICK_SPACING)) / GRAPH_X_SCALE * dt.value()).toFixed(3), 0, 0);
    pop();
  }
}

// Helper function to draw ticks and labels on the Y-axis
function drawYTicks() {
  textAlign(RIGHT, CENTER);
  for (let y = -Y_TICK_SPACING; y > -GRAPH_HEIGHT; y -= Y_TICK_SPACING) {
    line(3, y, -3, y);  // Tick marks
    text(-y / GRAPH_Y_SCALE, -5, y); // Tick labels
  }
}

function drawSprings() {
  const springWindings = 7;
  const y1 = barY - (RECT_WIDTH / 2 - 20) * sin(barRot);
  const y2 = barY + (RECT_WIDTH / 2 - 20) * sin(barRot);

  push();
  noFill();

  // Draw left spring
  drawSpring(RECT_WIDTH / 2 - SPRING_DISTANCE, y1);

  // Draw right spring
  drawSpring(RECT_WIDTH / 2 + SPRING_DISTANCE, y2);

  // Draw spring end points
  strokeWeight(5);
  point(RECT_WIDTH / 2 - SPRING_DISTANCE, y1);
  point(RECT_WIDTH / 2 + SPRING_DISTANCE, y2);
  point(RECT_WIDTH / 2 + SPRING_DISTANCE, -30);
  point(RECT_WIDTH / 2 - SPRING_DISTANCE, -30);

  pop();
}

// Helper function to draw a single spring
function drawSpring(xPos, yEnd) {
  const springWindings = 7;

  beginShape();
  vertex(xPos, -30);
  vertex(xPos, -20);
  for (let i = 1; i < springWindings; i += 2) {
    vertex(xPos - 10, i * (yEnd + 10) / springWindings - 20);
    vertex(xPos + 10, (i + 1) * (yEnd + 10) / springWindings - 20);
  }
  vertex(xPos, yEnd - 10);
  vertex(xPos, yEnd);
  endShape();
}
