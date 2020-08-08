<template>
    <v-row>
        <v-col>
            <v-form>
                <v-text-field
                    name="example1"
                    label="label"
                    value="value"
                    single-line
                    v-model="value"
                ></v-text-field>
            </v-form>
        </v-col>
        <v-col>
            {{ this.value }}
        </v-col>
    </v-row>
</template>

<script>
export default {
    data: () => {
        return {};
    },
    props: {
        value: '',
    }
    
}
</script>

<style scoped>

</style>