<template>
  <v-row>
    <v-col cols="12">
      <h1>
        Thêm sản phẩm
        <v-btn class="mx-2" fab small dark color="success" @click="dialog = true">
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
    <v-col class="modal-add-product" cols="12">
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent>
          <v-form ref="form" @submit.prevent="submitHandler">
            <v-card>
              <v-card-title class="headline">Thêm sản phẩm {{ dialog }}</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <v-text-field @focus="nameRules = []" v-model="name" :rules="nameRules" label="Tên sản phẩm" required> </v-text-field>
                    <v-text-field
                      @blur="isInputActivePriceAddnew = false"
                      @focus="isInputActivePriceAddnew = true"
                      v-model="displayValue"
                      :rules="priceRules"
                      label="Giá"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="text-capitalize" color="light" @click="closeDialog()">Đóng</v-btn>
                <v-btn class="text-capitalize" type="submit" :loading="statusSubmitButton.loading" :disabled="false" color="primary">
                  <v-icon left>{{ statusSubmitButton.icon }}</v-icon> {{ statusSubmitButton.text }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>
      </v-row>
    </v-col>
    <!-- Snackbar -->
    <v-col class="snackbar-info" cols="12">
      <v-snackbar v-model="snackbar.visible" :color="snackbar.color" :timeout="snackbar.timeout" :top="snackbar.y" :vertical="snackbar.vertical">
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
export default {
  data: () => {
    return {
      dialog: false,
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
      valid: true,
      isInputActivePriceAddnew: false,
      name: '',
      nameRules: [],
      price: 0,
      priceRules: [],
      statusSubmitButton: {
        loading: false,
        icon: 'mdi-plus',
        text: 'Thêm mới',
      },
      snackbar: {
        color: 'success',
        visible: false,
        text: 'Thêm mới thành công',
        timeout: 2000,
        y: 'top',
      },
    };
  },
  methods: {
    formatCurrency(price) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    },
    openModalAddProduct() {
      this.dialog = true;
    },
    getDateNow() {
      function AddZero(num) {
        return num >= 0 && num < 10 ? '0' + num : num + '';
      }
      var now = new Date();
      return [
        [AddZero(now.getDate()), AddZero(now.getMonth() + 1), now.getFullYear()].join('/'),
        // [AddZero(now.getHours()), AddZero(now.getMinutes())].join(':'),
        // now.getHours() >= 12 ? 'PM' : 'AM',
      ].join(' ');
    },
    submitHandler() {
      this.priceRules = [v => v !== this.formatCurrency(0) || 'Giá phải lớn hơn 0'];
      this.nameRules = [v => !!v || 'Vui lòng nhập vào tên sản phẩm'];
      const selfFrom = this;
      setTimeout(async () => {
        if (selfFrom.$refs.form.validate()) {
          var newItem = {
            name: this.name,
            price: this.price,
            create_at: this.GetDateNow(),
          };

          this.statusSubmitButton.loading = true;
          const response = await fetch('https://jsonplaceholder.typicode.com/posts');
          const status = response.status;

          //gia lap
          await new Promise(r => setTimeout(r, 500));
          this.proccessStatusAddNew(status, newItem);
        }
      });
    },
    resetDialog() {
      this.price = 0;
      this.name = '';
      this.priceRules = [];
      this.nameRules = [];
    },
    closeDialog() {
      this.resetDialog();
      this.dialog = false;
    },
    proccessStatusAddNew(status, item) {
      switch (status) {
        case 200:
        case 202:
          this.statusSubmitButton.loading = false;
          this.snackbar.text = 'Thêm thành công sản phẩm';
          this.snackbar.visible = true;
          this.desserts = [...this.desserts, item];
          this.resetDialog();
          break;
      }
    },
  },
  computed: {
    displayValue: {
      get: function() {
          return this.isInputActivePriceAddnew ? return this.price.toString() :  this.formatCurrency(this.price);
      },
      set: function(modifiedValue) {
        let newValue = parseFloat(modifiedValue.replace(/[^\d.]/g, ''));
        if (isNaN(newValue)) {
          newValue = 0;
        }
        this.price = newValue;
        this.priceRules = [];
      },
    },
  },
};
</script>

<style scoped></style>
