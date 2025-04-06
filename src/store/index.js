import Vue from 'vue'
import Vuex from 'vuex'
import {organisationModule} from "@/store/organisationModule";
import {teamsModule} from "@/store/teamsModule";
import {heroesModule} from "@/store/heroesModule";
import errorModule from "@/store/errorModule";
import {getUser, signin} from "@/services/org.service";
import {registerUser, updateWithAuthAliase} from "@/services/hero.service";

Vue.use(Vuex)

const userdata = JSON.parse(localStorage.getItem('userdata'));
const initialState = userdata
    ? {login: true, name: userdata.name, xsrfToken: userdata.xsrfToken, refreshToken: userdata.refreshToken}
    : {login: false, name: null, xsrfToken: null, refreshToken: null};


export default new Vuex.Store({
    modules: {
        organisationModule,
        teamsModule,
        heroesModule,
        errorModule
    },
    state: {
        login: initialState.login,
        name: initialState.name,
        xsrfToken: initialState.xsrfToken,
        refreshToken: initialState.refreshToken

    },
    mutations: {
        signinUser(state, data) {
            state.xsrfToken = data.xsrfToken;
            state.refreshToken = data.refreshToken;
            state.name = data.name;
            state.login = true;
            localStorage.setItem('userdata', JSON.stringify(data));
        }
    },
    actions: {
        async signinRequest({commit}, {login, password}) {

            try {
                let res = await signin(login, password);
                if (res.error === 0) {
                    commit('signinUser', res.data)
                    return true;
                }
                commit('errorModule/pushError', 'Probleme lors de la connexion: ' + res.data, {root: true});
                return false;
            } catch (error) {
                console.error('Probleme lors de la connexion', error.message);
                throw error;
            }
        },

        async logout({commit}) {
            commit('signinUser', {login: false, name: null, xsrfToken: null, refreshToken: null});
            localStorage.removeItem('userdata');
        },

        async getUser({commit}, login) {
            let response = null;
            try {
                response = await getUser(login);
                if (response.error === 0) {
                    return response.data;
                }
                commit('errorModule/pushError', 'Probleme lors de la recuperation de l\'utilisateur : ' + response.data, {root: true});
            } catch (err) {
                console.log(err.message);
            }
        },
        async registerUser({commit}, data) {
            let response = null;
            try {
                response = await registerUser(data.login, data.password, data.hero, data.captchaToken);
                if (response.error === 0) {
                    return true;
                }
                commit('errorModule/pushError', 'Probleme lors de l\'inscription: ' + response.data, {root: true});
            } catch (err) {
                console.log(err.message);
            }
        },

        async updateWithAuthAliase({commit}, data) {
            let response = null;
            try {
                response = await updateWithAuthAliase(data._id, data.publicName, data.realName, data.powers);
                if (response.error === 0) {
                    return response.data
                }

                commit('errorModule/pushError', 'Probleme lors de la mise a jour de l\'alias: ' + response.data, {root: true});
            } catch (err) {
                console.log(err.message);
            }
        }


    },
    getters: {

        isLogin(state){
            return state.login
        }


    }
})
