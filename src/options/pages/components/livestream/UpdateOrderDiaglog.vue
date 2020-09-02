<template>
  <v-row justify="center">
    <v-dialog class="grey lighten-5" v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-form ref="form" @submit.prevent="submitHandler">
        <v-card class="content-dialog">
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Cập nhật đơn hàng</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn :loading="loading" dark text type="submit">Cập nhật</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-container>
            <v-row class="wrap-diaglog-update">
              <v-col cols="12" md="4">
                <div class="col-order">
                  <h2 class="mb-5">Thông tin đơn hàng</h2>
                  <div>
                    <v-text-field @focus="rule.name" v-model="form.name" :rules="rule.name" label="Tên người đặt" required> </v-text-field>
                    <v-text-field @focus="rule.phone" v-model="form.phone" :rules="rule.phone" label="Số điện thoại" required> </v-text-field>
                    <v-text-field @focus="rule.address" v-model="form.address" :rules="rule.address" label="Địa chỉ" required> </v-text-field>
                    <v-select v-model="form.status" :items="status" label="Trạng thái" @change="statusChange"></v-select>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="5">
                <div class="col-order">
                  <h2 class="mb-5">Sản phẩm đã mua</h2>
                  <v-row>
                    <v-col cols="12" sm="4">
                      Tên sản phẩm
                    </v-col>
                    <v-col cols="12" sm="3">
                      Số lượng
                    </v-col>
                    <v-col cols="12" sm="3">
                      Giá
                    </v-col>
                    <v-col cols="12" sm="2">
                      Hành động
                    </v-col>
                  </v-row>
                  <v-row v-for="(item, index) in this.form.products" :key="item._id">
                    <v-col cols="12" sm="4">
                      <!-- <v-select
                        v-model="item.name"
                        :items="
                          products.map(function(item) {
                            return item.name;
                          })
                        "
                        :rules="[v => !!v || 'Item is required']"
                        required
                      ></v-select> -->
                      <v-text-field class="b-field" v-model="item.name" readonly solo> </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="2">
                      <v-text-field v-model="item.quantity" :rules="rule.quantity" placeholder="Số lượng" required type="number"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-text-field class="b-field" v-bind:value="formatPrice(item.quantity * item.price)" readonly solo> </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="2">
                      <div class="mt-4">
                        <v-btn class="mx-2" fab dark x-small color="primary" @click="remove(index)">
                          <v-icon fab dark>mdi-minus</v-icon>
                        </v-btn>
                      </div>
                    </v-col>
                  </v-row>
                  <v-divider></v-divider>
                  <p class="mt-2 mes-select-product"><i>chọn sản phẩm để thêm vào danh sách</i></p>
                  <v-select v-model="add_product" @change="selectProduct" :items="listProduct()" label="Sản phẩm"></v-select>
                </div>
              </v-col>
              <v-col cols="12" md="3">
                <div class="col-order">
                  <h2 class="mb-5">Thông tin chi phí</h2>
                  <div>
                    <v-text-field
                      @blur="shouldFormatPrice = false"
                      @focus="shouldFormatPrice = true"
                      v-model="displayPrice"
                      :rules="rule.price"
                      label="Giá"
                      required
                    ></v-text-field>
                    <v-text-field v-model="form.discount" label="Discount" required> </v-text-field>
                    <v-text-field @focus="rule.ship_fee" v-model="form.ship_fee" :rules="rule.ship_fee" label="Phí ship" required> </v-text-field>
                    <v-text-field
                      @blur="shouldFormatTotalPrice = false"
                      @focus="shouldFormatTotalPrice = true"
                      v-model="displayTotalPrice"
                      :rules="rule.total_price"
                      label="Tổng"
                      required
                    ></v-text-field>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-form>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  data() {
    return {
      dialog: false,
      notifications: false,
      sound: true,
      loading: false,
      widgets: false,
      form: {},
      add_product: 0,
      shouldFormatTotalPrice: false,
      shouldFormatPrice: false,
      status: [
        { value: 1, text: 'Đang chờ' },
        { value: 2, text: 'Đang xử lý' },
        { value: 3, text: 'Đang giao hàng' },
        { value: 4, text: 'Đã giao hàng' },
        { value: 5, text: 'Khách hàng hủy' },
      ],
      rule: {
        name: [v => !!v || 'Hãy điền tên người đặt hàng.'],
        phone: [v => !!v || 'Vui lòng nhập SĐT người đặt.'],
        address: [v => !!v || 'Trường địa chỉ giao hàng không được bỏ trống.'],
        products: [v => v.length > 0 || 'Xin hãy chọn ít nhất một sản phẩm'],
        quantity: [v => (v > 0 && v !== '') || 'vui lòng nhập vào số lượng'],
        ship_fee: [v => v >= 0 || 'Phí ship không nhỏ hơn 0'],
      },
      products: [],
    };
  },
  methods: {
    open(order) {
      this.form = { ...order };
      this.form.products = this.form.products.map(x => {
        return { ...x, quantity: 1 };
      });
      this.dialog = true;
    },
    close() {
      this.dialog = false;
    },
    remove(index) {
      this.form.products.splice(index, 1);
    },
    statusChange(status) {
      this.form.status = status;
    },
    selectProduct(item) {
      this.form.products.push({ ...this.products.filter(m => m.name === item).pop(), quantity: 1 });
      this.$nextTick(() => {
        this.add_product = null;
      });
    },
    totalPrice(quantity, price) {
      return quantity * price;
    },
    formatPrice(price) {
      return Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    },
    listProduct() {
      return this.products.filter(m => !this.form.products.map(x => x.name).includes(m.name)).map(x => x.name);
    },
    submitHandler() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const order = { ...this.form };
      this.loading = true;
      app
        .fetch('api/me/orders/' + order._id, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(order),
        })
        .then(response => {
          this.$emit('updated', response, order);
          this.loading = false;
        });
    },
  },
  computed: {
    displayPrice: {
      get: function() {
        return this.shouldFormatPrice ? this.form.price + '' : app.formatCurrency(this.form.price);
      },
      set: function(modifiedPrice) {
        this.form.price = modifiedPrice.replace(/[^\d.]/g, '') - 0 || 0;
      },
    },
    displayTotalPrice: {
      get: function() {
        return this.shouldFormatTotalPrice ? this.form.total_price + '' : app.formatCurrency(this.form.total_price);
      },
      set: function(modifiedPrice) {
        this.form.total_price = modifiedPrice.replace(/[^\d.]/g, '') - 0 || 0;
      },
    },
  },
  created() {
    app
      .fetch('api/me/products?item=1000')
      .then(res => res.json())
      .then(body => {
        this.products = body.data;
      });
  },
};
</script>

<style scoped>
.v-text-field {
  font-weight: 500;
}

.content-dialog {
  min-height: calc(100vh - 64px);
  background: #f5f5f5 !important;
}

.col-order {
  padding: 15px;
  border: 1px solid #eeeeee;
  background: #fff;
  box-shadow: -1px 3px 7px -6px;
  min-height: 600px;
}
.mes-select-product {
  color: #1976d2;
}
</style>
