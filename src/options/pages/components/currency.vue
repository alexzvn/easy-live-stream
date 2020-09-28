<template>
  <v-text-field :value="maskCurrency" @input="updateValue" :rules="rules" :required="required" :label="label"></v-text-field>
</template>

<script>
export default {
  props: ['value', 'rules', 'required', 'label'],

  data: function() {
    return {};
  },

  computed: {
    maskCurrency() {
      return this.$app.formatCurrency(this.value);
    },
  },

  methods: {
    updateValue(input) {
      input = input === '' ? '0' : input;

      if (/^[0-9,]+$/g.test(input) === false) {
        return;
      }

      input = input.replace(/,/g, '') - 0;

      this.$emit('input', input);
    },
  },
};
</script>
