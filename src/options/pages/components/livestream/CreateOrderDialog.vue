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
                  <v-text-field @focus="rule.name" v-model="form.name" :rules="rule.name" label="Tên người đặt" required> </v-text-field>
                  <v-text-field @focus="rule.phone" v-model="form.phone" :rules="rule.phone" label="Số điện thoại" required> </v-text-field>
                  <v-text-field @focus="rule.address" v-model="form.address" label="Địa chỉ giao hàng" required> </v-text-field>
                  <v-autocomplete
                    placeholder="Chọn sản phẩm"
                    v-model="form.products"
                    :rules="rule.products"
                    @focus="rule.products"
                    :items="products"
                    item-text="name"
                    return-object
                    multiple
                    dense
                    deletable-chips
                  ></v-autocomplete>
                  <v-textarea v-model="form.note" :rows="1" label="Ghi chú"></v-textarea>
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
      form: {
        name: '',
        phone: '',
        address: '',
        note: '',
        products: [],
      },
      rule: {
        name: [v => !!v || 'Hãy điền tên người đặt hàng.'],
        phone: [v => !!v || 'Vui lòng nhập SĐT người đặt.'],
        products: [v => v.length > 0 || 'Xin hãy chọn ít nhất một sản phẩm'],
      },
      products: [],
      comment: null,
    };
  },
  methods: {
    close() {
      this.dialog = false;
      this.$refs.form.reset();
    },
    reset() {
      this.$refs.form.reset();
      this.form.products = [];
    },
    open(comment = {}) {
      this.comment = comment;
      this.dialog = true;

      const phoneRegex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
      const phone = phoneRegex.exec(comment.message);

      this.form = {
        ...this.form,
        name: comment.name || '',
        phone: phone !== null ? phone[0] : '',
        note: comment.message ?? '',
      };

      if (this.$refs.form !== undefined) {
        this.$refs.form.resetValidation();
      }
    },
    submitHandler() {
      if (!this.$refs.form.validate()) {
        return;
      }

      const order = { ...this.form };

      this.loading = true;

      app
        .fetch('api/me/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.form),
        })
        .then(response => {
          this.$emit('created', response, order, this.comment);
          this.loading = false;
        });
    },
  },
  created() {
    // eslint-disable-next-line prettier/prettier
    app
      .fetch('api/me/products?item=1000')
      .then(res => res.json())
      .then(body => {
        this.products = body.data;
      });
  },
};
</script>
