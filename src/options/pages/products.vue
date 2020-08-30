<template>
  <div>
    <v-row v-if="user">
      <v-col cols="12">
        <h1>
          Thêm mới sản phẩm
          <v-btn class="mx-2" fab small dark color="success" @click="openDialog()">
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
                <th>Mã sản phẩm</th>
                <th class="text-left">Tên</th>
                <th class="text-left">Giá</th>
                <th class="text-left">Ngày tạo</th>
                <th class="text-left">Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in data" :key="index++">
                <td>{{ index }}</td>
                <td>{{ item.code }}</td>
                <td>{{ item.name }}</td>
                <td>{{ formatCurrency(item.price) }}</td>
                <td>{{ item.created_at }}</td>
                <td>
                  <v-btn icon color="success" @click="openUpdate(item)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon color="#B00020" @click="openDelete(item)">
                    <v-icon>mdi-trash-can-outline</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <div class="text-center mt-4">
          <v-pagination v-model="page" :length="3"></v-pagination>
        </div>
      </v-col>
      <!-- Modal add new product -->
      <add-product-dialog ref="dialogAddProduct" v-on:add-product="addProduct" v-on:update-product="updateProduct"></add-product-dialog>
      <!-- Modal delete new product -->
      <delete-product ref="dialogDeleteProduct" v-on:delete-product="deleteProduct"></delete-product>
      <!-- Snackbar -->
      <v-col class="snackbar-info" cols="12">
        <v-snackbar v-model="snackbar.visible" :color="snackbar.color" timeout="2000" top="top">
          {{ snackbar.text }}
          <template v-slot:action="{ attrs }">
            <v-btn dark text v-bind="attrs" @click="snackbar.visible = false">
              đóng
            </v-btn>
          </template>
        </v-snackbar>
      </v-col>
    </v-row>
    <v-row v-if="!user">
      <v-col cols="12">
        Bạn chưa đăng nhập
        <v-btn>
          Đăng nhập
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import AddProductDialog from './components/product/AddProductDialog';
import DeleteProduct from './components/product/DeleteProducts';

import App from './../../plugins/app';
export default {
  components: {
    AddProductDialog,
    DeleteProduct,
  },
  data: () => {
    return {
      app: new App(),
      user: null,
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
    openDialog() {
      this.$refs.dialogAddProduct.open();
    },
    openUpdate(item) {
      this.$refs.dialogAddProduct.openUpdate(item);
    },
    openDelete(item) {
      this.$refs.dialogDeleteProduct.open(item);
    },
    addProduct(data) {
      this.$refs.dialogAddProduct.reset();
      this.$refs.dialogAddProduct.close();

      if (!data.response.ok) {
        this.alert('Thêm thất bại', 'rgb(176, 0, 32)');
        return;
      }
      this.alert('Thêm thành công sản phẩm');
      this.data.unshift(data.item);
    },
    updateProduct(data) {
      this.$refs.dialogAddProduct.reset();
      this.$refs.dialogAddProduct.close();
      if (!data.response.ok) {
        this.alert('Cập nhật thất bại', 'rgb(176, 0, 32)');
        return;
      }
      const item = data.item;
      const index = this.data.findIndex(x => x.id === item.id);
      this.data[index].code = item.code;
      this.data[index].name = item.name;
      this.data[index].price = item.price;
    },
    deleteProduct(data) {
      if (data.res.ok) {
        this.alert('Xóa thành công sản phẩm');
        this.data = this.data.filter(m => m._id !== data.item._id);
        this.$refs.dialogDeleteProduct.close();
      } else {
        this.alert('Xóa thất bại', 'rgb(176, 0, 32)');
      }
    },
    alert(text = '', color = 'success') {
      this.snackbar = {
        color: color,
        text: text,
        visible: true,
      };
    },
    async initProducts() {
      this.app.fetch('api/me/products/').then(async res => {
        const listProducts = await res.json();
        if (!res.ok) return;
        this.data = listProducts.data;
      });
    },
    async init() {
      this.app.user().then(user => {
        this.user = user;
        if (user) {
          this.initProducts();
        }
      });
    },
  },
  created() {
    this.init();
  },
};
</script>

<style scoped>
.v-application .headline {
  font-size: 20px !important;
}
</style>
