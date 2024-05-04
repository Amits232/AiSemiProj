import { recurrent } from 'brain.js';
const { LSTM } = recurrent;

// Function to parse CSV data
const parseCSV = function(content) {
    const lines = content.split('\n');
    const headers = lines[0].split(',');

    const data = [];
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');

        if (values.length !== headers.length) {
            console.error(`Line ${i + 1} does not match the header length. Skipping.`);
            continue;
        }

        const personData = {};
        for (let j = 0; j < headers.length; j++) {
            personData[headers[j]] = values[j];
        }

        data.push(personData);
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

        // Create LSTM network
        const net = new LSTM({ hiddenLayers: [20, 10] }); // Adjust hidden layers as needed

        // Train the network
        net.train(trainData, {
            errorThresh: 0.025,
            iterations: 100, // Limit iterations to 100
            log: true,
            logPeriod: 1,
            learningRate: 0.1
        });

        // Function to generate output based on input
        const generateOutput = input => {
            const output = net.run(input);
            // Assuming output is an array of probabilities, find the index with maximum probability
            const maxIndex = output.indexOf(Math.max(...output));
            // Assuming you have an array of words, return the word corresponding to the maxIndex
            return wordsArray[maxIndex];
        };

        // Example input
        const exampleInput = ["Yes","Female","BCA",147,20,70,59,58,"Reading books","1 - 2 Hour","Anytime",1500000,"No","50%","1.30 - 2 hour","0 - 30 minutes","Bad","good","No"];
        // Generate output based on example input
        const output = generateOutput(exampleInput);
        console.log('Output:', output); // Output should be a word
    })
    .catch(err => console.log('Error:', err));
