import { jest } from '@jest/globals';

describe('ApiCommunication', () => {
  let ApiCommunication;

  const mockOnLine = jest.fn(() => true);

  let mockLocalStorageData = {};

  const mockLocalStorage = {
    getItem: (key) => {
      return JSON.stringify(mockLocalStorageData[key]);
    },
    setItem: (key, value) => {
      mockLocalStorageData[key] = JSON.parse(value);
    },
    removeItem: (key) => {
      delete mockLocalStorageData[key];
    },
    clear: () => {
      mockLocalStorageData = {};
    },
  };

  const mockWindow = {
    addEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  };

  beforeAll(async () => {
    global.navigator = { onLine: true };
    Object.defineProperty(global.navigator, 'onLine', {
      get: mockOnLine,
      configurable: true,
    });

    global.localStorage = mockLocalStorage;
    global.window = mockWindow;

    const module = await import('../src/ApiCommunication.js');
    ApiCommunication = module.ApiCommunication;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnLine.mockReturnValue(true);
    jest.useFakeTimers();

    global.window.addEventListener = jest.fn().mockImplementation((event, handler) => {
      if (!global.window.__handlers__) {
        global.window.__handlers__ = {};
      }
      global.window.__handlers__[event] = handler;
    });

    global.window.dispatchEvent = jest.fn().mockImplementation((event) => {
      const handler = global.window.__handlers__[event.type];
      if (handler) {
        handler(event);
      }
    });
  });


  afterAll(() => {
    jest.useRealTimers();
  });

  describe('Offline Functionality', () => {
    it('should queue a request when offline', async () => {
      mockOnLine.mockReturnValue(false);

      const apiComm = new ApiCommunication('1');
      apiComm.url = 'https://jsonplaceholder.typicode.com/todos/1';

      await apiComm.fire();

      var savedValue = mockLocalStorage.getItem('apiCommunication_1');
      var savedObject = JSON.parse(savedValue);

      expect(savedObject[0].url).toStrictEqual('https://jsonplaceholder.typicode.com/todos/1');
    });

    it('should process the queue when online', async () => {

      mockOnLine.mockReturnValue(false);
      const apiCommOffline = new ApiCommunication('1');
      apiCommOffline.url = 'https://jsonplaceholder.typicode.com/todos/1';
      await apiCommOffline.fire();

      var savedValue = mockLocalStorage.getItem('apiCommunication_1');
      var savedObject = JSON.parse(savedValue);

      expect(savedObject[0].url).toBe('https://jsonplaceholder.typicode.com/todos/1');

      mockOnLine.mockReturnValue(true);

      await apiCommOffline.processQueue();

      const currentRequests = JSON.parse(localStorage.getItem(apiCommOffline.localStorageName));
      expect(currentRequests).toStrictEqual([]);
    });
  });

  describe('Online Functionality', () => {
    it('should fire a request and receive a success event', async () => {
      mockOnLine.mockReturnValue(true);

      const apiComm = new ApiCommunication('1');
      apiComm.url = 'https://jsonplaceholder.typicode.com/todos/1';

      let successHandler;
      global.window.addEventListener(apiComm.successEvent, (event) => {
        successHandler(event);
      });

      const successPromise = new Promise((resolve) => {
        successHandler = (event) => {
          expect(event.detail.response).toHaveProperty('userId');
          expect(event.detail.response).toHaveProperty('id');
          resolve(true);
        };
      });

      await apiComm.fire();

      jest.runAllTimers();

      await expect(successPromise).resolves.toBe(true);
    }, 10000);

    it('should fire a request and receive a failure event for non-existent URL', async () => {
      mockOnLine.mockReturnValue(true);

      const apiComm = new ApiCommunication('1');
      apiComm.url = 'https://jsonplaceholder.typicode.com/nonexistent';

      let failureHandler;
      global.window.addEventListener(apiComm.failureEvent, (event) => {
        failureHandler(event);
      });

      const failurePromise = new Promise((resolve) => {
        failureHandler = (event) => {
          expect(event.detail.response.status).toBe(404);
          resolve(true);
        };
      });

      await apiComm.fire();

      jest.runAllTimers();

      await expect(failurePromise).resolves.toBe(true);
    }, 10000);
  });

  describe('Utility Functions', () => {
    it('_getOfflineStatus should return true when offline', () => {
      mockOnLine.mockReturnValue(false);
      expect(ApiCommunication._getOfflineStatus()).toBe(true);
    });

    it('_getOfflineStatus should return false when online', () => {
      mockOnLine.mockReturnValue(true);
      expect(ApiCommunication._getOfflineStatus()).toBe(false);
    });

    it('_isObjectEmpty should return true for empty object', () => {
      expect(ApiCommunication._isObjectEmpty({})).toBe(true);
    });

    it('_isObjectEmpty should return false for non-empty object', () => {
      expect(ApiCommunication._isObjectEmpty({ key: 'value' })).toBe(false);
    });
  });
});
