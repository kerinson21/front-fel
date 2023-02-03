<template>
  <div id="app">
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
      fixed
    >
      <v-list dense>
        <template>
          <v-list-item :to="{ name: 'home'}">
            <v-list-item-action>
              <v-icon>home</v-icon>
            </v-list-item-action>
            <v-list-item-title>
              Inicio
            </v-list-item-title>
          </v-list-item>          
        </template>
        <template>
          <!-- almacen -->
          <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title>
                  Almacen
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <!-- Categorias -->
            <v-list-item :to="{ name: 'category'}">
              <v-list-item-action>
                <v-icon>category</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Categorias
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <!-- productos -->
            <v-list-item :to="{ name: 'article'}">
              <v-list-item-action>
                <v-icon>shopping_cart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Productos
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
      
          
          
          <!-- Otro gurupo -->
          
        </template>
      </v-list>
    </v-navigation-drawer>
     <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      color="primary darkeen-3"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" class="white--text"></v-app-bar-nav-icon>
      <v-toolbar-title
        style="width: 300px"
        class="ml-0 pl-4"
      >
        <span class="hidden-sm-and-down white--text">My APP</span>
      </v-toolbar-title>
      
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>apps</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>notifications</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container fluid fill-height>
        <v-slide-y-transition mode="out-in">
          <router-view/>
        </v-slide-y-transition>
      </v-container>
    </v-main>
    
  </v-app>
</div>
</template>

<script>

export default {
  name: 'App',
  props: {
      source: String,
    },
  data: () => ({
      dialog: false,
      drawer: null,
      usuario: {}
  }),
  computed: {
    
  },
  methods: {
},
};
</script>