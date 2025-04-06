import {getRequest,postRequest , patchRequest} from "@/services/axios.service";
import store from "@/store";

async function getOrgsFromAPI() {
    return getRequest('/herocorp/orgs/get' , 'GETORG')
}

async function getOrgs() {
    try {
        let res = await getOrgsFromAPI();
        if(res.status === 200) {
            return  {error: 0, data: res.data};
        }
        return  res
    } catch (error) {
        // Gérer l'erreur ici
        console.error('Probleme lors de la recuperation des l\'organisations', error.message);
        throw error;
    }
}

async function createOrgFromAPI(data) {
    return postRequest('/herocorp/orgs/create', data, 'CREATEORG')
}

async function createOrg(name ,secret){
    const data = {
        name,
        secret
    }
    try {
        let res = await createOrgFromAPI(data);
        if(res.status === 200) {
            return  {error: 0 , data: res.data};
        }
        return res
    } catch (error) {
        console.error('Probleme lors de la creation de l\'organisation', error.message);
        throw error;
    }
}


async function addTeamOrgFromAPI(data) {
    return patchRequest('/herocorp/orgs/addteam', data, 'ADDTEAMTOORG')
}

async function addTeamOrg(idTeam){
    const data = {
        idTeam
    }

    try {
        let res = await addTeamOrgFromAPI(data);
        if(res.status === 200) {
            return  {error: 0 , data: res.data};
        }
        return  res
    } catch (error) {
        console.error('Probleme lors de l\'ajout d\'une equipe dans l\'organisation', error.message);
        throw error;
    }
}


async function removeTeamOrgFromAPI(data) {
    return patchRequest('/herocorp/orgs/removeteam', data, 'REMOVETEAMTOORG')
}

async function removeTeam(idTeam ){
    const data = {
        idTeam
    }

    try {
        let res = await removeTeamOrgFromAPI(data);
        if(res.status === 200) {
            return  {error: 0 , data: res.data};
        }
        return  res

    } catch (error) {
        console.error('Probleme lors de la suppression d\'une equipe dans l\'organisation', error.message);
        throw error;
    }
}

async function getOrgByIdFromAPI(data) {
    return getRequest('/herocorp/orgs/getbyid/'+data.id, 'GETBYIDORG')
}

async function getOrgById(id) {
    const data = {
        id
    }
    try {
        let res = await getOrgByIdFromAPI(data);
        if(res.status === 200) {

            return  {error: 0 , data: res.data};
        }
        return  res
    } catch (error) {
        console.error('Probleme lors de la recuperation de l\'organisation', error.message);
        throw error;
    }
}


function authHeader() {

    let orgSecret = store.getters['organisationModule/getSecretPhrase']
    let userdata = JSON.parse(localStorage.getItem('userdata'));
    let header = {}
    if (orgSecret) {
        header['org-secret'] = orgSecret;
    }
    if (userdata && userdata.xsrfToken) {
        header['x-xsrf-token'] = userdata.xsrfToken;
    }
    return header;
}

async function signinFromAPI(data) {
    return postRequest('/authapi/auth/signin/', data, 'SIGNIN')
}

async function signin(login, password){
    const data = {
        login,
        password
    }
    try {
        let res = await signinFromAPI(data);
        if(res.status === 200) {
            return  {error: 0 , data: res.data};
        }
        return  res
    } catch (error) {
        console.error('Probleme lors de la connexion', error.message);
        throw error;
    }
}


async function getUserFromAPI(login) {
    return getRequest('/authapi/user/getuser/'+login, 'GETUSER')
}

async function getUser(login){
    try {
        let res = await getUserFromAPI(login);
        if(res.status === 200) {
            return  {error: 0 , data: res.data};
        }
        return  res
    } catch (error) {
        console.error('Probleme lors de la recuperation de l\'utilisateur', error.message);
        throw error;
    }
}

export {
    getOrgs,
    createOrg,
    addTeamOrg,
    removeTeam,
    getOrgById,
    authHeader,
    signin,
    getUser
}