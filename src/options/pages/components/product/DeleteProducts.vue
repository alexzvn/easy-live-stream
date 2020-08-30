<template>
  <v-dialog v-model="dialog" max-width="400">
    <v-card>
      <v-card-title class="headline">Bạn có chắc chắn muốn xóa sản phẩm này?</v-card-title>
      <v-card-text>
        <div>
          Tên sản phẩm: <b>{{ item.code }}</b>
        </div>
      </v-card-text>
      <v-card-text>
        <div>
          Tên sản phẩm: <b>{{ item.name }}</b>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="text-capitalize" color="light" @click="close()">Đóng</v-btn>
        <v-btn class="text-capitalize" type="submit" :loading="loading" :disabled="false" color="error" @click="deleteProduct()">
          <v-icon left>mdi-trash-can-outline</v-icon> Xóa
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import App from './../../../../plugins/app';

export default {
  data() {
    return {
      loading: false,
      app: new App(),
      dialog: false,
      item: {},
    };
  },
  methods: {
    close() {
      this.dialog = false;
    },
    open(item) {
      this.dialog = true;
      this.item = item;
    },
    deleteProduct() {
      this.app
        .fetch('api/me/products/' + this.item._id, {
          method: 'Delete',
        })
        .then(res => {
          this.emitDelete(res, this.item);
          this.loading = false;
        });
    },
    emitDelete(res, item) {
      this.$emit('delete-product', { res, item });
    },
  },
};
</script>
