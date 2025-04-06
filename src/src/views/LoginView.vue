<template>
  <v-container class="form-container" fluid>
    <v-row justify="center" align="stretch" dense>
      <!-- Bloc Phrase Secrète -->
      <v-col cols="12" md="5">
        <v-card class="form-card">
          <v-card-title class="form-title"> Phrase Secrète</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="secretPhrase"
              label="Entrez la phrase secrète"
              outlined
              dense
              required
            ></v-text-field>
          </v-card-text>
          <v-card-actions class="form-actions">
            <v-btn @click="openConfirmationDialog" color="primary" class="form-btn">Valider</v-btn>
          </v-card-actions>
        </v-card>

        <!-- Confirmation Dialog Phrase -->
        <v-dialog v-model="dialogVisible" max-width="500">
          <v-card>
            <v-card-title class="headline">Confirmation</v-card-title>
            <v-card-text>
              Êtes-vous sûr de vouloir enregistrer la phrase secrète ?
            </v-card-text>
            <v-card-actions>
              <v-btn @click="saveSecretPhrase" color="primary">Oui</v-btn>
              <v-btn @click="closeConfirmationDialog" color="error">Annuler</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>

      <!-- Bloc Connexion -->
      <v-col cols="12" md="5">
        <v-card class="form-card">
          <v-card-title class="form-title"> Connexion</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="login"
              label="Identifiant"
              outlined
              dense
              required
            ></v-text-field>
            <v-text-field
              v-model="password"
              label="Mot de passe"
              type="password"
              outlined
              dense
              required
            ></v-text-field>
          </v-card-text>
          <v-card-actions class="form-actions">
            <v-btn @click="dialogLoginVisible = true" color="primary" class="form-btn">Se connecter</v-btn>
          </v-card-actions>
        </v-card>

        <!-- Confirmation Dialog Login -->
        <v-dialog v-model="dialogLoginVisible" max-width="500">
          <v-card>
            <v-card-title class="headline">Confirmation</v-card-title>
            <v-card-text>
              Êtes-vous sûr de vouloir vous connecter ?
            </v-card-text>
            <v-card-actions>
              <v-btn @click="signinAndSave" color="primary">Oui</v-btn>
              <v-btn @click="dialogLoginVisible = false" color="error">Annuler</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      secretPhrase: "",
      dialogVisible: false,
      dialogLoginVisible: false,
      login: "",
      password: "",
    };
  },
  methods: {
    openConfirmationDialog() {
      this.dialogVisible = true;
    },
    closeConfirmationDialog() {
      this.dialogVisible = false;
    },
    saveSecretPhrase() {
      this.$store.dispatch("organisationModule/setSecretPhrase", this.secretPhrase);
      this.$router.push('/');
      this.closeConfirmationDialog();
    },
    async signinAndSave() {
      let log = await this.$store.dispatch("signinRequest", {
        login: this.login,
        password: this.password
      });
      if (log) {
        this.$router.push('/hero');
      }
      this.dialogLoginVisible = false;
    },
  },
};
</script>

<style scoped>
.form-container {
  padding-top: 60px;
  padding-bottom: 60px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.form-card {
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

.form-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #333;
}

.form-actions {
  justify-content: flex-end;
}

.form-btn {
  min-width: 120px;
}
</style>