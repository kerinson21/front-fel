<template>
    <v-layout align-start> <!--Alineado a la izquierda-->   
        <v-flex>
            <v-data-table
                    :headers="headers"
                    :items="articles"
                    :search="search"
                    sort-by="name"
                    class="elevation-1"
                    :footer-props="{
                      'items-per-page-all-text' : 'Todo',
                      'items-per-page-text':'Categorias por página',
                       pageText: '{0}-{1} de {2}'
                    }"
                    no-results-text="No se encontraron registros que coincidan"
                    >
                    <template v-slot:item.condition="{ item }">
                      <v-chip 
                      :color="getColor(item.condition)"
                      dark>
                        {{ getActive(item.condition) }}
                      </v-chip>
                    </template>
                    <template v-slot:top>
                    <v-toolbar flat>
                        <v-toolbar-title>Artículos</v-toolbar-title>
                        <v-divider
                        class="mx-4"
                        inset
                        vertical>
                      </v-divider>
                      <v-text-field
                        v-model="search"
                        append-icon="magnify"
                        label="Buscar Artículo"
                        single-line
                        hide-details
                      ></v-text-field>
                        <template v-slot:no-results>
                            <span>No se encontraron coincidencias</span>
                        </template>
                          <v-spacer></v-spacer>
                        <v-dialog
                        v-model="dialog"
                        max-width="500px">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                            color="primary"
                            dark
                            class="mb-2"
                            v-bind="attrs"
                            v-on="on">
                            Nuevo Artículo
                            </v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                            <span class="text-h5">{{ formTitle }}</span>
                            </v-card-title>

                            <v-card-text>
                            <v-container>
                                <v-row>
                                  <v-col
                                    cols="12"
                                    sm="12"
                                    md="12">
                                    <v-text-field
                                    v-model="code"
                                    label="Códido"
                                    ></v-text-field>
                                </v-col>
                                <v-col
                                    cols="12"
                                    sm="12"
                                    md="12">
                                    <v-text-field
                                    v-model="name"
                                    label="Nombre"
                                    ></v-text-field>
                                </v-col>
                                <v-col
                                    cols="12"
                                    sm="12"
                                    md="12">
                                    <v-text-field
                                    v-model="description"
                                    label="Descripción"
                                    required
                                    ></v-text-field>
                                </v-col>
                                <v-col
                                    cols="12"
                                    sm="12"
                                    md="12"
                                    v-show="valid">
                                    <div class="red--text" v-for="v in validMessage" :key="v" v-text="v"></div>
                                </v-col>
                                
                                </v-row>
                            </v-container>
                            </v-card-text>

                            <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                color="blue darken-1"
                                text
                                @click="close">
                                Cancelar
                            </v-btn>
                            <v-btn
                                color="blue darken-1"
                                text
                                @click="save">
                                Guardar
                            </v-btn>
                            </v-card-actions>
                        </v-card>
                        </v-dialog>
                        <v-dialog v-model="dialogAcitveOrDesactive" max-width="550px">
                        <v-card>
                            <v-card-title class="text-h5">{{ messageActiveOrDesactive }}</v-card-title>
                            <v-card-actions>
                            <v-spacer></v-spacer> 
                                <v-btn color="blue darken-1" text @click="closeActivateOrDesactivate">Cancel</v-btn>
                                <v-btn color="blue darken-1" text @click="activeOrDesactivate">OK</v-btn>
                            <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                        </v-dialog>
                    </v-toolbar>
                    </template>
                    <template v-slot:item.actions="{ item }">
                    <v-chip 
                        :color="'editicon'"
                        class="mr-2"
                        small
                        dark
                        @click="editItem(item)">
                        <v-icon>
                            edit
                        </v-icon>
                  </v-chip>
                    <!-- si se desea desactivar -->
                    <template v-if="item.condition">
                      <v-chip 
                      :color="'red'"
                      class="mr-2" 
                      dark
                      small
                      @click="showDeactivateActivate(2,item)">
                        <v-icon>
                        block
                      </v-icon>
                    </v-chip>
                    </template>
                    <!-- si se desea activar  -->
                    <template v-else>
                      <v-chip 
                      :color="'blue'" 
                      class="mr-2"
                      dark
                      small
                      @click="showDeactivateActivate(1,item)">
                      <v-icon>
                        check
                      </v-icon>
                      </v-chip>
                    </template>
                  
                    </template>
                    <template v-slot:no-data>
                    <v-btn
                        color="primary"
                        @click="initialize">
                        Reset
                    </v-btn>
                    </template>
            </v-data-table>
        </v-flex>
    </v-layout>
</template>
<script>
import axios from 'axios'
export default {
  data: () => ({
      dialog: false,
      search: '',
      dialogAcitveOrDesactive: false,
      messageActiveOrDesactive: '',
      actionActiveOrDesactive: 0,
      itemInformation: {},
      headers: [
        { text: 'Opciones', value: 'actions', sortable: false },
        { text: 'Nombre', value: 'name'},
        { text: 'Categoria', value: 'category_name',sortable: false  },
        { text: 'Precio Venta', value: 'sale_price',sortable: false  },
        { text: 'Descripción', value: 'description',sortable: false  },
        { text: 'Estado', value: 'condition',sortable: false }
      ],
      articles: [],
      editedIndex: -1,
      id: '',
      idcategory: '',
      code: '',
      name: '',
      sale_price: 0.00,
      stock: 0,
      description: '',
      valid: 0,
      validMessage: []
  }),
  computed: {
    formTitle () {
        return this.editedIndex === -1 ? 'Nuevo artículo' : 'Editando el artículo'
      },
  },
  watch: {
    dialog (val) {
        val || this.close()
    },
  },
  created () {
      this.initialize()
    },
  methods: {
    getActive(condition){
        if(condition == 1){
          return 'Activo';
        }else{
          return 'Inactivo';
        }
      },
      getColor(condition){
        if(condition == 1){
          return 'blue';
        }else{
          return 'red';
        }
      },  
      toList(){
        let me = this;
        axios.get('api/article/index').then((response)=>{
            me.articles = response.data;
        }).catch(function(error){
          console.log(error);
        });
      },
      initialize () {
        this.toList();
      },
      editItem (item) {
        this.id = item.id;
        this.name = item.name;
        this.description = item.description;
        this.editedIndex = 1;
        this.dialog = true;
      },
      close () {
        this.dialog = false;
        this.validMessage = [];
        this.valid = 0;
      },
      closeActivateOrDesactivate(){
        this.dialogAcitveOrDesactive = false;
        this.actionActiveOrDesactive = 0;
        this.itemInformation = {};
      },
      wipe(){
        this.id='';
        this.name = '';
        this.description = '';
        this.itemInformation = {};
        this.actionActiveOrDesactive = 0;
      },
      save () {
        if(this.validate()){
          return;
        }
        if (this.editedIndex > -1) {
          //codigo para editar
          let me = this;
          axios.put('api/category/update',{
            'id': me.id,
            'name': me.name,
            'description': me.description
          }).then((response)=>{
            me.close();
            me.toList();
            me.wipe();
          }).catch((error)=>{
            console.log(error);
          });

        } else {
          //codigo para guardar
          let me = this;
          axios.post('api/category/create',{
            'name': me.name,
            'description': me.description
          }).then((response)=>{
            me.close();
            me.toList();
            me.wipe();
          }).catch((error)=>{
            console.log(error);
          });
        }
      },
      validate(){
        this.valid = 0;
        this.validMessage = [];
        if(this.name.length < 3 || this.name.length > 50){
          this.validMessage.push("El nombre debe de tener más de 3 caracteres y menos de 50 caracteres");
        }
        if(this.validMessage.length){
          this.valid = 1;
        }
        return this.valid;
      },
      showDeactivateActivate(action, item){
        if(action == 1){
          this.dialogAcitveOrDesactive = true;
          this.messageActiveOrDesactive = `¿Quieres activar la categoria de ${item.name}?`;
          this.actionActiveOrDesactive = 1;
        }else{
          this.dialogAcitveOrDesactive = true;
          this.messageActiveOrDesactive = `¿Quieres desactivar la categoria de ${item.name}?`;
          this.actionActiveOrDesactive = 2;
        }
        this.itemInformation = item;
      },
      activeOrDesactivate(){
        let me = this;
        switch(me.actionActiveOrDesactive)
        {
          case 1:
            me.activate(this.itemInformation);
            break
          case 2:
            me.deactivate(this.itemInformation);
          break;
        }
        me.dialogAcitveOrDesactive = false;
        me.itemInformation = {};
      },
      activate(item){
        let me = this;
            axios.put('api/category/activate',{
              'id': item.id
            }).then((response)=>{
              me.toList();
              me.closeActivateOrDesactivate();
              me.wipe();
            }).catch((error)=>{
              console.log(error);
            });
      },
      deactivate(item){
        let me = this;
            axios.put('api/category/disabled',{
              'id': item.id
            }).then((response)=>{
              me.toList();
              me.closeActivateOrDesactivate();
              me.wipe();
            }).catch((error)=>{
              console.log(error);
            });
      },

},
};
</script>