<template>
  <div>
    <h1>Register View</h1>
    <v-container>
      <v-row>
        <v-col>
          <v-card>
            <v-card-title class="headline">Register</v-card-title>
            <v-card-text>
              <v-form @submit.prevent="register" ref="form">
                <v-text-field v-model="login" label="Login" required></v-text-field>
                <v-text-field v-model="password" label="Password" required></v-text-field>
                <v-select
                    v-model="selectedItem"
                    :items="aliasHeroes"
                    label="Sélectionnez un élément"
                    item-text="publicName"
                    item-value="publicName"
                    solo
                :rules="[(v) => !!v || 'Champ requis']"></v-select>
                <v-container>
                <VueRecaptcha
                    :sitekey="siteKey"
                    :loadRecaptchaScript="true"
                    ref="recaptcha"
                    @verify="onCaptchaVerify"
                    @expired="onCaptchaExpired"
                ></VueRecaptcha>
                </v-container>
                <v-btn type="submit">Register</v-btn>
              </v-form>


            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import {mapState} from "vuex";
import VueRecaptcha from 'vue-recaptcha';
import Config from "@/commons/Config";


export default {
  name: "RegisterView",
  components: {VueRecaptcha},
  data() {
    return {
      login: "",
      password: "",
      selectedItem: null,
      siteKey: Config.captchaSiteKey,
      captchaToken: null,


    };
  },
  methods: {
    async register() {
      if(this.$refs.form.validate()) {
        if (this.captchaToken === null) {
          this.$store.commit("errorModule/pushError", "Veuillez valider le captcha")
          return
        }
        let response = await this.$store.dispatch("registerUser", {login: this.login, password: this.password, hero: this.selectedItem, captchaToken: this.captchaToken})
        if (response) {
          await this.$router.push({name: "Login"})
        }
      }
    },
    onCaptchaVerify: function (response) {
      this.captchaToken = response;
    },
    onCaptchaExpired: function () {
      this.captchaToken = null;
    },
  },
  computed: {
    ...mapState('heroesModule', ['aliasHeroes'])
  }
  ,
  async mounted() {
    await this.$store.dispatch("heroesModule/getAliasHeroes")
  }
}
</script>
<style scoped>
</style>