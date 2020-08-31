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
          <v-data-table :headers="headers" :search="search" :items="comments" show-select class="elevation-1">
            <template v-slot:[`item.created_at`]="{ item }">
              <span> {{ new Date(item.created_at).toLocaleString() }}</span>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn @click="editComment(item._id)" small outlined depressed color="primary">
                Lên đơn
              </v-btn>
              <v-btn icon color="#B00020">
                <v-icon>mdi-trash-can-outline</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </template>

      <create-order-dialog ref="createDialog"></create-order-dialog>
    </v-col>
  </v-row>
</template>

<script>
import CreateOrderDialog from './components/livestream/CreateOrderDialog';

export default {
  components: {
    CreateOrderDialog,
  },
  data() {
    return {
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
        { text: 'Hành động', value: 'actions', sortable: false, width: 170 },
      ],
      comments: [],
    };
  },
  methods: {
    initialize() {
      // eslint-disable-next-line no-undef
      app.Echo.channel(user._id).listen('CommentCreated', data => this.addComment(data.comment));

      // eslint-disable-next-line prettier/prettier
      app
        .fetch('api/me/comments')
        .then(res => res.json())
        .then(body => {
          this.comments = body.data;
        });
    },
    addComment(comment) {
      this.comments.push(comment);
    },
    editComment(_id) {
      const index = this.findCommentIndex(_id);

      this.$refs.createDialog.open(this.comments[index]);
    },
    findCommentIndex(id) {
      return this.comments.map(x => x._id).indexOf(id);
    },
  },
  created() {
    this.initialize();
  },
};
</script>
<style scoped></style>
