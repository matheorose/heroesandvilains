import {addHeroes, createTeam, getTeams, removeHeroes} from "@/services/team.service";

export const teamsModule = {
    namespaced: true,

    state:{
        teams : [],
        currentTeam : null

    },
    mutations:{
        setTeams(state,teams){
            state.teams = teams;
        },
        setCurrentTeam(state,team){
            state.currentTeam = team;
        }

    },
    actions:{
        async getTeams({commit}){
            try {
                const teams = await getTeams();
                if(teams.error === 0){
                    commit('setTeams',teams.data);
                    return teams.data;
                }else {
                   commit('errorModule/pushError','Probleme lors de la recuperation des teams :'+teams.data, {root:true});
                }

            }catch (error) {
                console.error('Probleme lors de la recuperation des teams', error.message);
                throw error;
            }

        },
        async createTeam({commit},name){
            try {
                const team = await createTeam(name);
                if(team.error === 0){
                    commit('setCurrentTeam',team.data);
                }else {
                    commit('errorModule/pushError','Probleme lors de la creation de la team :'+team.data, {root:true});

                }
            }catch (error) {
                console.error('Probleme lors de la creation de la team', error.message);
                throw error;
            }

        },
        async addHeroes({commit,state},idHero){
            try {
                const team = await addHeroes(state.currentTeam._id,idHero);
                if(team.error === 0){
                    commit('setCurrentTeam',team.data);
                }else {
                    commit('errorModule/pushError','Probleme lors de la modification de la team :'+team.data, {root:true});
                }
                return team;

            }catch (error) {
                console.error('Probleme lors de la modification de la team', error.message);
                throw error;
            }

        },
        async removeHeroes({commit,state},idHero){
            try {
                const team = await removeHeroes(state.currentTeam._id,idHero);
                if(team.error === 0){
                    commit('setCurrentTeam',team.data);
                }else {
                    commit('errorModule/pushError','Probleme lors de la modification de la team :'+team.data, {root:true});
                }

            }catch (error) {
                console.error('Probleme lors de la modification de la team', error.message);
                throw error;
            }

        },
        async setCurrentTeam({commit},team){
            try{
                if(team){
                    commit('setCurrentTeam',team)
                }else{
                    commit('errorModule/pushError','Probleme lors de la mise de la team courrante', {root:true})
                }
            }catch (e){
                console.error("Erreur lors de la mise de la team courrante")
            }
        }

    },
    getters:{
    }

}