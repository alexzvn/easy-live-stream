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
                  <v-text-field @focus="rule.nameRules = []" v-model="name" :rules="rule.nameRules" label="Tên sản phẩm" required> </v-text-field>
                  <v-text-field
                    @blur="isInputActivePriceAddnew = false"
                    @focus="isInputActivePriceAddnew = true"
                    v-model="displayValue"
                    :rules="rule.priceRules"
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
</template>
<script>
export default {
  data() {
    return {
      dialog: false,
      statusSubmitButton: {
        loading: false,
        icon: 'mdi-plus',
        text: 'Thêm mới',
      },
      valid: true,
      isInputActivePriceAddnew: false,
      name: '',
      price: 0,
      rule: {
        priceRules: [],
        nameRules: [],
      },
    };
  },
  methods: {
    formatCurrency(price) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    },
    closeDialog() {
      this.resetDialog();
      this.dialog = false;
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
    openModalAddProduct() {
      this.dialog = true;
    },
    submitHandler() {
      this.rule.priceRules = [v => v !== this.formatCurrency(0) || 'Giá phải lớn hơn 0'];
      this.rule.nameRules = [v => !!v || 'Vui lòng nhập vào tên sản phẩm'];
      const selfFrom = this;
      setTimeout(async () => {
        if (selfFrom.$refs.form.validate()) {
          var newItem = {
            name: this.name,
            price: this.price,
            create_at: this.getDateNow(),
          };

          this.statusSubmitButton.loading = true;
          const response = await fetch('https://jsonplaceholder.typicode.com/posts');
          const status = response.status;
          // await new Promise(r => setTimeout(r, 500));
          this.proccessStatusAddNew(status, newItem);
        }
      });
    },
    resetDialog() {
      this.price = 0;
      this.name = '';
      this.rule.priceRules = [];
      this.rule.nameRules = [];
    },
    proccessStatusAddNew(status, item) {
      this.statusSubmitButton.loading = false;
      this.resetDialog();
      this.dialog = false;
      this.$emit('childStatusToParent', { status, item });
    },
  },
  computed: {
    displayValue: {
      get: function() {
        return this.isInputActivePriceAddnew ? this.price.toString() : this.formatCurrency(this.price);
      },
      set: function(modifiedValue) {
        let newValue = parseFloat(modifiedValue.replace(/[^\d.]/g, ''));
        if (isNaN(newValue)) {
          newValue = 0;
        }
        this.price = newValue;
        this.rule.priceRules = [];
      },
    },
  },
};
</script>
