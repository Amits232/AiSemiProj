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
    input: [
      row[1] === 'Male' ? 1 : 0, // Gender
      row[2] === 'BCA' ? 1 : 0, // Department
      parseFloat(row[3]), // Height
      parseFloat(row[4]), // Weight
      parseInt(row[5]), // 10th Mark
      parseInt(row[6]), // 12th Mark
      parseFloat(row[8]), // Daily studying time (in hours)
      row[9] === 'Morning' ? 1 : 0, // Prefer to study in morning
      parseInt(row[16]), // Financial Status
      row[17] === 'Yes' ? 1 : 0, // Part-time job
      // Add more input features as needed
    ],
    output: [
      parseFloat(row[15]), // Stress Level
    ]
  }));

  // Define neural network architecture
  const net = new brain.NeuralNetwork({
    hiddenLayers: [3], // Define one hidden layer with 3 neurons
  });

  // Train the neural network
  net.train(trainingData);

  // Use the trained model for predictions
  const input = [
    // Provide input values for prediction
    // For example, if you want to predict the stress level of a new individual:
    // [1, 1, 100, 58, 79, 64, 1.5, 1, 2, 1] // Sample input values for prediction
  ];
  const output = net.run(input);
  console.log('Prediction:', output);
});
