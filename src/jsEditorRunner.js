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
    // Clear the log output
    // Create a new web worker from the "worker.js" file
    worker = new Worker('src/worker.js');

    let jsCode = jsEditor.getValue();

    // Add event listener to receive messages from the web worker
    worker.addEventListener('message', function (e) {
        let message = e.data;
        if (message.type === 'log') {
            // Append the console log to the log output
            logOutput.setValue(logOutput.getValue() + message.data + '\n');
        } else if (message.type === 'logsEnd') {
            // Signal from worker indicating end of logs
            // Do any cleanup or additional processing here
            worker.terminate(); // Terminate the web worker after logs are done
            worker = null; // Set the current web worker to null
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