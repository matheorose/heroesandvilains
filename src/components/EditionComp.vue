<template>
  <v-container>
    <v-dialog v-model="dialogVisible" max-width="800">
      <v-card>
        <v-card-title class="headline">Ajouter un nouvel élément</v-card-title>
        <v-card-text>
          <v-form ref="form" v-if="fields.length > 0">
            <v-row v-for="field in fields" :key="field.name">
              <v-col :cols="6">
                <v-text-field v-if="!field.type || field.type !== 'list' && field.type !== 'line'"
                              v-model="editedItem[field.name]"
                              :label="field.label"
                              :rules="ruleRequired(field.required)"
                ></v-text-field>
                <v-select v-else-if="field.type === 'list'"
                          v-model="editedItem[field.name]"
                          :items="field.list"
                          :label="field.label"
                          :rules="ruleRequired(field.required)"
                ></v-select>

                <v-row wrap v-else-if="field.type === 'line'">
                  <v-btn @click="editedItem[field.name].push({})">Ajouter une ligne</v-btn>
                  <v-row wrap v-for="(line, index) in editedItem[field.name]" :key="index + field.name">
                    <v-col v-for="(subfield , index) in field.subFields" :key="subfield.name + index">
                      <v-text-field v-if="!subfield.type && subfield.type!=='number'"   v-model="line[subfield.name]"
                                    :label="subfield.label"
                                    :rules="ruleRequired(subfield.required)"
                      ></v-text-field>
                      <v-text-field v-else-if="subfield.type === 'number'"   v-model="line[subfield.name]"
                                    :label="subfield.label"
                                    type="number"
                                    :rules="ruleInputNumber(subfield.min,subfield.max)"
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-btn @click="editedItem[field.name].splice(index, 1)">Supprimer</v-btn>
                    </v-col>

                  </v-row>

                </v-row>





              </v-col>
            </v-row>
          </v-form>


        </v-card-text>
        <v-card-actions>
          <v-btn @click="closeAddItemDialog">Annuler</v-btn>
          <v-btn @click="confirmEditItem" color="primary">Valider</v-btn>
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
          <v-btn @click="valideEditItem" color="primary">Confirmer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>



  </v-container>
</template>

<script>
export default {
  name : "EditionComp",
  props: {
    item: {
      type: Object,
      required: true
    },
    fields: {
      type: Array,
      required: true
    },
  },
  data() {
    return {
      editedItem: {},
      confirmationDialogVisible: false,
      textDialog: "",
      dialogVisible: false
    };
  },
  watch: {
    item: {
      handler() {
        this.editedItem = JSON.parse(JSON.stringify(this.item));
        this.dialogVisible = true;
      },
      deep: true
    }
  },
  methods: {
    ruleRequired(required) {
      return required ? [(v) => !!v || 'Champ requis'] : [];
    },
    ruleInputNumber(min, max) {
      return [
        (v) => !!v || 'Champ requis',
        (v) => (v && v >= min) || `Minimum ${min}`,
        (v) => (v && v <= max) || `Maximum ${max}`
      ];
    },
    closeAddItemDialog() {
      this.$emit("cancel-edit-item");
    },
    confirmEditItem() {
      if(this.$refs.form.validate()){
        this.confirmationDialogVisible = true;
        this.textDialog = "Voulez-vous vraiment valider les modifications ?";
      }
    },
    cancelAddItem() {
      this.confirmationDialogVisible = false;
    },
    valideEditItem() {
      this.confirmationDialogVisible = false;
      this.$emit("edit-item", this.editedItem);
      this.editedItem = {};

    },

  },
  mounted() {
    this.editedItem = JSON.parse(JSON.stringify(this.item));
    this.dialogVisible = true;
  }
};
</script>
