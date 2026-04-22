// backend/ml_service.js
const { PythonShell } = require('python-shell');
const path = require('path');

/**
 * Utility to run prediction via PythonShell
 */
const runSinglePrediction = (features) => {
    return new Promise((resolve, reject) => {
        let options = {
            mode: 'json',
            pythonOptions: ['-u'],
            // Points to the directory where predict.py actually lives
            scriptPath: __dirname, 
        };

        // Initialize shell
        const shell = new PythonShell('predict.py', options);
        let predictionReceived = false;

        // Send features to Python (as JSON array)
        shell.send(features);

        shell.on('message', (message) => {
            // Check if message exists and has the property
            if (message && typeof message.predicted_qty !== 'undefined') {
                predictionReceived = true;
                resolve(message.predicted_qty);
            }
        });

        shell.on('stderr', (stderr) => {
            console.error("🐍 Python Internal Error:", stderr);
        });

        shell.on('error', (err) => {
            console.error("❌ Python Shell Error:", err);
            resolve(0); // Safety: return 0 so the loop continues
        });

        shell.end((err) => {
            if (!predictionReceived) {
                // If the shell closed without sending a message
                if (err) console.error("❌ Shell closed with error:", err);
                resolve(0); // Safety: return 0 to avoid 'undefined'
            }
        });
    });
};

module.exports = { runSinglePrediction };