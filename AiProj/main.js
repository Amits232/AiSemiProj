import { NeuralNetwork, recurrent } from 'brain.js';
const { LSTM } = recurrent;

let net;

// Function to parse CSV data
const parseCSV = (content) => {
  const lines = content.split('\n').slice(1);
  return lines.map((line) => {
    const values = line.split(',');
    const output = values.pop().trim();
    const input = values.map(val => isNaN(val) ? val.trim() : parseFloat(val));
    return { input, output };
  });
};

// Function to train the network
const trainNetwork = (trainData) => {
  net = new LSTM({ hiddenLayers: [20, 20, 20] });
  net.train(trainData, {
    errorThresh: 0.6,
    iterations: 1000, // Reduced iterations for quicker feedback
    log: true,
    logPeriod: 1,
    learningRate: 0.3,
    gpu: true,
  });
};

// Function to generate output for a given set of inputs
const generateOutput = (userInputs) => {
  debugger
  console.log('User Inputs:', userInputs);
  
  // Check if the neural network is initialized
  if (!net) {
    console.error('Network is not initialized');
    return null; // Return null or handle the error appropriately
  }
  
  try {
    // Map over each input data and make predictions using the neural network
    const output = net.run(userInputs);
    console.log('Output:', output);
    return output;
  } catch (error) {
    console.error('Error generating output:', error);
    return null; // Return null or handle the error appropriately
  }
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
      console.log('Inputs:', inputs);

      const output = generateOutput(inputs);
      console.log('Output:', output);
      displayResults(output);
    });
  })
  .catch(err => console.log('Error:', err.message));

// Function to display results
function displayResults(output) {
  const outputBox = document.getElementById('output-box');
  let result = '';
  outputBox.textContent = result;
}

// Function to retrieve input data
function getInputs() {
  const inputs = [];
  const inputFields = document.querySelectorAll('.input-box');
  const selectFields = document.querySelectorAll('select');

  inputFields.forEach((field) => {
    const id = field.id;
    const value = field.type === 'number' ? parseFloat(field.value) : field.value;
    inputs.push(value);
  });

  selectFields.forEach((field) => {
    const id = field.id;
    const selectedOptions = field.selectedOptions;

    if (selectedOptions.length === 1) {
      inputs.push(selectedOptions[0].value);
    } else {
      const values = [];
      for (let i = 0; i < selectedOptions.length; i++) {
        inputs.push(selectedOptions[i].value);
      }      
    }
  });

  return inputs;
}
