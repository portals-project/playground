//////////////////////////////////////////////////////////////////////////////
// CODE EDITORS AND RUNNING SCRIPTS
//////////////////////////////////////////////////////////////////////////////

// CATCH LOG CALLS TO CONSOLE LOG
console.stdlog = console.log.bind(console);
console.logs = [];
console.log = function () {
    console.logs.push(Array.from(arguments));
    console.stdlog.apply(console, arguments);
}

// THE JAVASCRIPT EDITOR
var jsEditor = CodeMirror(document.querySelector("#js-code"), {
    value: __helloVLDBExample__,
    mode: "javascript",
    tabSize: 4,
    lineNumbers: true,
});

// THE LOG OUTPUT, READ ONLY
var logOutput = CodeMirror(document.querySelector("#console-log"), {
    value: "",
    mode: "text",
    tabSize: 4,
    lineNumbers: true,
    readOnly: true,
});

// RUN THE CODE IN THE jsEditor

let worker = null; // Store the current web worker
let running = false; // Store whether the code is currently running
let timer = null; // Store the timer for the code execution

let countLines = 0; // Store the number of lines in the log output
let currentLog = ''; // Store the current log output
let loggingInterval = null; // Store the interval for updating the log output

const TIMEOUT_DURATION = 5000000; // Store the timeout duration for the code execution
const MAX_LINES = 1024; // Store the maximum number of lines in the log output

// Get the run button
const runButton = document.querySelector("#run-button");

// Start the web worker
function startWorker() {
    if (worker) {
        // If there is a current web worker, terminate it before creating a new one
        worker.terminate();
    }
    // Create a new web worker from the "worker.js" file
    worker = new Worker('assets-playground/js/worker.js');
}

// Reset the values of the variables used for logging
function resetValues() {
    running = false;
    countLines = 0;
    currentLog = '';
    loggingInterval = null;
    clearInterval(timer);
    clearInterval(loggingInterval);
    logOutput.setValue(currentLog);
}

// Handle the run button click
function handleWorkerMessage(e) {
    const message = e.data;
    // If loggingInterval is null, start it
    if (loggingInterval === null) {
        // Every 100 ms, update the log output
        function updateLogOutput() {
            logOutput.setValue(currentLog); // Set the log output to the current log
            logOutput.setCursor(logOutput.lineCount()); // Set the cursor to the end of the log output
        }

        loggingInterval = setInterval(updateLogOutput, 100);
    }

    // Append the console log or error to the log output
    if (message.type === 'log' || message.type === 'error') {
        // Check if the line count exceeds the maximum
        if (countLines >= MAX_LINES) {
            // Get rid of the first line if the line count exceeds the maximum
            const firstNewLine = currentLog.indexOf('\n');
            currentLog = currentLog.substring(firstNewLine + 1);
        }

        // Append the console log or error to the log output
        currentLog += message.type === 'error' ? `Error: ${message.data}` : `${message.data}\n`;

        // Increment the line count
        countLines++;
    }

    // Terminate the web worker and clear the interval after logs are done
    if (message.type === 'error' || message.type === 'logsEnd') {
        setTimeout(() => clearInterval(loggingInterval), 200); // Delay clearing the interval to allow the last log to be displayed
        clearInterval(timer); // Clear the timer
        running = false;
    }
}

// Start a timer to terminate the web worker after a certain duration
function startTimer() {
    timer = setTimeout(function () {
        if (running) {
            // If the worker is still running after timeout, terminate it
            worker.terminate();
            worker = null;
            // Log an error in log output
            logOutput.setValue(logOutput.getValue() + 'Error: Execution timed out\n');
        }
    }, TIMEOUT_DURATION);
}

// Send the JavaScript code to the web worker
function sendCodeToWorker(jsCode) {
    worker.postMessage(jsCode);
    running = true; // Set the running state to true
}

// Add event listener to the "run-button"
runButton.addEventListener("click", function () {
    startWorker();
    resetValues();
    // Add event listener to receive messages from the web worker
    worker.addEventListener('message', handleWorkerMessage);

    startTimer();

    sendCodeToWorker(jsEditor.getValue());
});
