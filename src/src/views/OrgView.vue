<template>
  <v-container class="org-view" fluid>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <div class="header">
          <h1>Organisations</h1>
        </div>

        <v-card class="org-card">
          <tableau-comp
            :columns="columns"
            :items="orgs"
            :isRowClickable="customIsRowClickable"
            :fields="fields"
            :addNewItemFunction="createOrga"
            :loading="loading"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineComponent } from "vue";
import TableauComp from "@/components/tableauComp.vue";
import { mapState } from "vuex";

export default defineComponent({
  components: { TableauComp },
  data() {
    return {
      columns: [],
      loading: true,
      fields: [
        { name: 'name', label: "Nom de l'organisation", required: true },
        { name: "secret", label: "Mot de passe secret", required: true }
      ],
    };
  },
  computed: {
    ...mapState('organisationModule', ['orgs'])
  },
  methods: {
    async customIsRowClickable(item) {
      if (this.$store.state.organisationModule.secretPhrase === null) {
        this.$store.commit("errorModule/pushError", "Veuillez renseigner la phrase secrète avant de continuer");
        return false;
      }
      const request = await this.$store.dispatch("organisationModule/getOrgById", item._id);
      if (request === true) {
        await this.$router.push("/org/" + item._id);
      }
    },
    async createOrga(item) {
      this.loading = true;
      await this.$store.dispatch("organisationModule/createOrganisation", item);
      await this.$store.dispatch("organisationModule/getOrganisations");
      this.loading = false;
    }
  },
  async mounted() {
    await this.$store.dispatch("organisationModule/getOrganisations");
    this.columns = ['name'];
    this.loading = false;
  }
});
</script>

<style scoped>
.org-view {
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

.org-card {
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  background-color: white;
}
</style>