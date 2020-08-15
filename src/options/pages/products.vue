<template>
  <v-row>
    <v-col cols="3" md>
      <h1 class>product</h1>
    </v-col>
    <v-col cols="3" md>
      <h1 class>1</h1>
    </v-col>
    <v-col cols="6" md>
      <h1>{{ countString }}</h1>
      <button class @click="increase()">Increase</button>
      <button class @click="decrease()">Decrease</button>
    </v-col>
  </v-row>
</template>
<script>
export default {
  data: () => {
    return {
      counter: 1,
    };
  },
  created: () => {},
  methods: {
    increase: function() {
      this.counter++;
    },
    decrease: function() {
      this.counter--;
    },
  },
  computed: {
    countString() {
      return this.counter + 'k';
    },
  },
  components: {},
  props: {},
};
</script>

<style lang="scss" scoped></style>
