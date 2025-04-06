<template>
  <v-container>


    <v-dialog v-if="enableAdd" v-model="dialogVisible" max-width="800">
      <v-card>
        <v-card-title class="headline">Ajouter un nouvel élément</v-card-title>
        <v-card-text>
          <v-form ref="form" v-if="fields.length > 0">
            <v-row v-for="field in fields" :key="field.name">
              <v-col :cols="6">
                  <v-text-field v-if="!field.type || field.type !== 'list' && field.type !== 'line'"
                                v-model="newItem[field.name]"
                                :label="field.label"
                                :rules="ruleRequired(field.required)"
                  ></v-text-field>
                  <v-select v-else-if="field.type === 'list'"
                            v-model="newItem[field.name]"
                            :items="field.list"
                            :label="field.label"
                            :rules="ruleRequired(field.required)"
                  ></v-select>

                  <v-row wrap v-else-if="field.type === 'line'">
                    <v-btn @click="contentLine(field.name).push({})">Ajouter une ligne</v-btn>
                    <v-row wrap v-for="(line, index) in contentLine(field.name)" :key="index + field.name">
                      <v-col v-for="(subfield , index) in field.subFields" :key="subfield.name + index">
                      <v-text-field v-if="!subfield.type && subfield.type!=='number'"   v-model="line[subfield.name]"
                                    :label="subfield.label"
                                    :rules="ruleRequired(subfield.required)"
                      ></v-text-field>
                      <v-text-field v-else-if="subfield.type === 'number'"   v-model="line[subfield.name]"
                                    :label="subfield.label"
                                    :required="subfield.required"
                                    type="number"
                                    :rules="ruleInputNumber(subfield.min,subfield.max)"
                      ></v-text-field>
                      </v-col>
                      <v-col>
                        <v-btn @click="contentLine(field.name).splice(index, 1)">Supprimer</v-btn>
                      </v-col>

                    </v-row>

                  </v-row>





              </v-col>
            </v-row>
          </v-form>


        </v-card-text>
        <v-card-actions>
          <v-btn @click="closeAddItemDialog">Annuler</v-btn>
          <v-btn @click="confirmAddItem" color="primary">Valider</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <v-dialog v-model="confirmationDialogVisible" max-width="500">
      <v-card>
        <v-card-title class="headline">Confirmation</v-card-title>

        <v-card-text>
          {{textDialog}}
        </v-card-text>
        <v-card-actions>
          <v-btn @click="cancelAddItem">Annuler</v-btn>
          <v-btn @click="validateAddItem" color="primary">Confirmer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>













    <v-row>
      <v-col>
        <v-data-table
            :headers="tableHeaders"
            :items="filteredItems"
            :search="search"
            :loading="loading"
        >
          <template v-slot:top>
            <v-row>
              <v-col md="9">
                <v-text-field
                    v-model="search"
                    label="Rechercher"
                    append-icon="mdi-magnify"
                    single-line
                    hide-details
                ></v-text-field>
              </v-col>
              <v-col md="3" class="d-flex justify-center align-center">
                <v-btn v-if="enableAdd" plain color="primary" @click="openAddItemDialog">Ajouter</v-btn>

              </v-col>
            </v-row>
          </template>

          <template v-slot:body="{ items }">
            <tbody>
            <tr
                v-for="item in items"
                :key="item.id"
                @click="isRowClickable(item)"
                :style="'cursor: pointer;'"
            >
              <td v-for="column in columns" :key="column">{{ item[column] }}</td>
              <td v-if="enableAction" >
                <v-btn v-for="(func , index) in ActionFunction" :key="index" @click="func.secureAsk ? askSecure(func,item) : func.func(item)">
                  {{func.text}}
                </v-btn>
              </td>

            </tr>
            </tbody>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
    columns: {
      type: Array,
      required: true,
    },
    isRowClickable: {
      type: Function,
      default: () => {},
    },
    fields: {
      type: Array,
      default: () => [],
    },
    addNewItemFunction: {
      type: Function,
      required: false,

    },
    loading: {
      type: Boolean,
      default: false,
    },
    enableAdd: {
      type: Boolean,
      default: false,
    },
    enableAction:{
      type: Boolean,
      default: false,
    },
    ActionFunction:{
      type: Array,
      required: false,
    }

  },
  data() {
    return {
      search: "",
      dialogVisible: false,
      newItem: {},
      confirmationDialogVisible: false,
      textDialog: "Etes-vous sûr de vouloir?",
      actionFuncSelected: null,
      itemSelected: null,
      lineList: [],
    };
  },
  created() {
    this.fields.forEach((field) => {
      if (field.type === "line") {
        this.lineList.push({ field: field.name, content: [] });
      }
    });

  }
  ,
  computed: {
    tableHeaders() {
      return this.columns.map((column) => ({
        text: column,
        value: column,
      }));
    },
    filteredItems() {
      if (this.search.trim() === "") {
        return this.items;
      } else {
        const searchLower = this.search.toLowerCase();
        return this.items.filter((item) => {
          return this.columns.some((column) =>
              String(item[column]).toLowerCase().includes(searchLower)
          );
        });
      }
    },
  },
  methods: {
    contentLine(fieldName){
      return this.lineList.find((line) => line.field === fieldName).content ?? [];
    },
    openAddItemDialog() {
      this.newItem = {};
      this.dialogVisible = true;
    },
    closeAddItemDialog() {
      this.dialogVisible = false;
      this.newItem = {};
      this.lineList.forEach((line) => {
        line.content = [];
      });
    },
    cancelAddItem() {
      this.confirmationDialogVisible = false;
    },
    validateAddItem() {
      this.confirmationDialogVisible = false;
      this.dialogVisible = false;
      this.actionFuncSelected(this.itemSelected);
      this.itemSelected = null;
      this.actionFuncSelected = null;
      this.newItem = {};
      this.lineList.forEach((line) => {
        line.content = [];
      });



    },
    confirmAddItem() {
      if(this.$refs.form.validate()) {

        this.itemSelected = this.newItem;
        this.lineList.forEach((line) => {
          this.itemSelected[line.field] = line.content;
        });
        this.actionFuncSelected = this.addNewItemFunction;
        this.confirmationDialogVisible = true;
        this.textDialog = "Etes-vous sûr de vouloir ajouter cet élément ?";
      }
    },
    askSecure(func , item) {
      this.confirmationDialogVisible = true;
      this.textDialog = "Etes-vous sûr de vouloir "+func.text+" ?"
      this.actionFuncSelected = func.func;
      this.itemSelected = item;

    },
    ruleInputNumber(min , max) {
      return [
        (v) => !!v || "Champ obligatoire",
        (v) => (v && v >= min && v <= max) || "Valeur entre "+min+" et "+max
      ]
    },
    ruleRequired(required) {
      if(required) {
        return [ (v) => !!v || "Champ obligatoire"]
      }
      return []
    },
  },
};
</script>

<style scoped>
.clickable-row {
  cursor: pointer;
}

.clickable-row:hover {
  background-color: #f5f5f5; /* Couleur de survol */
}

/* Ajoutez des styles personnalisés si nécessaire */
</style>
