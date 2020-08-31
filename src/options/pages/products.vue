<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h1>
          Thêm mới sản phẩm
          <v-btn class="mx-2" fab small dark color="success" @click="showCreateDialog">
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
                <th class="text-left">Mô tả</th>
                <th class="text-left">Giá</th>
                <th class="text-left">Ngày tạo</th>
                <th class="text-left">Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(product, index) in productsMapped" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ product.code }}</td>
                <td>{{ product.name }}</td>
                <td>{{ product.description }}</td>
                <td>{{ product.price }}</td>
                <td>{{ product.created_at }}</td>
                <td>
                  <v-btn icon color="success" @click="openUpdate(product)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon color="#B00020" @click="openDelete(product)">
                    <v-icon>mdi-trash-can-outline</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <div class="text-center mt-4">
          <v-pagination
            v-model="pagination.current_page"
            :length="pagination.last_page"
            v-on:input="fetchProducts"
            v-on:next="nextPage"
            v-on:previous="previousPage"
            :total-visible="7"
          >
          </v-pagination>
        </div>
      </v-col>
      <!-- Modal add new product -->
      <add-product-dialog ref="addDialog" v-on:created="addProduct"></add-product-dialog>
      <!-- Modal update product -->
      <update-product-dialog ref="dialogUpdateProduct"></update-product-dialog>
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
  </div>
</template>
<script>
import AddProductDialog from './components/product/AddProductDialog';
import UpdateProductDialog from './components/product/UpdateProducDialog';

export default {
  components: {
    AddProductDialog,
    UpdateProductDialog,
  },
  data: () => {
    return {
      products: [],
      pagination: {
        current_page: 0,
        from: 0,
        last_page: 0,
        per_page: 20,
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
    productsMapped() {
      const formatPrice = price => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

      return this.products.map(product => {
        return {
          ...product,
          price: formatPrice(product.price),
          created_at: new Date(product.created_at).toLocaleString(),
        };
      });
    },
  },
  methods: {
    nextPage() {
      this.fetchProducts(this.pagination.current_page);
    },
    previousPage() {
      this.fetchProducts(this.pagination.current_page - 1);
    },
    showCreateDialog() {
      this.$refs.addDialog.open();
    },
    async addProduct(response) {
      if (!response.ok) {
        return this.alert('Có lỗi trong quá trình thực hiện', 'danger');
      }

      this.products.unshift((await response.json()).data);
      this.alert('Đã thêm mới sản phẩm');
      this.$refs.addDialog.close();
    },
    alert(text = '', color = 'success') {
      this.snackbar = {
        color: color,
        text: text,
        visible: true,
      };
    },
    fetchProducts(page = 1) {
      app
        .fetch(`api/me/products?item=${this.pagination.per_page}&page=${page}`)
        .then(res => res.json())
        .then(body => {
          this.products = body.data;
          this.pagination = body.meta;
        });
    },
  },
  created() {
    this.fetchProducts();
  },
};
</script>

<style scoped>
.v-application .headline {
  font-size: 20px !important;
}
</style>
