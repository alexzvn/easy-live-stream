import browser from 'webextension-polyfill';
import Echo from 'laravel-echo';

window.io = require('socket.io-client');

export default class App {
  constructor() {
    this.appPath = 'http://localhost';

    this.Echo = new Echo({
      broadcaster: 'socket.io',
      host: `${this.appPath}:8443`,
    });
  }

  async fetch(uri, options) {
    const token = await this.token();

    options = options === undefined ? {} : options;

    if (token) {
      options.headers = { ...options.headers, Authorization: `Bearer ${token}` };
    }

    return fetch(`${this.appPath}/${uri}`, options);
  }

  async user() {
    const res = await this.fetch('api/me');

    if (res.ok) {
      return await res.json();
    }

    return null;
  }

  async token() {
    const cookie = await browser.cookies.get({ url: this.appPath, name: 'token' });

    return cookie ? cookie.value : null;
  }

  echo() {
    return this.Echo;
  }
}
