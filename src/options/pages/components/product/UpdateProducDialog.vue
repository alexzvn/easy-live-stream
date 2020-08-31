<template>
  <v-col class="modal-add-product" cols="12">
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="550">
        <v-form ref="form">
          <v-card>
            <v-card-title class="headline title-dialog-add-product">Cập nhật sản phẩm</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="form.code" label="Mã sản phẩm" required> </v-text-field>
                  <v-text-field @focus="rule.name" v-model="form.name" :rules="rule.name" label="Tên sản phẩm" required> </v-text-field>
                  <v-text-field v-model="form.description" label="Mô tả" required> </v-text-field>
                  <v-text-field @blur="is_show_price = false" @focus="is_show_price = true" v-model="displayPrice" :rules="rule.price" label="Giá" required></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions fixed>
              <v-spacer></v-spacer>
              <v-btn class="text-capitalize" color="error" @click="deleteProduct()" outlined left absolute>Xóa Sản phẩm</v-btn>
              <v-btn class="text-capitalize" color="light" @click="close()">Đóng</v-btn>
              <v-btn class="text-capitalize" :loading="loading" @click="update" :disabled="false" color="primary"> <v-icon left>mdi-plus</v-icon> Cập nhật </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
    </v-row>
  </v-col>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      loading: false,
      valid: true,
      shouldShowPrice: false,
      form: {
        _id: 0,
        code: '',
        name: '',
        description: '',
        price: 0,
      },
      rule: {
        price: [v => v !== app.formatCurrency(0) || 'Giá phải lớn hơn 0'],
        name: [v => !!v || 'Vui lòng nhập vào tên sản phẩm'],
      },
    };
  },
  methods: {
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
    update() {
      if (!this.$refs.form.validate()) {
        return;
      }

      this.loading = true;

      app
        .fetch('api/me/products/' + this.form._id, {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PUT',
          body: JSON.stringify(this.form),
        })
        .then(res => {
          this.loading = false;
          this.$emit('updated', res, this.form);
        });
    },
    deleteProduct() {
      const product = { ...this.form };

      app.fetch('api/me/products/' + product._id, { method: 'DELETE' }).then(res => this.$emit('deleted', res, product));
    },
  },
  computed: {
    displayPrice: {
      get: function() {
        return this.shouldShowPrice ? this.form.price + '' : app.formatCurrency(this.form.price);
      },
      set: function(modifiedPrice) {
        this.form.price = modifiedPrice.replace(/[^\d.]/g, '') - 0 || 0;
      },
    },
  },
};
</script>
