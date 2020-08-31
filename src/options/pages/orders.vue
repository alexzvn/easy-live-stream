<template>
  <v-row>
    <v-col cols="12">
      <h1>
        Thêm mới order
        <v-btn class="mx-2" fab small dark color="success" @click="openCreateDialog">
          <v-icon dark>mdi-plus</v-icon>
        </v-btn>
      </h1>
    </v-col>
    <v-col cols="12">
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th>STT</th>
              <th class="text-left">Tên</th>
              <th class="text-left">SĐT</th>
              <th class="text-left">Địa chỉ</th>
              <th class="text-left">Giá trị</th>
              <th class="text-left">Trạng thái</th>
              <th class="text-left">Hành động</th>
            </tr>
          </thead>
          <tbody v-show="!loading">
            <tr v-for="(order, index) in ordersMapped" :key="order.id">
              <td>{{ index + 1 }}</td>
              <td>{{ order.name }}</td>
              <td>{{ order.phone }}</td>
              <td>{{ order.address }}</td>
              <td>{{ order.total_price }}</td>
              <td>{{ order.status }}</td>
              <td>
                <v-btn icon color="success" title="Chỉnh sửa đơn hàng">
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
        <v-pagination v-on:input="viewPage" v-on:next="nextPage" v-on:previous="nextPage" v-model="pagination.current_page" :length="pagination.last_page" :total-visible="7">
        </v-pagination>
      </div>
      <!-- Modal add new product -->
      <create-order-dialog ref="createDialog" v-on:created="orderCreated"></create-order-dialog>
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
import CreateOrderDialog from './components/livestream/CreateOrderDialog';

export default {
  components: {
    CreateOrderDialog,
  },
  data: () => {
    return {
      loading: false,
      orders: [],
      pagination: {
        current_page: 0,
        from: 0,
        last_page: 0,
        per_page: 5,
        to: 0,
      },
      snackbar: {
        color: '',
        visible: false,
        text: '',
      },
    };
  },
  computed: {
    ordersMapped() {
      const orderStatus = {
        1: 'Đang chờ',
        2: 'Đang xử lý',
        3: 'Đang giao hàng',
        4: 'Đã giao hàng',
        5: 'Khách hàng hủy',
      };

      const formatPrice = price => Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

      return this.orders.map(order => {
        return {
          ...order,
          status: orderStatus[order.status],
          price: formatPrice(order.price),
          total_price: formatPrice(order.total_price),
        };
      });
    },
  },
  methods: {
    openCreateDialog() {
      this.$refs.createDialog.open();
    },
    async orderCreated(response, order) {
      if (!response.ok) {
        return this.alert('Có lỗi trong quá trình tạo đơn hàng', 'danger');
      }

      this.orders.unshift((await response.json()).data);
      this.alert('Đã thêm đơn hàng mới');
      this.$refs.createDialog.close();
    },
    nextPage() {
      this.fetchOrders(this.pagination.current_page);
    },
    viewPage(num) {
      this.fetchOrders(num);
    },
    previousPage() {
      this.fetchOrders(this.pagination.current_page - 1);
    },
    fetchOrders(page = 1) {
      app
        .fetch(`/api/me/orders?item=${this.pagination.per_page}&page=${page}`)
        .then(res => res.json())
        .then(body => {
          this.orders = body.data;
          this.pagination = body.meta;
        });
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
    this.fetchOrders();
  },
};
</script>
