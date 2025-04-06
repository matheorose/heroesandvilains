<template>
  <v-container class="team-view" fluid>
    <div v-if="!currentTeam">
      <v-alert type="warning" class="mt-10" border="left" colored-border>
        <h2 class="text-h6">Aucune équipe sélectionnée.</h2>
      </v-alert>
    </div>

    <div v-else>
      <div class="header mb-6">
        <h1>{{ currentTeam.name }}</h1>
        <p class="subtitle">Gérez les membres et leurs pouvoirs</p>
      </div>

      <!-- Bloc pour ajouter un héros existant -->
      <v-card class="mb-6">
        <v-card-title class="d-flex justify-space-between align-center">
          <span class="text-h6">Ajouter un héros existant</span>
          <v-btn color="primary" small @click="switchToggle">
            {{ toggleSelect ? 'Fermer' : 'Ajouter' }}
          </v-btn>
        </v-card-title>
        <v-expand-transition>
          <div v-show="toggleSelect" class="px-4 pb-4">
            <v-select
              v-model="selectedItem"
              :items="filteredHeroes"
              label="Sélectionnez un héros"
              item-text="publicName"
              item-value="_id"
              outlined
              dense
              class="mb-3"
            ></v-select>
            <div class="d-flex justify-end gap-3">
              <v-btn text color="error" @click="cancelAdd">Annuler</v-btn>
              <v-btn color="primary" @click="addHeroestoTeam" :disabled="!selectedItem">
                Ajouter
              </v-btn>
            </div>
          </div>
        </v-expand-transition>
      </v-card>

      <!-- Tableau des membres de l'équipe -->
      <v-card>
        <v-card-title class="text-h6">Membres de l’équipe</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <tableau-comp
            :enable-action="true"
            :enable-add="true"
            :is-row-clickable="() => false"
            :columns="['_id','publicName']"
            :items="team"
            :fields="fields"
            :action-function="actionFunction"
            :add-new-item-function="createHeroesandAddToTeam"
            :loading="loading"
          />
        </v-card-text>
      </v-card>

      <!-- Menu d’édition -->
      <edition-comp
        v-if="editMenuShow"
        :fields="fields"
        :item="itemEditSelected"
        @cancel-edit-item="closeMenu"
        @edit-item="editItem"
      />
    </div>
  </v-container>
</template>

<script>
import TableauComp from "@/components/tableauComp.vue";
import EditionComp from "@/components/EditionComp.vue";
import { mapState } from "vuex";

export default {
  name: "TeamById",
  components: { EditionComp, TableauComp },
  data() {
    return {
      toggleSelect: false,
      selectedItem: null,
      itemEditSelected: null,
      editMenuShow: false,
      loading: false,
      fields: [
        { name: "publicName", label: "Public Name", required: true },
        { name: "realName", label: "Real Name", required: true },
        {
          name: "powers",
          label: "Powers",
          required: false,
          type: "line",
          subFields: [
            { name: "name", label: "Name", required: true },
            { name: "type", type: "number", min: 1, max: 7, label: "Type", required: true },
            { name: "level", type: "number", min: 0, max: 100, label: "Level", required: true }
          ]
        }
      ],
      actionFunction: [
        { text: "Supprimer", func: this.removeItem, secureAsk: true },
        { text: "Modifier", func: this.editMenu, secureAsk: false }
      ]
    };
  },
  computed: {
    ...mapState("heroesModule", ["aliasHeroes"]),
    ...mapState("teamsModule", ["currentTeam"]),
    filteredHeroes() {
      return this.aliasHeroes.filter(hero =>
        !this.currentTeam.members.includes(hero._id)
      );
    },
    team() {
      return this.aliasHeroes.filter(hero =>
        this.currentTeam.members.includes(hero._id)
      );
    }
  },
  async mounted() {
    await this.$store.dispatch("heroesModule/getAliasHeroes");
  },
  methods: {
    cancelAdd() {
      this.toggleSelect = false;
      this.selectedItem = null;
    },
    async switchToggle() {
      this.toggleSelect = !this.toggleSelect;
      if (this.aliasHeroes.length === 0) {
        await this.$store.dispatch("heroesModule/getAliasHeroes");
      }
    },
    async removeItem(item) {
      await this.$store.dispatch("teamsModule/removeHeroes", item._id);
    },
    async addHeroestoTeam() {
      this.loading = true;
      await this.$store.dispatch("teamsModule/addHeroes", this.selectedItem);
      this.loading = false;
      this.selectedItem = null;
    },
    async createHeroesandAddToTeam(item) {
      this.loading = true;
      await this.$store.dispatch("heroesModule/createHero", item);
      await this.$store.dispatch(
        "teamsModule/addHeroes",
        this.$store.state.heroesModule.currentHero._id
      );
      this.loading = false;
    },
    async editMenu(item) {
      this.itemEditSelected = await this.$store.dispatch("heroesModule/getHeroById", item._id);
      if (this.itemEditSelected !== null) {
        this.editMenuShow = true;
      }
    },
    closeMenu() {
      this.editMenuShow = false;
      this.itemEditSelected = null;
    },
    async editItem(item) {
      this.loading = true;
      await this.$store.dispatch("heroesModule/updateHero", item);
      this.loading = false;
      this.itemEditSelected = null;
      this.editMenuShow = false;
    }
  }
};
</script>

<style scoped>
.team-view {
  padding-top: 60px;
  padding-bottom: 60px;
  background-color: #f5f6f8;
  min-height: 100vh;
}

.header {
  text-align: center;
}

.header h1 {
  font-size: 2.2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
}

.subtitle {
  font-size: 1rem;
  color: #666;
}

.gap-3 > * + * {
  margin-left: 12px;
}
</style>