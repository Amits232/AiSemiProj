import * as brain from 'brain.js';


const brain = require('brain.js');
const fs = require('fs');

// Read the CSV file
fs.readFile('./public/data.csv', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  // Parse CSV data
  const rows = data.split('\n').map(row => row.split(','));

  // Prepare training data
  const trainingData = rows.map(row => ({
    input: row.slice(0, -1).map(Number), // Assuming the last column is the output
    output: [row[row.length - 1]] // Assuming the output is a single value
  }));

  // Define neural network architecture
  const net = new brain.NeuralNetwork({
    // Define your architecture here
  });

  // Train the neural network
  net.train(trainingData);

  // Save the trained model if needed
  // const model = net.toJSON();
  // fs.writeFileSync('model.json', JSON.stringify(model));

  // Use the trained model for predictions
  const input = [/* Provide input values for prediction */];
  const output = net.run(input);
  console.log('Prediction:', output);
});


