<template>
  <v-row>
    <v-col cols="12">
      <template>
        <v-card>
          <v-card-title>
            Danh sách comment
            <v-spacer></v-spacer>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Tìm kiếm" single-line hide-details></v-text-field>
          </v-card-title>
          <v-data-table v-model="selected" :headers="headers" :search="search" :items="desserts" item-key="name" show-select class="elevation-1">
            <template v-slot:item.actions="{ item }">
              <v-btn icon color="success" @click="edit(item)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon color="#B00020">
                <v-icon>mdi-trash-can-outline</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </template>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      selected: [],
      search: '',
      headers: [
        {
          text: 'Tên',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Comment', value: 'comment' },
        { text: 'Ngày', value: 'date' },
        { text: 'Hành động', value: 'actions', sortable: false, width: 120 },
      ],
      desserts: [],
    };
  },
  methods: {
    initialize() {
      fetch('https://jsonplaceholder.typicode.com/comments').then(async response => {
        const data = await response.json();
        if (!response.ok) return;
        this.desserts = data.map(item => {
          return { name: item.email, comment: item.body, date: new Date().toLocaleDateString('vi-VN') };
        });
      });
    },
  },
  created() {
    this.initialize();
  },
};
</script>
<style scoped></style>
