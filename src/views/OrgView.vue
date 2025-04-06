<template>
  <div>
    <h1>Organisation View</h1>
    <tableau-comp :columns="columns"
                  :items="orgs"
                  :isRowClickable="customIsRowClickable"
                  :fields="fields"
                  :addNewItemFunction="createOrga"
                  :loading="loading"
    ></tableau-comp>
  </div>

</template>
<script>

import {defineComponent} from "vue";
import TableauComp from "@/components/tableauComp.vue";
import {mapState} from "vuex";

export default defineComponent({
  components: {TableauComp},
  data() {
    return {
      columns: [],
      loading: true,
      fields : [{name:'name' , label:"Name", required:true},{name:"secret" ,label:"Password", required:true}],
    };
  },
  computed: {
    ...mapState('organisationModule', ['orgs'])
  },
  methods: {
    async customIsRowClickable(item) {
      if(this.$store.state.organisationModule.secretPhrase === null) {
        this.$store.commit("errorModule/pushError", "Veuillez renseigner la phrase secrète avant de continuer")
        return false
      }
      let request = await this.$store.dispatch("organisationModule/getOrgById", item._id)
      if(request === true) {
        await this.$router.push("/org/" + item._id)
      }
    },
    async createOrga(item) {
      this.loading = true
      await this.$store.dispatch("organisationModule/createOrganisation", item)
      await this.$store.dispatch("organisationModule/getOrganisations")
      this.loading = false



    }
  },
  async  mounted() {
    await this.$store.dispatch("organisationModule/getOrganisations")
    this.columns = ['name']
    this.loading = false


  }
})
</script>
<style scoped>

</style>