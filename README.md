# API Communication

Most web applications communicate with a server, but often offline capabilities have not been considered. This class bridges a small part of the offline gap by allowing requests that occur when the user is offline to be stored in the browser's localStorage.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Setup](#setup)
  - [Firing the Request](#firing-the-request)
  - [Getting a Response](#getting-a-response)
- [Offline Handling](#offline-handling)
- [Demo](#demo)
  - [Running the Demo](#running-the-demo)
- [Testing](#testing)
  - [Running Tests](#running-tests)
- [Contributing](#contributing)

## Installation

Install the package from npm:
```bash
npm i api-communication
```


## Usage

Install the package from npm:
```bash
npm i api-communication
```

### Setup

The easiest way to use this class is to include it as you would any other ES module in your Lit application.
```javascript
import { ApiCommunication } from 'api-communication';
```
Create an instance of `ApiCommunication`, set the properties, and optionally set the ID if you intend to have multiple instances. Keeping it simple is often better than having many instances.

Set up listeners for success and failure events. You can set the names of these events as attributes on the class.
```javascript
constructor() {
    this.communication = new ApiCommunication('uniqueid'); // Set an id here (optional)
    this.communication.url = 'https://jsonplaceholder.typicode.com/todos/1';
    
    window.addEventListener('success', (response) => {
        this.handleSuccess(response);
    });

    window.addEventListener('failure', (response) => {
        this.handleFailure(response);
    });
}
```

Set the properties you need for the current call.
```javascript
this.communication.cache = 'no-cache';
this.communication.method = 'GET';
```
### Firing the request

Then, fire the action using the `fire()` method.
```javascript
this.communication.fire();
```

### Getting a response

There are currently two methods of getting a response:

1. The `fire()` function returns a value asynchronously:
    ```javascript
    async handleResponse() {
        const response = await this.communication.fire();
        if (response) {
            console.log(response.detail.response.title);
        }
    }
    ```

2. Listen to the success or failure events. This is the suggested method as you can handle them based on your ID that you set.
    ```javascript
    handleSuccess(response) {
        this.info = response.detail.response.title;
    }

    handleFailure(response) {
        this.info = response.detail.response.status;
    }

    render() {
        return html`
            <div class="theinfo">${this.info}</div>
        `;
    }
    ```

### Offline Handling

The reason the best method is to listen to the success or failure events is that when returning online, you won't have the luxury of a returned value from the `fire()` method. However, the success or failure events are still triggered. This way, your app can seamlessly update the data which in turn will update the user's UI.

## Demo

### Running the demo

The demo provides an interactive way to thest the API commmunication functionality. To run the demo:
1. Ensure you have cloned the repo to a local directory on your development machine

2. Start a local HTTP server (important to test modules) [NPM has a local http server if you don't have one already]

3. Access the demo in a browser localhost.../demo.html

4. Follow the demo instructions on screen

## Tests
This project now has automated tests using Jest.

### Running tests
npm run test
npm run test:coverage

### Example results

Latest time the tests ran the following was the output

 PASS  test/ApiCommunication.test.js
  ApiCommunication
    Offline Functionality
      ✓ should queue a request when offline (2 ms)
      ✓ should process the queue when online (69 ms)
    Online Functionality
      ✓ should fire a request and receive a success event (12 ms)
      ✓ should fire a request and receive a failure event for non-existent URL (11 ms)
    Utility Functions
      ✓ _getOfflineStatus should return true when offline
      ✓ _getOfflineStatus should return false when online (1 ms)
      ✓ _isObjectEmpty should return true for empty object
      ✓ _isObjectEmpty should return false for non-empty object (1 ms)

---------------------|---------|----------|---------|---------|------------------------------------------------------------
File                 | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s                                          
---------------------|---------|----------|---------|---------|------------------------------------------------------------
All files            |   73.62 |    63.63 |   76.92 |   75.86 |                                                            
 ApiCommunication.js |   73.62 |    63.63 |   76.92 |   75.86 | 26,29,69-70,99,114-115,128,140,146-148,162-166,171,212-217 
---------------------|---------|----------|---------|---------|------------------------------------------------------------
Test Suites: 1 passed, 1 total
Tests:       8 passed, 8 total
Snapshots:   0 total
Time:        0.283 s, estimated 1 s

## Contributing

Feel free to contribute by opening issues or submitting pull requests. Your help is greatly appreciated!



