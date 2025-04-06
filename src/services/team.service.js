import {getRequest, patchRequest, postRequest} from "@/services/axios.service";


    async function getTeamsFromAPI() {
        return getRequest('/herocorp/teams/get' , 'GETMANYBAT')
    }

    async function getTeams() {
        try {
            let res= await getTeamsFromAPI();
            if(res.status === 200) {
                return  {error: 0 , data: res.data};
            }
            return  res
        } catch (error) {
            // Gérer l'erreur ici
            console.error('Probleme lors de la recuperation des teams', error.message);
            throw error;
        }
    }


    async function createTeamFromAPI(data) {
        return postRequest('/herocorp/teams/create', data, 'CREATETEAM')
    }

    async function createTeam(name){
        const data = {
            name
        }
        try {
            const res = await createTeamFromAPI(data);
            if(res.status === 200){
                return {error: 0 , data: res.data};
            }
            return  res
        } catch (error) {
            console.error('Probleme lors de la creation de la team', error.message);
            throw error;
        }
    }

    async function addHeroesFromAPI(data) {
        return patchRequest('/herocorp/teams/addheroes', data, 'ADDHEROESTOTEAM')
    }

    async function addHeroes(idTeam , idHeroes){
        const data = {
            idHeroes:[idHeroes],
            idTeam:idTeam,
        }

        try {
            const result =  await addHeroesFromAPI(data);
            if(result.status === 200){
                return {error: 0 , data: result.data};
            }
            return result
        } catch (error) {
            console.error('Probleme lors de l\'ajout des heros a la team', error.message);
            throw error;
        }
    }


    async function removeHeroesFromAPI(data) {
        return patchRequest('/herocorp/teams/removeheroes', data, 'REMOVEHEROESTOTEAM')
    }

async function removeHeroes(idTeam , idHeroes){
        const data = {
            idHeroes:[idHeroes],
            idTeam:idTeam,
        }

        try {
            const result =  await removeHeroesFromAPI(data);
            if(result.status === 200){
                return {error: 0 , data: result.data};
            }
            return  result
        } catch (error) {
            console.error('Probleme lors de la suppression des heros a la team', error.message);
            throw error;
        }
    }



    export {
        getTeams,
        createTeam,
        addHeroes,
        removeHeroes
    }
