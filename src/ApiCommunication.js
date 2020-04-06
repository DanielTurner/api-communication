/**
 * @class ApiCommunication
 * @extends LitElement
 */
export class ApiCommunication {
  /**
   */
  constructor() {
    this.body = {};
    this.cache = 'no-cache';
    this.contentType = 'application/json; charset=utf-8';
    this.credentials = 'omit';
    this.eventTarget = {};
    this.failureEvent = 'failure';
    this.headers = {};
    this.id = '';
    this.isOffline = false;
    this.method = 'GET';
    this.mode = 'cors';
    this.response = {};
    this.successEvent = 'success';
    this.url = '';
    this.localStorageName = `apiCommunication_${this.id}`;
    this.addEventListener('fire', (event) => (this.fired()), false);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
  }

  /**
   */
  async fired() {
    this.response = await this.sendRequest(null, { onLine: !this.isOffline });
    return this.response;
  }

  /**
   * @param {Request} existingRequest any pre-existing request object
   * @param {Object} checker the object holding the offline status
   * @return {Promise|null} response
   */
  async sendRequest(existingRequest = null, checker = navigator) {
    if (ApiCommunication._getOfflineStatus(checker)) {
      this.queueRequest();
      return null;
    }
    // eslint-disable-next-line
    let request = existingRequest ? existingRequest :
        this._createNewRequest();

    try {
      const response = await fetch(request);
      if (!response.ok) {
        if (!existingRequest) {
          this.notifyFailure(request);
        }
        return null;
      }
      const json = await response.json();
      const successRequest = { ...{ request }, ...{ response: json } };
      if (!existingRequest) {
        this.notifySuccess(successRequest);
      }
      return successRequest;
    } catch (error) {
      // eslint-disable-next-line
      console.error(error);
      return null;
    }
  }

  /**
   * @param {Object} browser
   * @return {Boolean}
   */
  static _getOfflineStatus(browser = navigator) {
    return !browser.onLine;
  }

  /**
   * @param {Boolean} queued
   * @return {Request}
   */
  _createNewRequest(queued) {
    const myInitObject = {
      method: this.method,
      mode: this.mode,
      cache: this.cache,
      credentials: this.credentials,
      headers: this.headers,
      redirect: 'follow',
      referrerPolicy: 'origin',
    };

    if (this.method.toLowerCase() !== 'get' &&
        this.method.toLowerCase() !== 'head') {
      myInitObject.body = JSON.stringify(this.body);
    }
    if (queued) return { url: this.url, init: myInitObject };
    return new Request(this.url, myInitObject);
  }

  /**
   */
  queueRequest() {
    let currentRequests = localStorage.getItem(this.localStorageName);
    if (currentRequests && currentRequests.length &&
        currentRequests.length > 0) {
      currentRequests = JSON.parse(currentRequests);
    } else {
      currentRequests = [];
    }
    const newRequest = this._createNewRequest(true);
    currentRequests.push({ ...newRequest });
    localStorage.setItem(
        this.localStorageName,
        JSON.stringify(currentRequests)
    );
  }

  /**
   */
  async processQueue() {
    // Check time past has elapsed before trying again.
    if (this.isOffline) return;
    let currentRequests = localStorage.getItem(this.localStorageName);
    if (currentRequests !== null) {
      currentRequests = JSON.parse(currentRequests);
    } else {
      return;
    }

    const failures = [];
    // eslint-disable-next-line
    for (const request of currentRequests) {
      // eslint-disable-next-line
      if (ApiCommunication._getOfflineStatus(checker)) {
        const response = await this.sendRequest(
            new Request(request.url, request.init)
        );
        if (!response) {
          this.notifyFailure(request);
          failures.push(request);
        } else {
          this.notifySuccess(request);
        }
      } else {
        failures.push(request);
      }
    }

    if (failures.length) {
      localStorage.setItem(this.localStorageName, JSON.stringify(failures));
    } else {
      localStorage.setItem(this.localStorageName, []);
    }
  }

  /**
   * @param {Object} data the changed data
   */
  notifySuccess(data) {
    if (ApiCommunication._isObjectEmpty(this.eventTarget)) return;
    this.eventTarget.dispatchEvent(
        new CustomEvent(this.successEvent,
            {
              bubbles: true,
              detail: data,
              url: this.url,
              id: this.id,
            })
    );
  }

  /**
   * @param {*} data
   */
  notifyFailure(data) {
    if (ApiCommunication._isObjectEmpty(this.eventTarget)) return;
    this.eventTarget.dispatchEvent(
        new CustomEvent(this.failureEvent,
            {
              bubbles: true,
              detail: data,
              url: this.url,
              id: this.id,
            })
    );
  }

  /**
   */
  updateOnlineStatus() {
    const oldValue = this.isOffline;
    this.isOffline = ApiCommunication._getOfflineStatus(checker);

    if(!this.isOffline) {
      if(this.isOffline !== oldValue) {
        this.processQueue();
      }
    }
  }

  /**
   * @param {Object} obj
   * @return {Boolean}
   */
  static _isObjectEmpty(obj) {
    return Object.entries(obj).length === 0 && obj.constructor === Object;
  }
}
