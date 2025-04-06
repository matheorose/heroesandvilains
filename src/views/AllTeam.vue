<template>
  <div>
    <h1>Team View</h1>
    <tableau-comp :columns="columns"
                  :items="items"
                  :isRowClickable="() => {return false}"
                  :fields="fields"
                  :addNewItemFunction="createTeam"
                  :loading="loading"
    ></tableau-comp>
  </div>

</template>
<script>

import {defineComponent} from "vue";
import TableauComp from "@/components/tableauComp.vue";

export default defineComponent({
  components: {TableauComp},
  data() {
    return {
      columns: [],
      items: [],
      loading: true,
      fields : [{name:'name' , label:"Name", required:true}],
    };
  },
  methods: {
    async createTeam(item) {
      this.loading = true
      await this.$store.dispatch("teamsModule/createTeam", item.name)
      this.items = await this.$store.dispatch("teamsModule/getTeams")
      this.loading = false
    }
  },
  async  mounted() {
    this.items = await this.$store.dispatch("teamsModule/getTeams")
    this.columns = ['name']
    this.loading = false

  }
})
</script>
<style scoped>

</style>