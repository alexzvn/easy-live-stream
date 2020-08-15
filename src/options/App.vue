<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <v-list dense>
        <v-list-item link :to="{ path: '/home' }">
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link :to="{ path: '/livestream' }">
          <v-list-item-action>
            <v-icon>mdi-antenna</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Live Stream</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link :to="{ path: '/products' }">
          <v-list-item-action>
            <v-icon>mdi-package-variant-closed</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Sản phẩm</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link :to="{ path: '/orders' }">
          <v-list-item-action>
            <v-icon>mdi-file-document-multiple-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Đơn hàng</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="indigo" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Easy Live Stream</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <v-fade-transition mode="out-in">
          <router-view></router-view>
        </v-fade-transition>
      </v-container>
    </v-main>
    <v-footer color="indigo" app>
      <span class="white--text">&copy; {{ new Date().getFullYear() }} Easy Live Stream</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  props: {
    source: String,
  },
  data: () => ({
    drawer: null,
  }),
};
</script>
