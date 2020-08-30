<template>
  <v-col class="modal-add-product" cols="12">
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="550">
        <v-form ref="form" @submit.prevent="submitHandler">
          <v-card>
            <v-card-title class="headline title-dialog-add-product">{{ info(is_create).title }}</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-text-field @focus="rule.code" v-model="form.code" :rules="rule.code" label="Mã sản phẩm" required> </v-text-field>
                  <v-text-field @focus="rule.name" v-model="form.name" :rules="rule.name" label="Tên sản phẩm" required> </v-text-field>
                  <v-text-field
                    @blur="isInputActivePriceAddnew = false"
                    @focus="isInputActivePriceAddnew = true"
                    v-model="displayPrice"
                    :rules="rule.price"
                    label="Giá"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn class="text-capitalize" color="light" @click="close()">Đóng</v-btn>
              <v-btn class="text-capitalize" type="submit" :loading="loading" :disabled="false" color="primary">
                <v-icon left>{{ info(is_create).icon }}</v-icon> {{ info(is_create).button }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
    </v-row>
  </v-col>
</template>
<script>
import App from './../../../../plugins/app';

export default {
  data() {
    return {
      app: new App(),
      dialog: false,
      loading: false,
      valid: true,
      is_create: true,
      isInputActivePriceAddnew: false,
      form: {
        _id: 0,
        code: '',
        name: '',
        price: 0,
      },
      rule: {
        price: [v => v !== this.formatCurrency(0) || 'Giá phải lớn hơn 0'],
        name: [v => !!v || 'Vui lòng nhập vào tên sản phẩm'],
        code: [v => !!v || 'Vui lòng nhập mã sản phẩm'],
      },
    };
  },
  methods: {
    formatCurrency(price) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    },
    info(status) {
      const title = !status ? 'Cập nhật sản phẩm' : 'Thêm mới sản phẩm';
      const button = !status ? 'Cập nhật' : 'Thêm mới';
      const icon = !status ? 'mdi-plus' : 'mdi-plus';
      return { title, button, icon };
    },
    close() {
      this.dialog = false;
      this.reset();
    },
    reset() {
      this.$refs.form.resetValidation();
      this.form = {
        _id: 0,
        code: '',
        name: '',
        price: 0,
      };
    },
    open() {
      this.is_create = true;
      this.dialog = true;
    },
    openUpdate(item) {
      this.is_create = false;
      this.dialog = true;
      this.form = { ...item };
    },
    submitHandler() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const product = this.is_create ? { ...this.form, created_at: new Date().toLocaleString() } : this.form;
      this.loading = true;
      const url = this.is_create ? 'api/me/products' : 'api/me/products/' + this.form._id;
      this.app
        .fetch(url, {
          headers: {
            'Content-Type': 'application/json',
          },
          method: this.is_create ? 'POST' : 'PUT',
          body: JSON.stringify(product),
        })
        .then(async res => {
          this.loading = false;
          var item = await res.json();
          this.emitProduct(res, item.data);
        });
    },
    emitProduct(response, item) {
      if (this.is_create) {
        this.$emit('add-product', { response, item });
        return;
      }
      this.$emit('update-product', { response, item });
    },
  },
  computed: {
    displayPrice: {
      get: function() {
        return this.isInputActivePriceAddnew ? this.form.price.toString() : this.formatCurrency(this.form.price);
      },
      set: function(modifiedPrice) {
        this.form.price = modifiedPrice.replace(/[^\d.]/g, '') - 0 || 0;

        return this.form.price;
      },
    },
  },
};
</script>
