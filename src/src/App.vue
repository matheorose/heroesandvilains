<template>
  <v-app>
    <ErrorDialog
        title="ERROR"
        width="600"
    >
    </ErrorDialog>

    <v-app-bar app flat class="app-bar">
      <v-app-bar-nav-icon @click.stop="toggleDrawer" class="no-icon"></v-app-bar-nav-icon>

      <v-toolbar-title class="toolbar-title">Heroes & Vilains</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn text class="nav-button" @click="navigateTo('/login')">
        Login
      </v-btn>
      <v-btn text class="nav-button" @click="navigateTo('/register')">
        Register
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer app v-model="drawer" left class="drawer">
      <div class="drawer-header">Menu</div>
      <v-list dense>

        <v-list-item @click="navigateTo('/')">
          <v-list-item-content>
            <v-list-item-title class="nav-partie">Accueil</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-group no-action>
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title class="nav-partie">Organisation & Équipe</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item @click="navigateTo('/org')">
            <v-list-item-content>
              <v-list-item-title class="nav-partie">Organisation</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click="navigateTo('/team')">
            <v-list-item-content>
              <v-list-item-title class="nav-partie">Équipe</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

        <v-list-item @click="navigateTo('/login')">
          <v-list-item-content>
            <v-list-item-title class="nav-partie">Login</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="main-content">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import ErrorDialog from "@/components/ErrorDialog.vue";

export default {
  name: 'App',
  components: { ErrorDialog },
  data: () => ({
    drawer: false,
  }),
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
    navigateTo(route) {
      this.$router.push(route).catch(() => {});
      this.drawer = false;
    }
  }
}
</script>

<style scoped>
.v-application {
  background-color: #3a3a5a;
  color: white;
  font-family: 'Helvetica Neue', sans-serif;
}

.app-bar {
  background-color: #ffffff;
  border-bottom: 1px solid #3a3a5a;
}

.toolbar-title {
  font-weight: bold;
  font-size: 1.4rem;
}

.nav-button {
  font-weight: 500;
  color: white !important;
  text-transform: none;
}

.drawer {
  background-color: #3a3a5a;
  border-right: 1px solid #3a3a5a;
}

.drawer-header {
  font-weight: bold;
  padding: 16px;
  font-size: 1.1rem;
  border-bottom: 1px solid #3a3a5a;
  color: white;
}

.v-list-item-title {
  color: white;
  font-weight: normal;
}

.v-list-item:hover {
  background-color: #3a3a5a;
}

.main-content {
  padding: 24px;
}
.nav-partie{
  color: white;
}
</style>