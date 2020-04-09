# API Communication
Most web applications communicate with a server, but once the app is built often offline has not been considered.
This class bridges a small part of the offline gap allowing requests that occur when the useris offline to be stored in the browser localstorage.


## Usage
Get the package from npm
```npm
npm i @danielturner/api-communication
```

### Setup
Easiest way to use is to include this class as you would include any other es module to your lit application.
```javascript
import { ApiCommunication } from 'api-communication';
```
Create an instance of it set the properties then either set the id especially if you intend to have multiple.
Keep it simple, one is often better than many.

Here you can setup the listeners to for the success and or failure events.
You can set the names of these events as they are attributes on the class.
```javascript
  constructor() {
    this.communication = {};
    this.communication = new ApiCommunication;
    this.communication.url = 'https://jsonplaceholder.typicode.com/todos/1';
    window.addEventListener('success', (response) => {
      this.handleSuccess(response);
    });
    window.addEventListener('failure', (response) => {
      this.handleFailure(response);
    });
  }
```

Set the properties you need for the current call
```javascript
this.communication.cache = 'no-cache';
this.communication.method = 'GET';
```
### Firing the request
Then fire the action
```javascript 
this.communication.fire();
```

### Getting a response
There are currently two methods of getting a response, the first is the fire function returns a value asyncronously
OR
You can listen to the success or failure events.
This is the suggested method as you can handle them based on your ID that you set.
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
    `
  }
```
## Offline
The reason the best method is to listen to the success or failure events is that when returning online you won't have the luxury of a returned value on the fire method. However, the success or failure events are still triggered. This way your app can seamlessly update the data which in turn will update the users UI.
```javascript
  render() {
  handleSuccess(response) {
    this.info = response.detail.response.title;
  }

  handleFailure(response) {
    this.info = response.detail.response.status;
  }

  return html`
      <div class="theinfo">${this.info}</div>
    `
  }
```

## Profit
Hopefully this serves you well, remember any suggestions and bug fixes can be requested through merge requests or issues.