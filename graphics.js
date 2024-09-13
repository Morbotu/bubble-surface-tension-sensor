function drawBubbleRect() {
  // Precompute common values
  const halfRectWidth = RECT_WIDTH / 2;
  const adjustedTolerance = halfRectWidth + tolerance.value();
  const absSinBarRot = abs(sin(barRot));
  const barYDifference = (RECT_WIDTH / 2 + tolerance.value()) * sin(barRot);

  push();
  noStroke();
  fill(bubbleGradientBottom);
  
  beginShape();
  if (barRot > 0) {
    vertex(RECT_WIDTH, barY + barYDifference);
    vertex(0, barY + barYDifference);
    vertex(0, barY - barYDifference);  
  } else {
    vertex(RECT_WIDTH, barY + barYDifference);
    vertex(RECT_WIDTH, barY - barYDifference);
    vertex(0, barY - barYDifference);
  }
  endShape();

  for (let i = 0; i < GRADIENT_STEPS; i++) {
    const gradientFactor = i / GRADIENT_STEPS;
    const yOffset = barY + adjustedTolerance * absSinBarRot + i * gradientStepSize;

    fill(lerpColor(bubbleGradientBottom, bubbleGradientTop, gradientFactor));
    rect(0, yOffset, RECT_WIDTH, gradientStepSize);
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
  vertex(-2 * tolerance.value(), bottomStop.value() + REST_DISTANCE);
  vertex(-2 * tolerance.value(), RECT_HEIGHT + 2 * tolerance.value());
  vertex(RECT_WIDTH + 2 * tolerance.value(), RECT_HEIGHT + 2 * tolerance.value());
  vertex(RECT_WIDTH + 2 * tolerance.value(), bottomStop.value() + REST_DISTANCE);

  // Draw the inner cutout using contour
  beginContour();
  vertex(0, bottomStop.value() + REST_DISTANCE);
  vertex(RECT_WIDTH, bottomStop.value() + REST_DISTANCE);
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
  translate((-GRAPH_WIDTH + RECT_WIDTH * unitScale.value()) / 2, -250);

  // Draw graph axes
  drawGraphAxes();

  // Plot points on the graph
  plotGraphPoints();

  // Draw axis labels
  drawAxisLabels();

  drawLegend();

  // Draw ticks on the X and Y axes
  drawXTicks();
  drawYTicks();

  pop();
}

function drawLegend() {
  push();
  textAlign(LEFT, CENTER);
  strokeWeight(3);
  text("Equilibrium", GRAPH_WIDTH - 60, -GRAPH_HEIGHT + 10);
  text("Hoogte", GRAPH_WIDTH - 60, -GRAPH_HEIGHT + 30);
  stroke("blue");
  line(GRAPH_WIDTH - 100, -GRAPH_HEIGHT + 10, GRAPH_WIDTH - 80, -GRAPH_HEIGHT + 10);
  stroke("red");
  line(GRAPH_WIDTH - 100, -GRAPH_HEIGHT + 30, GRAPH_WIDTH - 80, -GRAPH_HEIGHT + 30);
  pop();
  push();
  noFill();
  rect(GRAPH_WIDTH - 120, -GRAPH_HEIGHT - 5, 130, 50);
  pop();
}

// Helper function to draw the X and Y axes
function drawGraphAxes() {
  line(0, -Y_START, 0, GRAPH_HEIGHT); // Y-axis
  line(0, Y_START, GRAPH_WIDTH, Y_START);  // X-axis
}

// Helper function to plot points on the graph
function plotGraphPoints() {
  push();
  stroke("red");
  noFill();
  beginShape();
  for (let i = 0; i < barYPoints.length; i++) {
    vertex(i * GRAPH_X_SCALE, barYPoints[i][0] * GRAPH_Y_SCALE + Y_START); // Plot points based on barYPoints
  }
  endShape();
  stroke("blue");
  beginShape();
  for (let i = 0; i < barYPoints.length; i++) {
    vertex(i * GRAPH_X_SCALE, barYPoints[i][1] * GRAPH_Y_SCALE + Y_START); // Plot points based on barYPoints
  }
  endShape();
  pop();
}

// Helper function to draw the X and Y axis labels
function drawAxisLabels() {
  // const yLabel = calibrationGraph ? "dy (mm)" : "y (mm)";
  const yLabel = calibrationGraph ? "y (mm)" : "y (mm)";
  const xLabel = calibrationGraph ? "k (N/m)" : "t (s)";

  scale(1, -1);  // Invert for correct text orientation
  text("0", -10, -Y_START); // Label for X-axis origin
  text("0", 4, 12 - Y_START);  // Label for Y-axis origin

  // Y-axis label
  push();
  rotate(-HALF_PI);
  textAlign(CENTER);
  text(yLabel, GRAPH_HEIGHT / 2, -40);
  pop();

  // X-axis label
  push();
  textAlign(CENTER);
  text(xLabel, GRAPH_WIDTH / 2, 50);
  pop();
}

// Helper function to draw ticks and labels on the X-axis
function drawXTicks() {
  for (let x = X_TICK_SPACING; x < GRAPH_WIDTH + X_TICK_SPACING; x += X_TICK_SPACING) {
    line(x - startXGraph % X_TICK_SPACING, 3 - Y_START, x - startXGraph % X_TICK_SPACING, -3 - Y_START); // Tick marks

    // Tick labels
    push();
    translate((x - startXGraph % X_TICK_SPACING), 15 - Y_START);
    rotate(QUARTER_PI);  // Rotate labels for better readability
    text(((x + X_TICK_SPACING * Math.floor(startXGraph / X_TICK_SPACING)) / GRAPH_X_SCALE * (calibrationGraph ? 0.01 : dt.value())).toFixed(3), 0, 0);
    pop();
  }
}

// Helper function to draw ticks and labels on the Y-axis
function drawYTicks() {
  textAlign(RIGHT, CENTER);
  for (let y = -Y_TICK_SPACING + Y_START; y > -GRAPH_HEIGHT; y -= Y_TICK_SPACING) {
    line(3, y, -3, y);  // Tick marks
    if (y + Y_START == 0) continue;
    text(-(y + Y_START) / GRAPH_Y_SCALE, -5, y); // Tick labels
  }
}

function drawSprings() {
  const springWindings = 7;
  const y1 = barY - bottomStop.value() - REST_DISTANCE - (RECT_WIDTH / 2 - 20) * sin(barRot);
  const y2 = barY - bottomStop.value() - REST_DISTANCE + (RECT_WIDTH / 2 - 20) * sin(barRot);

  push();
  noFill();

  // Draw left spring
  drawSpring(RECT_WIDTH / 2 - SPRING_DISTANCE, y1);

  // Draw right spring
  drawSpring(RECT_WIDTH / 2 + SPRING_DISTANCE, y2);

  // Draw spring end points
  strokeWeight(5);
  point(RECT_WIDTH / 2 - SPRING_DISTANCE, y1 + bottomStop.value() + REST_DISTANCE);
  point(RECT_WIDTH / 2 + SPRING_DISTANCE, y2 + bottomStop.value() + REST_DISTANCE);
  point(RECT_WIDTH / 2 + SPRING_DISTANCE, bottomStop.value() + REST_DISTANCE);
  point(RECT_WIDTH / 2 - SPRING_DISTANCE, bottomStop.value() + REST_DISTANCE);

  pop();
}

// Helper function to draw a single spring
function drawSpring(xPos, yEnd) {
  const springWindings = 7;

  beginShape();
  vertex(xPos, bottomStop.value() + REST_DISTANCE);
  vertex(xPos, bottomStop.value() + REST_DISTANCE + 10);
  for (let i = 1; i < springWindings; i += 2) {
    vertex(xPos - 10, i * (yEnd - 20) / springWindings + bottomStop.value() + REST_DISTANCE + 10);
    vertex(xPos + 10, (i + 1) * (yEnd - 20) / springWindings + bottomStop.value() + REST_DISTANCE + 10);
  }
  vertex(xPos, yEnd - 10 + bottomStop.value() + REST_DISTANCE);
  vertex(xPos, yEnd + bottomStop.value() + REST_DISTANCE);
  endShape();
}
