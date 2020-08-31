<template>
  <v-col class="modal-add-product" cols="12">
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="550">
        <v-form ref="form" @submit.prevent="submitHandler">
          <v-card>
            <v-card-title class="headline title-dialog-add-product">Thêm sản phẩm</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="form.code" :value="form.code.toUpperCase()" @input="form.code = form.code.toUpperCase()" label="Mã sản phẩm"> </v-text-field>
                  <v-text-field @focus="rule.name" v-model="form.name" :rules="rule.name" label="Tên sản phẩm" required> </v-text-field>
                  <v-text-field v-model="form.description" label="Mô tả" required> </v-text-field>
                  <v-text-field @blur="shouldFormatPrice = false" @focus="shouldFormatPrice = true" v-model="displayPrice" :rules="rule.price" label="Giá" required></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn class="text-capitalize" color="light" @click="close()">Đóng</v-btn>
              <v-btn class="text-capitalize" type="submit" :loading="loading" :disabled="false" color="primary"> <v-icon left>mdi-plus</v-icon> Thêm mới </v-btn>
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
      shouldFormatPrice: false,
      form: {
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
    open() {
      this.dialog = true;
    },
    submitHandler() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const product = { ...this.form };
      this.loading = true;

      app
        .fetch('api/me/products', {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify(product),
        })
        .then(res => {
          this.$emit('created', res, this.form);
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
  },
};
</script>
