import browser from 'webextension-polyfill';
import Echo from 'laravel-echo';

window.io = require('socket.io-client');

export default class App {
  constructor() {
    this.appPath = 'https://streamfb.com';

    this.Echo = new Echo({
      broadcaster: 'socket.io',
      host: `${this.appPath}:8443`,
    });
  }

  asset(uri) {
    return this.appPath + '/' + uri;
  }

  async fetch(uri = '', options = {}) {
    const token = await this.token();

    if (token) {
      options.headers = { ...options.headers, Authorization: `Bearer ${token}`, Accept: 'application/json' };
    }

    if (/^(http(s?):\/\/).+$/.test(uri)) {
      return fetch(uri, options);
    }

    if (/^\//.test(uri)) {
      uri = uri.replace('/', '');
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

  formatCurrency(price) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  }

  echo() {
    return this.Echo;
  }
}
