<template>
  <div>
<h1>Organisation</h1>
    <v-container>
      <v-row>
        <v-col>
          <v-btn @click="switchToggle">Ajouter</v-btn>
          <v-container v-if="toggleSelect">
            <v-select
                v-model="selectedItem"
                :items="filteredTeams"
                label="Sélectionnez un élément"
                item-text="name"
                item-value="_id"
                solo
            ></v-select>

            <v-btn @click="cancelAdd">Annuler</v-btn>

            <v-btn @click="addTeam" :disabled="!selectedItem">
              Ajouter
            </v-btn>

          </v-container>
        </v-col>
      </v-row>
    </v-container>

    <tableau-comp :enable-action="true"
                  :enable-add="false"
                  :is-row-clickable="()=>{}"
                  :columns="fields"
                  :items="items"
                  :action-function="actionFunction"
                  :add-new-item-function="()=>{}"

    >

    </tableau-comp>
  </div>

</template>
<script>

import {defineComponent} from "vue";
import TableauComp from "@/components/tableauComp.vue";

export default defineComponent({
  components: {TableauComp},
  props:["id"],
  data(){
    return{
      pathCancel: "/org",
      toggleSelect: false,
      selectedItem: null,
      teams: [],
      items: [],
      fields: [],
      actionFunction: [
        {text: "Select", func: this.selectItem , secureAsk: false},
        {text: "Remove", func: this.removeItem , secureAsk: true}
      ]
    }}
  ,computed: {
    filteredTeams() {
      return this.teams.filter((team) => {
        return !this.items.some((item) => {
          return item._id === team._id
        })
      })
    }
  },
  methods: {
    async selectItem(item) {
      await this.$store.dispatch("teamsModule/setCurrentTeam",item)
      this.$router.push({path: "/team/" + item._id})

    },
    async removeItem(item) {
      await this.$store.dispatch("organisationModule/removeTeamOrg", item._id)
      this.items = this.$store.state.organisationModule.currentOrg.teams
    },
    async switchToggle() {
      this.toggleSelect = !this.toggleSelect
      if(this.teams.length === 0) {
        this.teams = await this.$store.dispatch("teamsModule/getTeams")
      }

    },
    async addTeam() {
       await this.$store.dispatch("organisationModule/addTeamOrg", this.selectedItem)
      let request = await this.$store.dispatch("organisationModule/getOrgById",this.id)
      if(request === true) {
        this.items = this.$store.state.organisationModule.currentOrg.teams
      }
      this.selectedItem = null;

    },
    cancelAdd() {
      this.toggleSelect = false;
      this.selectedItem = null;
    },

  },
  async mounted() {
    if(this.$store.state.organisationModule.secretPhrase === null) {
      return false
    }

    let request = await this.$store.dispatch("organisationModule/getOrgById",this.id)
    if(request === true) {
      this.items = this.$store.state.organisationModule.currentOrg.teams

    }

  },
  created() {
    this.fields = ["name"]


  }
})
</script>
<style scoped>

</style>