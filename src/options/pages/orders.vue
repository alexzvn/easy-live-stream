<template>
  <v-row>
    <v-col cols="12">
      <h1>
        Thêm mới order
        <v-btn class="mx-2" fab small dark color="success" @click="openCreate()">
          <v-icon dark>mdi-plus</v-icon>
        </v-btn>
      </h1>
    </v-col>
    <v-col cols="12">
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th class="text-left">Tên</th>
              <th class="text-left">SĐT</th>
              <th class="text-left">Địa chỉ</th>
              <th class="text-left">COD</th>
              <th class="text-left">Giá trị</th>
              <th class="text-left">Trạng thái</th>
              <th class="text-left">Hành động</th>
            </tr>
          </thead>
          <tbody v-show="!loading">
            <tr v-for="item in data" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.full_name }}</td>
              <td>{{ item.phone }}</td>
              <td>{{ item.address }}</td>
              <td>
                <v-chip :color="cod(item.cod).color" x-small>
                  {{ cod(item.cod).text }}
                </v-chip>
              </td>
              <td>{{ formatCurrency(item.value) }}</td>
              <td>
                {{ item.status }}
              </td>
              <td>
                <v-btn icon color="primary" title="Tạo mới đơn hàng">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
                <v-btn icon color="success" @click="openUpdate(item)" title="Chỉnh sửa đơn hàng">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <div class="text-center" v-show="loading">
        <v-progress-circular indeterminate color="#888"></v-progress-circular>
        <p class="text-loading">
          xin vui lòng đợi...
        </p>
      </div>
      <div class="text-center mt-4">
        <v-pagination v-model="page" :length="3"></v-pagination>
      </div>
      <!-- Modal add new product -->
      <order-dialog ref="orderDialog" v-on:order="handleOrder"></order-dialog>
      <!-- Snackbar -->
      <v-col class="snackbar-info" cols="12">
        <v-snackbar v-model="snackbar.visible" :color="snackbar.color" timeout="2000" top="top">
          {{ snackbar.text }}
          <template v-slot:action="{ attrs }">
            <v-btn dark text v-bind="attrs" @click="snackbar.visible = false">
              Đóng
            </v-btn>
          </template>
        </v-snackbar>
      </v-col>
    </v-col>
  </v-row>
</template>
<script>
import OrderDialog from './components/order/OrderDialog';
export default {
  components: {
    OrderDialog,
  },
  data: () => {
    return {
      loading: true,
      page: 1,
      data: [],
      snackbar: {
        color: '',
        visible: false,
        text: '',
      },
    };
  },
  methods: {
    formatCurrency(price) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    },
    initialize() {
      fetch('https://my.api.mockaroo.com/data.json?key=060bc380').then(async response => {
        const result = await response.json();
        if (!response.ok) return;
        this.loading = false;
        this.data = result;
      });
    },
    openCreate() {
      this.$refs.orderDialog.openCreate();
    },
    openUpdate(obj) {
      this.$refs.orderDialog.openUpdate(obj);
    },
    handleOrder(data) {
      this.$refs.orderDialog.reset();
      this.$refs.orderDialog.close();
      if (!data.response.ok) {
        this.alert('Thêm thất bại', 'rgb(176, 0, 32)');
      }
      var dataOrder = data.item;
      if (dataOrder.id === 0) {
        dataOrder.id = this.data[this.data.length - 1].id + 1;
        this.data.push(dataOrder);
        this.alert('Thêm thành công');
      } else {
        const index = this.data.findIndex(x => x.id === dataOrder.id);
        this.data[index].full_name = dataOrder.full_name;
        this.data[index].phone = dataOrder.phone;
        this.data[index].address = dataOrder.address;
        this.data[index].cod = dataOrder.cod;
        this.data[index].value = dataOrder.value;
        this.data[index].status = dataOrder.status;
        this.alert('Cập nhật thành công');
      }
    },
    cod: function(item) {
      const color = item ? 'success' : 'warning';
      const text = item ? 'COD' : 'Không';
      return { color, text };
    },
    alert(text = '', color = 'success') {
      this.snackbar = {
        color: color,
        text: text,
        visible: true,
      };
    },
  },

  created() {
    this.initialize();
  },
};
</script>
