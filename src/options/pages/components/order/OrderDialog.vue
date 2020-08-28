<template>
  <v-col class="modal-add-product" cols="12">
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="550">
        <v-form ref="form" @submit.prevent="submitHandler">
          <v-card>
            <v-card-title class="headline title-dialog-add-product">{{ info(isUpdate).title }}</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-text-field @focus="rule.full_name" v-model="form.full_name" :rules="rule.full_name" label="Tên" required> </v-text-field>
                  <v-text-field @focus="rule.phone" v-model="form.phone" :rules="rule.phone" label="Số điện thoại" required> </v-text-field>
                  <v-text-field @focus="rule.address" v-model="form.address" :rules="rule.address" label="Địa chị" required> </v-text-field>
                  <v-text-field @blur="is_show_price = false" @focus="is_show_price = true" v-model="displayValue" :rules="rule.value" label="giá trị" required></v-text-field>
                  <v-switch v-model="form.cod" class="mx-2" label="COD"></v-switch>
                  <v-switch v-model="form.status" class="mx-2" label="Trạng thái"></v-switch>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn class="text-capitalize" color="light" @click="close()">Đóng</v-btn>
              <v-btn class="text-capitalize" type="submit" :loading="loading" :disabled="false" color="primary"> <v-icon left>mdi-plus</v-icon> {{ info(isUpdate).button }} </v-btn>
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
      isUpdate: true,
      is_show_price: false,
      form: {
        id: 0,
        full_name: '',
        phone: '',
        address: '',
        cod: false,
        value: 0,
        status: false,
      },
      rule: {
        full_name: [v => !!v || 'Vui lòng nhập vào họ tên'],
        phone: [v => !!v || 'Vui lòng nhập vào số điện thoại'],
        address: [v => !!v || 'Vui lòng nhập vào địa chỉ'],
        value: [v => v !== this.formatCurrency(0) || 'Giá phải lớn hơn 0'],
      },
    };
  },
  methods: {
    formatCurrency(price) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    },
    close() {
      this.dialog = false;
    },
    reset() {
      this.$refs.form.resetValidation();
      this.form = {
        id: 0,
        full_name: '',
        phone: '',
        address: '',
        cod: false,
        value: 0,
        status: false,
      };
    },
    openCreate() {
      this.isUpdate = false;
      this.dialog = true;
    },
    openUpdate(obj) {
      this.isUpdate = true;
      this.dialog = true;
      this.form = { ...obj };
    },
    submitHandler() {
      if (!this.$refs.form.validate()) return;
      this.loading = true;
      console.log('hehe');
      fetch('https://my.api.mockaroo.com/data.json?key=060bc380').then(response => {
        const item = this.form;
        this.$emit('order', { response, item });
        this.loading = false;
      });
    },
    info(status) {
      const title = status ? 'Cập nhật sản phẩm' : 'Thêm mới sản phẩm';
      const button = status ? 'Cập nhật' : 'Thêm mới';

      return { title, button };
    },
  },
  computed: {
    displayValue: {
      get: function() {
        return this.is_show_price ? this.form.value.toString() : this.formatCurrency(this.form.value);
      },
      set: function(modifiedPrice) {
        this.form.value = modifiedPrice.replace(/[^\d.]/g, '') - 0 || 0;
        return this.form.value;
      },
    },
  },
};
</script>
