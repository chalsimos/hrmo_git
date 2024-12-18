<template>
  <v-navigation-drawer
    :value="drawer"
    app
    temporary
    @input="updateDrawer"
  >
    <v-list>
      <v-list-item-group>
        <!-- Home Link -->
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              <router-link to="/" class="text-decoration-none">
                Home
              </router-link>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- Profile Link -->
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              <router-link to="/profile" class="text-decoration-none">
                Profile
              </router-link>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- Locator Link -->
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-map</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              <router-link :to="`/locator/${employeeId}`" class="text-decoration-none">
                Locators
              </router-link>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- Logout -->
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              <v-btn color="error" small @click="$emit('logout')">
                Logout
              </v-btn>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "NavigationDrawer",
  props: {
    drawer: {
      type: Boolean,
      required: true,
    },
    employeeId: {
      type: String,
      required: true,
    },
  },
  emits: ["logout", "update:drawer"],
  methods: {
    updateDrawer(value) {
      this.$emit("update:drawer", value);
    },
  },
};
</script>
