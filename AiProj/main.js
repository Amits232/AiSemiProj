import { recurrent } from 'brain.js';
const { LSTM } = recurrent;
// Create LSTM network
let net = new LSTM({ hiddenLayers: [20, 10] });
// Function to parse CSV data
const parseCSV = function (content) {
  const predictButton = document.getElementById('predict-button');
  predictButton.addEventListener('click', () => {
    const inputElems = document.querySelectorAll('input-box');
    const inputValues = Array.from(inputElems).map(input => parseFloat(input.value));
    const output = net.run(inputValues);
    const outputElem = document.getElementById('output-box');
    console.log("output: " + output);
  });

  const lines = content.split('\n');
  const headers = lines[0].split(',');

  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');

    if (values.length !== headers.length) {
      console.error(`Line ${i + 1} does not match the header length. Skipping.`);
      continue;
    }

    // Assuming the last value is the output/target
    const output = values.pop();

    // Convert numerical values to numbers
    const numericalValues = values.map(val => isNaN(parseFloat(val)) ? val : parseFloat(val));

    data.push({ input: numericalValues, output });
  }

  return data;
};

// Fetch data from CSV file
fetch('./public/data.csv')
  .then(response => response.text())
  .then(trainContent => {
    // Parse CSV data
    const trainData = parseCSV(trainContent);

    console.log('Got ' + trainData.length + ' samples');


    // Train the network
    net.train(trainData, {
      errorThresh: 0.025,
      iterations: 10, // Limit iterations to 100
      log: true,
      logPeriod: 1,
      learningRate: 0.1
    });

    // Function to generate output based on input
    const generateOutput = input => {
      const output = net.run(input);
      console.log('Output:', output);
      return output;
    };

    // Example input
    const exampleInput = [0.5, 0.7, 0.2, 0.4]; // Update with appropriate numerical values
    // Generate output based on example input
    const output = generateOutput(exampleInput);
    console.log('Output:', output); // Output should be a word
  })
  .catch(err => console.log('Error:', err));
