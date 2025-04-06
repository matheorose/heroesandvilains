<template>
  <v-container class="team-view" fluid>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <div class="header">
          <h1>Gestion de l'Équipe</h1>
        </div>

        <v-card class="team-card">
          <tableau-comp
            :columns="columns"
            :items="items"
            :isRowClickable="() => false"
            :fields="fields"
            :addNewItemFunction="createTeam"
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

export default defineComponent({
  components: { TableauComp },
  data() {
    return {
      columns: [],
      items: [],
      loading: true,
      fields: [{ name: 'name', label: "Nom de l'équipe", required: true }],
    };
  },
  methods: {
    async createTeam(item) {
      this.loading = true;
      await this.$store.dispatch("teamsModule/createTeam", item.name);
      this.items = await this.$store.dispatch("teamsModule/getTeams");
      this.loading = false;
    }
  },
  async mounted() {
    this.items = await this.$store.dispatch("teamsModule/getTeams");
    this.columns = ['name'];
    this.loading = false;
  }
});
</script>

<style scoped>
.team-view {
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

.team-card {
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  background-color: white;
}
</style>