<template>
  <v-row>
    <v-col cols="12">
      <h1>
        Thêm mới sản phẩm
        <v-btn class="mx-2" fab small dark color="success">
          <v-icon dark>mdi-plus</v-icon>
        </v-btn>
      </h1>
    </v-col>
    <v-col cols="12">
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th class="text-left">Tên</th>
              <th class="text-left">SĐT</th>
              <th class="text-left">Địa chỉ</th>
              <th class="text-left">COD</th>
              <th class="text-left">Giá trị</th>
              <th class="text-left">Trạng thái</th>
              <th class="text-left">Hành động</th>
            </tr>
          </thead>
          <tbody v-show="!loading">
            <tr v-for="item in data" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.full_name }}</td>
              <td>{{ item.phone }}</td>
              <td>{{ item.address }}</td>
              <td>{{ item.cod }}</td>
              <td>{{ item.value }}</td>
              <td>{{ item.status }}</td>
              <td>
                <v-btn icon color="primary" title="Tạo mới đơn hàng">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
                <v-btn icon color="success" title="Chỉnh sửa đơn hàng">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <div class="text-center" v-show="loading">
        <v-progress-circular indeterminate color="#888"></v-progress-circular>
        <p class="text-loading">
          xin vui lòng đợi...
        </p>
      </div>
      <div class="text-center mt-4">
        <v-pagination v-model="page" :length="3"></v-pagination>
      </div>
    </v-col>
  </v-row>
</template>
<script>
export default {
  data: () => {
    return {
      loading: true,
      page: 1,
      data: [],
    };
  },
  methods: {
    initialize() {
      fetch('https://my.api.mockaroo.com/data.json?key=060bc380').then(async response => {
        const result = await response.json();
        if (!response.ok) return;
        this.loading = false;
        this.data = result;
      });
    },
  },
  created() {
    this.initialize();
  },
};
</script>

<style scoped>
.v-application .headline {
  font-size: 20px !important;
}
.v-progress-circular {
  margin: 1rem;
}
.text-loading {
  color: rgb(29, 28, 28);
}
</style>
