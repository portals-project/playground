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

// Add event listener to the "run-button"
document.querySelector("#run-button").addEventListener("click", function () {
    // Clear the console log
    logOutput.setValue("");

    if (worker) {
        // If there is a current web worker, terminate it before creating a new one
        worker.terminate();
    }
    // Create a new web worker from the "worker.js" file
    worker = new Worker('assets-playground/js/worker.js');

    let jsCode = jsEditor.getValue();

    let countLines = 0;
    const maxLines = 1024;

    // Declare a variable to store the current log output
    let currentLog = '';
    let loggingInterval = null;

    // Add event listener to receive messages from the web worker
    worker.addEventListener('message', function (e) {
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
            if (countLines >= maxLines) {
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
            worker.terminate(); // Terminate the web worker after logs are done
            worker = null; // Set the current web worker to null
            setTimeout(() => clearInterval(loggingInterval), 200); // Delay clearing the interval to allow the last log to be displayed
        }
    });

    // Send the JavaScript code to the web worker
    const timeoutDuration = 5000; // 5 seconds
    setTimeout(function () {
        if (worker) {
            // If the worker is still running after timeout, terminate it
            worker.terminate();
            worker = null;
            // Log an error in log output
            logOutput.setValue(logOutput.getValue() + 'Error: Execution timed out\n');
        }
    }, timeoutDuration);

    worker.postMessage(jsCode);
});

// SWAPPING EXAMPLE PROGRAMS:

function helloVLDBExample() {
    jsEditor.setValue(__helloVLDBExample__);
}

function rangeFilterExample() {
    jsEditor.setValue(__rangFilterExample__);
}

function mapExample() {
    jsEditor.setValue(__mapExample__);
}

function simpleRecursiveExample() {
    jsEditor.setValue(__simpleRecursiveExample__);
}