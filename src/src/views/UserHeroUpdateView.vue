<template>
  <v-container>
  <v-container v-if="hero!=null">
    <tableau-comp
                  :is-row-clickable="()=>{return false}"
                  :columns="['publicName','realName']"
                  :items="heroes"
                  :action-function="actionFunction"
                  :enable-action="true"
    >

    </tableau-comp>
    <edition-comp v-if="editMenuShow" :fields="fields" :item="hero" @cancel-edit-item="closeMenu" @edit-item="editItem" >
    </edition-comp>
  </v-container>
    <v-container v-else>
      <v-card-text>
        Aucun hero trouvé
      </v-card-text>
    </v-container>
  </v-container>
</template>
<script>

import EditionComp from "@/components/EditionComp.vue";
import TableauComp from "@/components/tableauComp.vue";

export default {
  name: "TeamById",
  components: {TableauComp, EditionComp},

  data() {
    return {
      heroes: [],
      hero:null,
      editMenuShow: false,
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
        {text: "Edit", func: this.editMenu, secureAsk: false}

      ]
    }
  },
  computed: {
  },
  async mounted() {
    let result = await this.$store.dispatch("getUser", this.$store.state.name)
    if(result){
      this.heroes = [result.hero]
      this.hero = result.hero
    }
  },

  methods: {

    async editMenu(item) {
      this.itemEditSelected = item
      if(this.itemEditSelected !== null) {
        this.editMenuShow = true;
      }
    },
    closeMenu() {
      this.editMenuShow = false;
      this.itemEditSelected = null;
    },
    async editItem(item) {
      let itemedited = await this.$store.dispatch("updateWithAuthAliase", item)
      if(itemedited) {
        this.hero = itemedited
        this.heroes.splice(this.heroes.findIndex(hero => hero._id === itemedited._id), 1, itemedited)
      }

      this.itemEditSelected = null;
      this.editMenuShow = false;
    }
  }
}
</script>