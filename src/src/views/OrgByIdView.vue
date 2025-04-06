<template>
  <v-container class="org-detail-view" fluid>
    <v-row justify="center">
      <v-col cols="12" md="10">
        <div class="header">
          <h1>Organisation</h1>
        </div>

        <v-card class="action-card mb-6">
          <v-card-title class="d-flex justify-space-between align-center">
            <span class="text-h6">Ajouter une équipe</span>
            <v-btn color="primary" @click="switchToggle" small>
              {{ toggleSelect ? 'Fermer' : 'Ajouter' }}
            </v-btn>
          </v-card-title>

          <v-expand-transition>
            <div v-show="toggleSelect" class="px-4 pb-4">
              <v-select
                v-model="selectedItem"
                :items="filteredTeams"
                label="Sélectionnez une équipe"
                item-text="name"
                item-value="_id"
                outlined
                dense
                class="mb-3"
              ></v-select>

              <div class="d-flex justify-end gap-3">
                <v-btn text color="error" @click="cancelAdd">Annuler</v-btn>
                <v-btn color="primary" @click="addTeam" :disabled="!selectedItem">Ajouter</v-btn>
              </div>
            </div>
          </v-expand-transition>
        </v-card>

        <v-card>
          <v-card-title class="text-h6">Équipes associées</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <tableau-comp
              :enable-action="true"
              :enable-add="false"
              :is-row-clickable="() => {}"
              :columns="fields"
              :items="items"
              :action-function="actionFunction"
              :add-new-item-function="() => {}"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineComponent } from "vue";
import TableauComp from "@/components/tableauComp.vue";

export default defineComponent({
  components: { TableauComp },
  props: ["id"],
  data() {
    return {
      pathCancel: "/org",
      toggleSelect: false,
      selectedItem: null,
      teams: [],
      items: [],
      fields: [],
      actionFunction: [
        { text: "Voir", func: this.selectItem, secureAsk: false },
        { text: "Retirer", func: this.removeItem, secureAsk: true }
      ]
    };
  },
  computed: {
    filteredTeams() {
      return this.teams.filter((team) => {
        return !this.items.some((item) => item._id === team._id);
      });
    }
  },
  methods: {
    async selectItem(item) {
      await this.$store.dispatch("teamsModule/setCurrentTeam", item);
      this.$router.push({ path: "/team/" + item._id });
    },
    async removeItem(item) {
      await this.$store.dispatch("organisationModule/removeTeamOrg", item._id);
      this.items = this.$store.state.organisationModule.currentOrg.teams;
    },
    async switchToggle() {
      this.toggleSelect = !this.toggleSelect;
      if (this.teams.length === 0) {
        this.teams = await this.$store.dispatch("teamsModule/getTeams");
      }
    },
    async addTeam() {
      await this.$store.dispatch("organisationModule/addTeamOrg", this.selectedItem);
      let request = await this.$store.dispatch("organisationModule/getOrgById", this.id);
      if (request === true) {
        this.items = this.$store.state.organisationModule.currentOrg.teams;
      }
      this.selectedItem = null;
    },
    cancelAdd() {
      this.toggleSelect = false;
      this.selectedItem = null;
    }
  },
  async mounted() {
    if (this.$store.state.organisationModule.secretPhrase === null) return;

    const request = await this.$store.dispatch("organisationModule/getOrgById", this.id);
    if (request === true) {
      this.items = this.$store.state.organisationModule.currentOrg.teams;
    }
  },
  created() {
    this.fields = ["name"];
  }
});
</script>

<style scoped>
.org-detail-view {
  padding-top: 60px;
  padding-bottom: 60px;
  background-color: #f4f5f7;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  font-size: 2.2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 1rem;
  color: #666;
}

.action-card {
  margin-bottom: 24px;
  border-radius: 16px;
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.gap-3 > * + * {
  margin-left: 12px;
}
</style>