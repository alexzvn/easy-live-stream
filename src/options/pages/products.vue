<template>
  <v-row>
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
              <th class="text-left">Tên</th>
              <th class="text-left">Giá</th>
              <th class="text-left">Ngày tạo</th>
              <th class="text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in desserts" :key="index++">
              <td>{{ index }}</td>
              <td>{{ item.name }}</td>
              <td>{{ formatCurrency(item.price) }}</td>
              <td>{{ item.create_at }}</td>
              <td>
                <v-btn icon color="success">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon color="#B00020">
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
    <diaglog-add-product ref="childDialogProduct" v-on:childStatusToParent="proccessWhenAddProductDone"></diaglog-add-product>
    <!-- Snackbar -->
    <v-col class="snackbar-info" cols="12">
      <v-snackbar v-model="snackbar.visible" :color="snackbar.color" timeout="2000" top="top">
        {{ snackbar.text }}
        <template v-slot:action="{ attrs }">
          <v-btn dark text v-bind="attrs" @click="snackbar.visible = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-col>
  </v-row>
</template>
<script>
import dialogProduct from './component/product_component/diaglog_product';

export default {
  components: {
    'diaglog-add-product': dialogProduct,
  },
  data: () => {
    return {
      page: 1,

      desserts: [
        {
          name: 'Áo phông A size S',
          price: 100000,
          create_at: '16/08/2020',
        },
        {
          name: 'Áo phông B size L',
          price: 150000,
          create_at: '17/08/2020',
        },
        {
          name: 'Áo khoác C size L',
          price: 500000,
          create_at: '18/08/2020',
        },
        {
          name: 'Áo khoác D size M',
          price: 600000,
          create_at: '19/08/2020',
        },
      ],
      snackbar: {
        color: 'success',
        visible: false,
        text: 'Thêm mới thành công',
      },
    };
  },
  methods: {
    formatCurrency(price) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    },
    openDialog() {
      this.$refs.childDialogProduct.openModalAddProduct();
    },
    proccessWhenAddProductDone(obj) {
      const status = obj.status;
      const itemProduct = obj.item;
      switch (status) {
        case 200:
        case 202:
          this.snackbar.text = 'Thêm thành công sản phẩm';
          this.snackbar.visible = true;
          this.snackbar.color = 'success';
          this.desserts = [...this.desserts, itemProduct];
          break;
        default:
          this.snackbar.text = 'Thêm thất bại';
          this.snackbar.visible = true;
          this.snackbar.color = 'rgb(176, 0, 32)';
          break;
      }
    },
  },
};
</script>

<style scoped>
.v-application .headline {
  font-size: 20px !important;
}
</style>
