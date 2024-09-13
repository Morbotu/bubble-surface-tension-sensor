function update() {
  const surfaceTensionForce = calculateSurfaceTensionForce();
  const springForce = calculateSpringForce();
  const torque = calculateTotalTorque(surfaceTensionForce);
  const internalFrictionForce = calculateInternalFrictionForce();
  const direction = barV ? barV / abs(barV) : 0;

  let dynamicFriction = 0;

  // Update bar rotation based on torque
  updateBarRotation(torque);

  // Calculate dynamic friction only if bar is rotating
  if (abs(barRot) > acos(RECT_WIDTH / (RECT_WIDTH + tolerance.value()))) {
    barRot = constrainRotation(barRot);
    barAngV = 0;
    dynamicFriction = calculateDynamicFriction(torque, barRot);
  }

  // Update bar height and velocity
  updateBarHeightAndVelocity(surfaceTensionForce, springForce, dynamicFriction, internalFrictionForce, direction);

  // Update graph data and time
  updateGraphAndTime();

  // Check bounds for the bar
  checkBarBounds();
}

// Helper function to calculate surface tension force
function calculateSurfaceTensionForce() {
  return 2 * RECT_WIDTH * surfaceTension.value();
}

// Helper function to calculate spring force
function calculateSpringForce() {
  return 2 * springConstant.value() * (barY - bottomStop.value());
}

// Helper function to calculate torque based on surface tension force
function calculateTotalTorque(surfaceTensionForce) {
  const surfaceTensionTorque = d.value() * surfaceTensionForce * sin(barRot + HALF_PI);
  const springTorque = calculateSpringTorque(); // Calculate torque from the springs
  return surfaceTensionTorque + springTorque;
}

// Helper function to calculate the torque from the springs
function calculateSpringTorque() {
  // Calculate the displacement of each spring based on bar rotation
  const displacement = SPRING_DISTANCE * sin(barRot);  // Displacement for both springs

  // Calculate the force on each spring based on displacement (both springs pulling)
  const springForce = -springConstant.value() * displacement;

  // The torque contributed by each spring (force * distance from the center of mass)
  const springTorque = 2 * springForce * SPRING_DISTANCE;

  return springTorque;
}

// Helper function to update bar rotation
function updateBarRotation(torque) {
  barAngA = torque / inertiaMoment;
  barAngV += barAngA * dt.value();
  barRot += barAngV * dt.value();
}

// Constrain rotation within allowable limits
function constrainRotation(rotation) {
  const maxRotation = acos(RECT_WIDTH / (RECT_WIDTH + tolerance.value()));
  return rotation > 0 ? maxRotation : -maxRotation;
}

// Helper function to calculate dynamic friction
function calculateDynamicFriction(torque, rotation) {
  return mu_d.value() * torque / ((RECT_WIDTH + tolerance.value()) * sin(rotation));
}

// Helper function to update the bar's height and velocity (including internal friction)
function updateBarHeightAndVelocity(surfaceTensionForce, springForce, dynamicFriction, internalFrictionForce, direction) {
  // Calculate the net acceleration including forces from surface tension, spring, friction, and internal damping
  barA = (surfaceTensionForce - springForce - direction * dynamicFriction * 2 - internalFrictionForce) / barMass.value() - GRAVITY;

  // Stop simulation if forces are balanced
  if (shouldStopSimulation(surfaceTensionForce, springForce, dynamicFriction, internalFrictionForce, direction)) {
    simulate = false;
    return;
  }

  // Update velocity and position
  barV += barA * dt.value();
  barY += barV * dt.value();

  gradientStepSize = (RECT_HEIGHT - barY - (RECT_WIDTH / 2 + tolerance.value()) * abs(sin(barRot))) / GRADIENT_STEPS;
}

// Helper function to calculate internal friction (viscous damping) for translation
function calculateInternalFrictionForce() {
  return translationalDampingCoefficient.value() * barV; // Internal friction force proportional to velocity
}

// Update the simulation stop condition to account for small net forces and velocity
function shouldStopSimulation(surfaceTensionForce, springForce, dynamicFriction, internalFrictionForce, direction) {
  const netForce = surfaceTensionForce - springForce - direction * dynamicFriction * 2 - internalFrictionForce - barMass.value() * GRAVITY;

  // Define thresholds for force and velocity
  const forceThreshold = 0.01;  // A small value that defines when forces are considered balanced
  const velocityThreshold = 0.05;  // A small value to determine when velocity is close to zero
  
  // Check if both net force and velocity are below their respective thresholds
  const isForceSmall = abs(netForce) < forceThreshold;
  const isVelocitySmall = abs(barV) < velocityThreshold;
  const barStopped = abs(surfaceTensionForce - springForce - barMass.value() * GRAVITY) < dynamicFriction;
  
  // Stop the simulation if both conditions are satisfied
  return isForceSmall && isVelocitySmall || barStopped || time > 4;
}


// Helper function to update the graph and time data
function updateGraphAndTime() {
  time += dt.value();

  if (calibrationGraph) return;

  barYPoints.push(barY);

  if (barYPoints.length * GRAPH_X_SCALE > GRAPH_WIDTH) {
    barYPoints.shift();
    startXGraph += GRAPH_X_SCALE;
  }
}

// Helper function to check if the bar exceeds bounds
function checkBarBounds() {
  if (barY > RECT_HEIGHT - BAR_HEIGHT || barY < bottomStop.value()) {
    barY = barY > RECT_HEIGHT - BAR_HEIGHT ? RECT_HEIGHT - BAR_HEIGHT : bottomStop.value();
    barV = 0;
    simulate = false;
  }
}
