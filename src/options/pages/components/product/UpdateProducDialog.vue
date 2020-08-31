<template>
  <v-col class="modal-add-product" cols="12">
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="550">
        <v-form ref="form" @submit.prevent="submitHandler">
          <v-card>
            <v-card-title class="headline title-dialog-add-product">Cập nhật sản phẩm</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-text-field @focus="rule.code" v-model="form.code" :rules="rule.code" label="Mã sản phẩm" required> </v-text-field>
                  <v-text-field @focus="rule.name" v-model="form.name" :rules="rule.name" label="Tên sản phẩm" required> </v-text-field>
                  <v-text-field @focus="rule.description" v-model="form.description" :rules="rule.description" label="Mô tả" required> </v-text-field>
                  <v-text-field @blur="is_show_price = false" @focus="is_show_price = true" v-model="displayPrice" :rules="rule.price" label="Giá" required></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn class="text-capitalize" color="light" @click="close()">Đóng</v-btn>
              <v-btn class="text-capitalize" type="submit" :loading="loading" :disabled="false" color="primary"> <v-icon left>mdi-plus</v-icon> Cập nhật </v-btn>
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
      is_show_price: false,
      form: {
        _id: 0,
        code: '',
        name: '',
        description: '',
        price: 0,
      },
      rule: {
        price: [v => v !== this.formatCurrency(0) || 'Giá phải lớn hơn 0'],
        name: [v => !!v || 'Vui lòng nhập vào tên sản phẩm'],
        description: [v => !!v || 'Vui lòng nhập vào mô tả'],
        code: [v => !!v || 'Vui lòng nhập mã sản phẩm'],
      },
    };
  },
  methods: {
    formatCurrency(price) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    },
    close() {
      this.dialog = false;
      this.reset();
    },
    reset() {
      this.$refs.form.resetValidation();
      this.form = {
        code: '',
        name: '',
        description: '',
        price: 0,
      };
    },
    open(product) {
      this.dialog = true;
      this.form = { ...product };
    },
    submitHandler() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.loading = true;
      this.app
        .fetch('api/me/products/' + this.form._id, {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PUT',
          body: JSON.stringify(this.form),
        })
        .then(async res => {
          this.loading = false;
          this.emitProduct(res, this.form);
        });
    },
    emitProduct(response, product) {
      this.$emit('update-product', { response, product });
    },
  },
  computed: {
    displayPrice: {
      get: function() {
        return this.is_show_price ? this.form.price.toString() : this.formatCurrency(this.form.price);
      },
      set: function(modifiedPrice) {
        this.form.price = modifiedPrice.replace(/[^\d.]/g, '') - 0 || 0;
        return this.form.price;
      },
    },
  },
};
</script>
