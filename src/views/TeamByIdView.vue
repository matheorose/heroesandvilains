<template>
  <div>
    <div v-if="!currentTeam">
      <h1>Pas de team courante</h1>
    </div>
    <div v-else>
      <v-container>
        <v-row>
          <v-col>
            <v-btn @click="switchToggle">Ajouter</v-btn>
            <v-container v-if="toggleSelect">
              <v-select
                  v-model="selectedItem"
                  :items="filteredHeroes"
                  label="Sélectionnez un élément"
                  item-text="publicName"
                  item-value="_id"
                  solo
              ></v-select>

              <v-btn @click="cancelAdd">Annuler</v-btn>

              <v-btn @click="addHeroestoTeam" :disabled="!selectedItem">
                Ajouter
              </v-btn>

            </v-container>
          </v-col>
        </v-row>
      </v-container>


      <h1>{{ currentTeam.name }}</h1>
      <tableau-comp :enable-action="true"
                    :enable-add="true"
                    :is-row-clickable="()=>{return false}"
                    :columns="['_id','publicName']"
                    :items="team"
                    :fields="fields"
                    :action-function="actionFunction"
                    :addNewItemFunction="createHeroesandAddToTeam"
                    :loading="loading"


      >

      </tableau-comp>

      <edition-comp v-if="editMenuShow" :fields="fields" :item="itemEditSelected" @cancel-edit-item="closeMenu" @edit-item="editItem" >

      </edition-comp>

    </div>
  </div>

</template>
<script>

import TableauComp from "@/components/tableauComp.vue";
import {mapState} from "vuex";
import EditionComp from "@/components/EditionComp.vue";

export default {
  name: "TeamById",
  components: {EditionComp, TableauComp},

  data() {
    return {
      toggleSelect: false,
      selectedItem: null,
      itemEditSelected: null,
      editMenuShow: false,
      loading: false,
      fields: [
        {name: 'publicName', label: "Public Name", required: true},
        {name: "realName", label: "Real Name", required: true},
        {
          name: "powers",
          label: "Powers",
          required: false,
          type: "line",
          subFields: [
            {name: "name", label: "Name", required: true},
            {name: "type", type:"number" , min:1 , max:7 , label: "Type", required: true},
            {name: "level", type:"number" , min:0 , max:100 , label: "Level", required: true}

          ]
        },
      ],
      actionFunction: [
        {text: "Remove", func: this.removeItem, secureAsk: true},
        {text: "Edit", func: this.editMenu, secureAsk: false}

      ]
    }
  },
  computed: {
    ...mapState('heroesModule', ['aliasHeroes']),
    ...mapState('teamsModule', ['currentTeam']),
    filteredHeroes() {
      return this.aliasHeroes.filter((hero) => {
        return !this.currentTeam.members.some(memberId => memberId === hero._id)
      })
    },
    team(){
      return  this.aliasHeroes.filter(hero =>
          this.currentTeam.members.some(memberId => memberId === hero._id)
      );
    }
  },
  async mounted() {
    await this.$store.dispatch('heroesModule/getAliasHeroes');
  },

  methods: {
    cancelAdd() {
      this.toggleSelect = false;
      this.selectedItem = null;
    },
    async switchToggle() {
      this.toggleSelect = !this.toggleSelect
      if (this.aliasHeroes.length === 0) {
        await this.$store.dispatch('heroesModule/getAliasHeroes');
      }
    },

    async removeItem(item) {
      await this.$store.dispatch("teamsModule/removeHeroes", item._id)
    },

    async addHeroestoTeam() {
      this.loading = true
      await this.$store.dispatch("teamsModule/addHeroes", this.selectedItem)
      this.loading = false
      this.selectedItem = null;

    },
    async createHeroesandAddToTeam(item) {
      this.loading = true
      await this.$store.dispatch("heroesModule/createHero", item)
      await this.$store.dispatch("teamsModule/addHeroes", this.$store.state.heroesModule.currentHero._id)
      this.loading = false

    },
    async editMenu(item) {
      this.itemEditSelected = await this.$store.dispatch("heroesModule/getHeroById", item._id);
      if(this.itemEditSelected !== null) {
        this.editMenuShow = true;
      }
    },
    closeMenu() {
      this.editMenuShow = false;
      this.itemEditSelected = null;
    },
    async editItem(item) {
      this.loading = true
      await this.$store.dispatch("heroesModule/updateHero", item)
      this.loading = false
      this.itemEditSelected = null;
      this.editMenuShow = false;
    }
  }
}

</script>
<style scoped>

</style>