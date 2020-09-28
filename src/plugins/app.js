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

  findMatchPhoneNumber(input) {
    const re = /(\+?84|0)(\s|\.)?(\d{1,4})(\s|\.)?(\d{2,4})(\s|\.)?(\d{2,5})/gim;

    const matchPhoneNumbers = input.match(re);

    return matchPhoneNumbers ? matchPhoneNumbers[0] : null;
  }

  normalizePhone(phoneNumber) {
    const re = /^(\+?84|0)(\s|\.)?(\d{1,4})(\s|\.)?(\d{2,4})(\s|\.)?(\d{2,5})$/;
    if (!re.test(phoneNumber)) {
      throw new Error('Số điện thoại không đúng định dạng');
    }

    const matches = re.exec(phoneNumber);
    return `0${matches[3]}${matches[5]}${matches[7]}`;
  }

  formatCurrency(price) {
    return (price - 0)
      .toFixed(1)
      .replace(/\d(?=(\d{3})+\.)/g, '$&,')
      .replace(/\.0$/, '');
  }

  currencyToNumber(currency) {
    return (currency + '').replace(/[^\d.]/g, '') - 0 || 0;
  }

  echo() {
    return this.Echo;
  }
}
