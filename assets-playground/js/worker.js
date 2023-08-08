importScripts('portals-portalsjs-opt.js?v=0.2');

self.addEventListener('message', function (e) {
    let jsCode = e.data;

    // Override console.log to capture logs and send them to the main thread
    console.log = function (...args) {
        self.postMessage({ type: 'log', data: args.join(' ') }); // Send the logs to the main thread joined with a space
    };

    try {
        // Execute the JavaScript code
        eval(jsCode);
    } catch (error) {
        // Catch any errors that occur during execution
        self.postMessage({ type: 'error', data: error.toString() });
    }

    // Send a signal to indicate the end of logs
    self.postMessage({ type: 'logsEnd' });
});