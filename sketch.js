// Physics and Simulation Constants
const GRAVITY = 9810;         // Acceleration due to gravity in mm/s^2
const BAR_HEIGHT = 2;          // Height of the bar in mm
const SPRING_DISTANCE = 50       // mm

// Physics constant settings
let mu_d;                     // Dynamic friction coefficient (set by slider)
let unitScale;                   // Scale for drawing objects in the simulation
let surfaceTension;              // Surface tension in mN/mm
let springConstant;              // Spring constant in mN/mm
let dt;                          // Time step for the simulation in seconds
let barMass;                     // Mass of the bar in kg
let tolerance;                   // Tolerance for visual adjustments in mm
let d;                           // Offset distance in mm (for force calculations)
let translationalDampingCoefficient;  // Adjust this experimentally to control internal friction

// Dimensions
const RECT_WIDTH = 150;        // Width of the rectangle in mm
const RECT_HEIGHT = 200;       // Height of the rectangle in mm
const GRADIENT_STEPS = 100;    // Number of steps for gradient drawing
let gradientStepSize = RECT_HEIGHT / GRADIENT_STEPS; // Step size for gradient in mm

// Inertia and Equilibrium
let inertiaMoment; // Moment of inertia of the bar in kg*mm^2
let equilibrium; // Equilibrium position in mm

// Graph Settings
const GRAPH_Y_SCALE = 0.5;      // Scale factor for Y-axis in the graph
const GRAPH_X_SCALE = 1;        // Scale factor for X-axis in the graph
const GRAPH_WIDTH = 400;       // Width of the graph in pixels
const GRAPH_HEIGHT = 150;      // Height of the graph in pixels
const X_TICK_SPACING = 20;      // Spacing of ticks on X-axis
const Y_TICK_SPACING = 20;      // Spacing of ticks on Y-axis

// State Variables (these change during the simulation)
let startXGraph = 0;          // Initial X-position for the graph
let barYPoints = [];          // Array to hold Y positions for the graph
let barY = 0;                 // Current Y-position of the bar in mm
let barV = 0;                 // Current velocity of the bar in mm/s
let barA = 0;                 // Current acceleration of the bar in mm/s^2
let barRot = 0;               // Current rotation of the bar in radians
let barAngV = 0;              // Angular velocity of the bar in rad/s
let barAngA = 0;              // Angular acceleration of the bar in rad/s^2
let simulate = false;         // Flag to indicate if the simulation is running
let time = 0;                 // Simulation time in seconds

// UI and Visual Elements
let origin;                   // Origin point for drawing the scene
let bubbleGradientTop;        // Top gradient color for the bubble
let bubbleGradientBottom;     // Bottom gradient color for the bubble

function setup() {
  createCanvas(windowWidth, windowHeight);
  setupUI();
  initializeVariables();
}

// Function to initialize variables like origin and gradients
function initializeVariables() {
  origin = createVector((width - RECT_WIDTH * unitScale.value()) / 2, (height + RECT_HEIGHT * unitScale.value()) / 2 - 100);
  inertiaMoment = (1 / 12) * barMass.value() * Math.pow(RECT_WIDTH + 10, 2);
  equilibrium = (2 * surfaceTension.value() * RECT_WIDTH - barMass.value() * GRAVITY) / (2 * springConstant.value());

  bubbleGradientTop = color("rgb(0,179,137)");
  bubbleGradientBottom = color("rgb(0,112,255)");
}

// Function to set up the UI elements (sliders, buttons, etc.)
function setupUI() {
  let sliders = {}; // Object to store all the sliders
  let yOffset = 10; // Starting Y position for the first slider

  // Array of sliders configuration
  const slidersConfig = {
    unitScale: { label: "Scale", min: 0.5, max: 3, initialValue: 1.5, step: 0.01 },
    surfaceTension: { label: "Surface Tension", min: 0, max: 0.1, initialValue: 50e-3, step: 0.001 },
    springConstant: { label: "Spring Constant", min: 0, max: 1, initialValue: 0.45, step: 0.01 },
    dt: { label: "Time Step (dt)", min: 0.0001, max: 0.01, initialValue: 0.001, step: 0.0001 },
    barMass: { label: "Bar Mass", min: 0.0001, max: 0.01, initialValue: 0.000383, step: 0.0001 },
    tolerance: { label: "Tolerance", min: 0, max: 5, initialValue: 2, step: 0.1 },
    d: { label: "Offset (d)", min: -RECT_WIDTH / 2, max: RECT_WIDTH / 2, initialValue: -20, step: 1 },
    mu_d: { label: "Dynamic friction", min: 0, max: 1, initialValue: 0.35, step: 0.01 },
    translationalDampingCoefficient : { label: "Damping", min: 0, max: 1, initialValue: 0.05, step: 0.01 }
  };

  // Create sliders for each variable
  Object.entries(slidersConfig).forEach(([key, config]) => {
    let slider = createSliderWithInput(
      config.label, 
      config.min, 
      config.max, 
      config.initialValue, 
      config.step, 
      10, yOffset, 100
    );
    
    sliders[key] = slider; // Store each slider by its label
    yOffset += 30; // Adjust Y position for the next slider
  });
  
  ({ mu_d, unitScale, surfaceTension, springConstant, dt, barMass, tolerance, d, translationalDampingCoefficient } = sliders);

  // Simulate button
  let button = createButton("Simulate");
  button.position(10, yOffset);
  button.mousePressed(startSimulation);
}

// Function to reset the simulation state when the button is pressed
function startSimulation() {
  simulate = true;
  startXGraph = 0;
  barYPoints = [];
  barY = 0;      // mm
  barV = 0;      // mm/s
  barRot = 0;    // rad
  barAngV = 0;   // rad/s
}

function draw() {
  background(220);
  push();
  // Set origin properly
  translate(origin.x, origin.y);
  scale(1, -1);

  drawGraph();
  drawAxis();
  
  scale(unitScale.value(), unitScale.value());
  drawBubbleRect();
  drawFrame();
  drawBar();
  drawSprings();
  
  pop();
  drawStats();
  if (simulate)
    update();
}