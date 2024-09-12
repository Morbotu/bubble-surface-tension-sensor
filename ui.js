function createSliderWithInput(labelText, min, max, initialValue, step, xPosLabel, yPos, sliderWidth) {
  // Create a container div to hold the label, input, and slider
  let container = createDiv().style('display', 'flex').style('align-items', 'center');
  container.position(xPosLabel, yPos); // Position the entire container

  // Create label for the slider
  let label = createDiv(labelText + ":").style('width', '120px'); // Set a fixed width to prevent overlap
  label.parent(container); // Add label to the container

  // Function to determine the precision based on the step value
  const getPrecision = (step) => {
    return step.toString().includes('.') ? step.toString().split('.')[1].length : 0;
  };

  // Get the number of decimal places from the step value
  const precision = getPrecision(step);

  // Create input field synced with the slider
  let input = createInput(initialValue.toFixed(precision)).size(50);  // Initialize input with slider value, respecting the step size precision
  input.parent(container); // Add input to the container

  // Create the slider
  let slider = createSlider(min, max, initialValue, step);
  slider.size(sliderWidth);
  slider.parent(container); // Add slider to the container

  // Sync slider and input
  slider.input(() => {
    input.value(slider.value().toFixed(precision)); // Update input when slider changes, respecting the step size precision
    initializeVariables(); // Update the variables
  });

  input.input(() => {
    let newValue = parseFloat(input.value());
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      slider.value(newValue); // Update slider when input changes
      initializeVariables(); // Update the variables
    }
  });

  // Return the slider and input fields, allowing you to read slider values easily
  return {
    slider: slider,
    input: input,
    value: () => parseFloat(slider.value()) // Helper function to get the current slider value
  };
}
