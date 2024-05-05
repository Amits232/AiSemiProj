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

// Function to train the network
const trainNetwork = (trainData) => {
  net = new LSTM({ hiddenLayers: [20, 10] });
  net.train(trainData, {
    errorThresh: 0.06,
    iterations: 1,
    log: true,
    logPeriod: 1,
    learningRate: 0.3,
    gpu: true,
  });
};

// Function to generate output (predicted stress levels) for the entire dataset
const generateOutputForDataset = (dataset, userInput) => {
  if (!net) {
    console.error('Network is not initialized');
    return;
  }

  const userInputs = Object.values(userInput);

  const stressLevels = dataset.map(data => {
    const output = net.run(data.input);
    let distance = 0;
    for (let i = 0; i < userInputs.length; i++) {
      distance += Math.abs(userInputs[i] - data.input[i]);
    }
    return { input: data.input, predictedStressLevel: output['Stress Level'], distance };
  });

  return stressLevels;
};

// Train the network and generate output on button click
fetch('./public/data.csv')
  .then(res => res.text())
  .then(content => {
    const trainData = parseCSV(content);
    console.log(`Got ${trainData.length} samples`);
    trainNetwork(trainData);

    document.getElementById('predict-button').addEventListener('click', () => {
      const inputs = getInputs();
      const output = generateOutput(inputs, trainData);
      const outputBox = document.getElementById('output-box');
      outputBox.textContent = output;
    });
  })
  .catch(err => console.log('Error:', err.message));

// Function to generate output based on input
function generateOutput(input, dataset) {
  const output = generateOutputForDataset(dataset,input);
  console.log('Output:', output);
  return output;
}

// Function to retrieve input data
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
