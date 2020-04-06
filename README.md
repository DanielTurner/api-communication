# API Communication
Most web applications communicate with a server, but once the app is built often offline has not been considered.
This class bridges a small part of the offline gap allowing requests that occur when the useris offline to be stored in the browser localstorage.


## Usage
### Setup
Easiest way to use is to include this class as you would include any other es module to your lit application.
Create an instance of it set the properties then either set the id especially if you intend to have multiple.

Set the properties you need for the current call
```javascript
this.apiCommunication.cache = 'no-cache';
this.apiCommunication.method = 'GET';
```
### Firing the request
Then fire the action
```javascript 
this.apiCommunication.fire();
```

### Getting a response
There are currently two methods of getting a response, the first is the fire function returns a value asyncronously
OR
You can listen to the success or failure events.
This is the suggested method as you can handle them based on your ID that you set.

## Offline
The reason the best method is to listen to the success or failure events is that when returning online you won't have the luxury of a returned value on the fire method. However, the success or failure events are still triggered. This way your app can seamlessly update the data which in turn will update the users UI.

## Profit
Hopefully this serves you well, remember any suggestions and bug fixes can be requested through merge requests or issues.