<template>
  <v-row>
    <v-col cols="12">
      <h1>
        livestream
      </h1>
    </v-col>
    <v-col cols="12">
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th>STT</th>
              <th class="text-left">Tiêu đề</th>
              <th class="text-left">Nội dung</th>
              <th class="text-left">Ngày tạo</th>
            </tr>
          </thead>
          <tbody v-show="!loading">
            <tr v-for="(stream, index) in livestream" :key="stream.id">
              <td>{{ index + 1 }}</td>
              <td>{{ stream.title }}</td>
              <td>{{ stream.description }}</td>
              <td>{{ new Date(stream.created_at).toLocaleString() }}</td>
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
        <v-pagination v-on:input="viewPage" v-on:next="nextPage" v-on:previous="nextPage" v-model="pagination.current_page" :length="pagination.last_page" :total-visible="7">
        </v-pagination>
      </div>

      <!-- Snackbar -->
      <v-col class="snackbar-info" cols="12">
        <v-snackbar v-model="snackbar.visible" :color="snackbar.color" timeout="2000" top="top">
          {{ snackbar.text }}
          <template v-slot:action="{ attrs }">
            <v-btn dark text v-bind="attrs" @click="snackbar.visible = false">
              Đóng
            </v-btn>
          </template>
        </v-snackbar>
      </v-col>
    </v-col>
  </v-row>
</template>
<script>
export default {
  data: () => {
    return {
      loading: true,
      livestream: [],
      pagination: {
        current_page: 0,
        from: 0,
        last_page: 0,
        per_page: 5,
        to: 0,
      },
      snackbar: {
        color: '',
        visible: false,
        text: '',
      },
    };
  },
  methods: {
    nextPage() {
      this.fetchLivestream(this.pagination.current_page);
    },

    viewPage(num) {
      this.fetchLivestream(num);
    },

    previousPage() {
      this.fetchLivestream(this.pagination.current_page - 1);
    },

    fetchLivestream(page = 1) {
      this.$app
        .fetch(`/api/me/streams?item=${this.pagination.per_page}&page=${page}`)
        .then(res => res.json())
        .then(body => {
          this.livestream = body.data;
          this.pagination = body.meta;

          this.loading = false;
        });
    },

    alert(text = '', color = 'success') {
      this.snackbar = {
        color: color,
        text: text,
        visible: true,
      };
    },
  },
  created() {
    this.fetchLivestream();
  },
};
</script>
