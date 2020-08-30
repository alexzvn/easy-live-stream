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
          <v-data-table v-model="selected" :headers="headers" :search="search" :items="comments" item-key="_id" show-select class="elevation-1">
            <template v-slot:[`item.created_at`]="{ item }">
              <span> {{ new Date(item.created_at).toLocaleString() }}</span>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn icon color="success">
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
        { text: 'Comment', value: 'message' },
        { text: 'Ngày', value: 'created_at' },
        { text: 'Hành động', value: 'actions', sortable: false, width: 120 },
      ],
      comments: [],
      products: [],
    };
  },
  methods: {
    initialize() {
      // eslint-disable-next-line no-undef
      app.Echo.channel(user._id).listen('CommentCreated', data => this.addComment(data.comment));

      app
        .fetch('api/me/comments')
        .then(res => res.json())
        .then(body => {
          this.comments = body.data;
        });

      app
        .fetch('api/me/products?item=1000')
        .then(res => res.json())
        .then(body => {
          this.products = body.data;
        });
    },
    addComment(comment) {
      this.comments.push(comment);
    },
  },
  created() {
    this.initialize();
  },
};
</script>
<style scoped></style>
