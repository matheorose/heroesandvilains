import {createAliase, getAliases, getbyidAliase, updateAliase} from "@/services/hero.service";

export const heroesModule = {
    namespaced: true,
    state:{
        aliasHeroes : [],
        currentHero : null

    },
    mutations:{
        setHeroes(state,aliasHeroes){
            state.aliasHeroes = aliasHeroes;
        },
        setCurrentHero(state,hero){
            state.currentHero = hero;
        },
        addHeroe(state,hero){
            state.aliasHeroes.push(hero);
        },
        updateHeroes(state,hero){
            const index = state.aliasHeroes.findIndex((h) => h._id === hero._id);
            state.aliasHeroes.splice(index,1,hero);
        }

    },
    actions:{
        async getAliasHeroes({commit}){
            try {


                const aliasHeroes = await getAliases();

                if (aliasHeroes.error === 0) {
                    commit('setHeroes', aliasHeroes.data);
                    return aliasHeroes.data;
                }else {
                    commit('errorModule/pushError','Aucun Heros a pu etre recuperer :' + aliasHeroes.data, {root:true});
                }


            }catch (err){
                console.error('Probleme lors de la recuperation des alias', err.message);
                commit('errorModule/pushError','Probleme lors de la recuperation des alias');
                throw err;
            }
        },
        async getHeroById({commit},id){
            try {
                const hero = await getbyidAliase(id);
                if (hero.error === 0) {
                    commit('setCurrentHero', hero.data[0]);
                    return hero.data[0];
                }else {
                    commit('errorModule/pushError','le heros n\'a pas pu etre recuperer :' + hero.data , {root:true});
                }

            }catch (err){
                console.error('Probleme lors de la recuperation de l\'alias', err.message);
                commit('errorModule/pushError','Probleme lors de la recuperation de l\'alias');
                throw err;
            }
        },async updateHero({commit},hero){
            try {
                const currentHero = await updateAliase(hero._id,hero.publicName,hero.realName,hero.powers);
                if (currentHero.error === 0) {
                    commit('updateHeroes', currentHero.data);
                }else {
                    commit('errorModule/pushError','Probleme lors de la mise a jour de l\'alias: '+ currentHero.data, {root:true});
                }

            }catch (err){
                console.error('Probleme lors de la mise a jour de l\'alias', err.message);
                commit('errorModule/pushError','Probleme lors de la mise a jour de l\'alias');
                throw err;
            }
        },async createHero({commit},hero){
            try {
                const currentHero = await createAliase(hero.publicName,hero.realName,hero.powers);
                if (currentHero.error === 0) {
                    commit('setCurrentHero', currentHero.data);
                    commit('addHeroe', currentHero.data);
                }else {
                    commit('errorModule/pushError','Prob lors de la creation de l\'alias :' + currentHero.data, {root:true});
                }

            }catch (err){
                console.error('Probleme lors de la mise a jour de l\'alias', err.message);
                commit('errorModule/pushError','Probleme lors de la mise a jour de l\'alias');
                throw err;
            }
        }



    },
    getters:{

    }

}