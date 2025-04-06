import {addTeamOrg, createOrg, getOrgById, getOrgs, removeTeam} from "@/services/org.service";

export const organisationModule = {

    namespaced: true,

    state:{
        orgs : [],
        currentOrg : null,
        secretPhrase: null

    },
    mutations:{
        setOrganisations(state,orgs){
                state.orgs = orgs;
            },
        setCurrentOrg(state,org){
            state.currentOrg = org;
        },
        setSecretPhrase(state,secretPhrase){
            state.secretPhrase = secretPhrase;
        },

    },
    actions:{
        async getOrganisations({commit}){
            try {
                const orgs = await getOrgs();
                if(orgs.error === 0){
                    commit('setOrganisations',orgs.data);

                }else {
                    commit('errorModule/pushError','Probleme lors de la recuperation des organisations :'+orgs.data, {root:true});
                }
                return orgs;

            }catch (error) {
                console.error('Probleme lors de la recuperation des organisation ', error.message);
                commit('errorModule/pushError','Probleme lors de la recuperation des organisations ', {root:true});
                throw error;
            }
        },
        async getOrgById({commit,state},id){
            try {
                if(!state.secretPhrase){
                    commit('errorModule/pushError','Veuillez saisir la phrase secrete');
                    return false;
                }
                const org = await getOrgById(id,state.secretPhrase);
                if(org.error === 0){
                    commit('setCurrentOrg',org.data[0]);

                    return true
                }else {
                    commit('errorModule/pushError','Probleme lors de la recuperation de l\'organisation :'+org.data  , {root:true});
                    return false;

                }
            }catch (error) {
                console.error('Probleme lors de la recuperation de l\'organisation', error.message);
                commit('errorModule/pushError','Probleme lors de la recuperation de l\'organisation ', {root:true});
                throw error;
            }
        },
        async createOrganisation({commit},data){
            try {
                const org = await createOrg(data.name,data.secret);
                if(org.error === 0){
                    commit('setCurrentOrg',org.data);
                    return org;
                }else {
                    commit('errorModule/pushError','Probleme lors de la creation de l\'organisation: ' + org.data, {root:true});

                }
                return org;

            }catch (error) {
                console.error('Probleme lors de la creation de l\'organisation', error.message);
                commit('errorModule/pushError','Probleme lors de la creation de l\'organisation ', {root:true});
                throw error;
            }
        },
        async addTeamOrg({commit,state},idTeam){
            try {
                const org = await addTeamOrg(idTeam,state.secretPhrase);
                if(org.error === 0){
                    commit('setCurrentOrg',org.data);
                }else {
                    commit('errorModule/pushError','L\'equipe n\'a pas été ajoutée dans l\'organisation:'+org.data, {root:true});

                }
                return org;

            }catch (error) {
                console.error('Probleme lors de l\'ajout d\'une equipe dans l\'organisation', error.message);
                commit('errorModule/pushError','Probleme lors de l\'ajout d\'une equipe dans l\'organisation', {root:true});
                throw error;
            }
        },
        async removeTeamOrg({commit,state},idTeam){
            try {
                const org = await removeTeam(idTeam,state.secretPhrase);
                if(org.error === 0){
                    commit('setCurrentOrg',org.data);
                }else {
                    commit('errorModule/pushError','L\'equipe n\'a pas été supprimée de l\'organisation: '+org.data, {root:true});
                }
                return org;

            }catch (error) {
                console.error('Probleme lors de la suppression d\'une equipe dans l\'organisation', error.message);
                commit('errorModule/pushError','Probleme lors de la suppression d\'une equipe dans l\'organisation', {root:true});
                throw error;
            }
        },
        async setSecretPhrase({commit},secretPhrase){
            try {
                commit('setSecretPhrase',secretPhrase);
            }catch (error) {
                console.error('Probleme lors de la mise a jour de la phrase secrete', error.message);
                commit('errorModule/pushError','Probleme lors de la mise a jour de la phrase secrete', {root:true});
                throw error;
            }
        }


    },
    getters:{
        getOrganisations(state){
            return state.orgs;
        },
        getCurrentOrg(state){
            return state.currentOrg;
        },
        getSecretPhrase(state){
            return state.secretPhrase;
        }

    }

}