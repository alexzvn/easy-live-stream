<template>
  <div class="main-popup">
    <div class="header-popup">
      <span class="product-name">Easy Live Stream</span>
      <a :href="app.asset('logout')" v-if="user" target="_blank" class="logout">Đăng xuất</a>
      <button @click="closePopup()" class="btn-close"><i class="ti-close" aria-hidden="true"></i></button>
    </div>
    <div class="clearfix"></div>

    <div class="content-popup" v-if="user">
      <div class="header-content">
        <span class="title-content">Lịch sử bán hàng online</span>
        <a class="btn-popup btn-pri" href="/options/options.html" target="_blank">Quản lý đơn hàng</a>
      </div>
      <div class="wrap-list-order">
        <table class="tb-order">
          <thead>
            <th style="width: 60px;">#</th>
            <th style="width: 150px;">Tên livestream</th>
            <th>Chốt đơn</th>
            <th>Doanh thu</th>
            <th>Ngày</th>
          </thead>
          <tbody>
            <tr>
              <td>13</td>
              <td>livestream...</td>
              <td>chốt đơn</td>
              <td>888</td>
              <td>15/08/2020 12:04:00</td>
            </tr>
            <tr>
              <td>12</td>
              <td>livestream...</td>
              <td>chốt đơn</td>
              <td>999</td>
              <td>16/08/2020 12:04:00</td>
            </tr>
            <tr>
              <td>...</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="wrap-action" style="text-align: center;">
        <a href="https://www.facebook.com/live/producer/" target="_blank" class="btn-popup btn-second btn-action">Bắt đầu Live Stream</a>
        <button class="btn-popup btn-pri btn-action">Xuất Excel</button>
      </div>
    </div>
    <div class="content-popup" v-if="!user">
      <div style="text-align: center; margin-bottom: 20px; margin-top: 20px">
        <a class="btn-popup btn-pri" style="font-size: 18px;" :href="app.asset('login/facebook/redirect')" target="_blank">
          Đăng nhập bằng facebook
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import App from './../../../plugins/app';

export default {
  data() {
    return {
      app: new App(),
      user: null,
    };
  },
  methods: {
    closePopup() {
      window.close();
    },

    async init() {
      this.app.user().then(user => {
        this.user = user;
      });
    },
  },
  created() {
    this.init();
  },
};
</script>

<style lang="css" scoped>
a {
  text-decoration: none;
}

button {
  border: none;
  cursor: pointer;
  color: #444;
  transition: all ease-out 0.15s;
}

button:hover {
  transition: all ease-in 0.15s;
}

button:focus {
  outline: none;
}

.logout {
  position: absolute;
  top: 8px;
  right: 51px;
  color: #232323;
  font-weight: 400;
}

.main-popup {
  width: 600px;
  background: #fff;
  margin: auto;
}

.row {
  display: flex;
  flex-wrap: nowrap;
}

.name-popup,
.btn-close {
  display: inline-block;
}

.header-popup .btn-close,
.header-content .btn-popup {
  float: right;
}

.clearfix {
  clear: both;
}

.header-popup {
  height: 20px;
  background: #38c7ff;
  padding: 10px;
}

.product-name {
  color: #fff;
}

.btn-close {
  border-radius: 50%;
  padding: 3px 6px;
  /* border: 1px solid #ff5e56; */
  background: #c14253;
  color: #fff;
  text-align: center;
  cursor: pointer;
  margin-top: -2px;
}

.btn-close:hover {
  background: #a53746;
}

.btn-popup {
  padding: 8px 12px;
  border-radius: 16px;
}

.btn-close i {
  font-size: 10px;
}

/* .header-content{
       } */

.title-content {
  font-weight: 500;
  font-size: 18px;
}

.btn-pri {
  background: #1181d0;
  color: #fff;
}

.btn-pri:hover {
  background: #0d6bad;
  color: #fff;
}

.btn-second {
  background: #a15dbd;
  color: #fff;
}

.btn-second:hover {
  background: #8946a5;
  color: #fff;
}

.content-popup {
  background: #fffcff;
  padding: 30px;
}

.wrap-list-order {
  margin-top: 30px;
  border: 1px solid #e4e4e4;
  padding: 10px;
  border-radius: 10px;
  background: #fdfaff;
}

.tb-order {
  table-layout: fixed;
  width: 100%;
  font-size: 14px;
  border-spacing: 0px;
}

.tb-order thead th {
  font-weight: 500;
  text-align: left;
  padding: 8px 0px;
}

.tb-order tbody td {
  padding: 5px 0px;
  border-top: 1px solid #eee;
}

.tb-order thead th:first-child,
.tb-order tbody td:first-child {
  text-align: center;
}

.wrap-action {
  margin-top: 20px;
}

.btn-action {
  margin-left: 10px;
  margin-right: 10px;
}
</style>
