import { recurrent } from 'brain.js';
const { LSTM } = recurrent;

// Function to parse CSV data
const parseCSV = (content) => {
  const lines = content.split('\n').slice(1);
  return lines.map((line) => {
    const values = line.split(',');
    // Assuming the last value is the output (word label)
    const output = values.pop().trim(); // Remove any leading/trailing whitespace
    const input = values.map(val => isNaN(val) ? val.trim() : parseFloat(val)); // Parse numbers, leave non-numeric values as strings
    return { input, output };
  });
};

let net;

// Train the network
fetch('./public/data.csv')
  .then(res => res.text())
  .then(content => {
    const trainData = parseCSV(content);
    console.log(`Got ${trainData.length} samples`);

    net = new LSTM({ hiddenLayers: [20, 10] });
    net.train(trainData, {
      errorThresh: 0.06,
      iterations: 20,
      log: true,
      logPeriod: 1,
      learningRate: 0.3,
      gpu: true,
    });
  })
  .catch(err => console.log('Error:', err.message));

// Function to generate output based on input
function generateOutput(input) {
  if (!net) {
    console.error('Network is not initialized');
    return;
  }
  const output = net.run(input);
  console.log('Output:', output);
  return output;
}

document.getElementById('predict-button').addEventListener('click', () => {
  const inputs = getInputs();
  const output = generateOutput(inputs);
  const outputBox = document.getElementById('output-box');
  outputBox.textContent = output;
});

function getInputs() {
  const inputs = {};
  const inputFields = document.querySelectorAll('.input-box');
  const selectFields = document.querySelectorAll('select');

  inputFields.forEach((field) => {
    const id = field.id;
    const value = field.type === 'number' ? parseFloat(field.value) : field.value;
    inputs[id] = value;
  });

  selectFields.forEach((field) => {
    const id = field.id;
    const selectedOptions = field.selectedOptions;

    if (selectedOptions.length === 1) {
      inputs[id] = selectedOptions[0].value;
    } else {
      const values = [];
      for (let i = 0; i < selectedOptions.length; i++) {
        values.push(selectedOptions[i].value);
      }
      inputs[id] = values;
    }
  });

  return inputs;
}
