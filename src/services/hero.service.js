import {getRequest,postRequest,putRequest} from "@/services/axios.service";


    async function getAliasesFromAPI() {
        return getRequest('/herocorp/heroes/getaliases' , 'GETMANYBAT')
    }

    async function getAliases() {
        try {
            const res = await getAliasesFromAPI();
            if(res.status === 200){
                return {error: 0 , data: res.data};
            }
            return res
        } catch (error) {
            // Gérer l'erreur ici
            console.error('Probleme lors de la recuperation des Alias', error.message);
            throw error;
        }
    }

    async function createAliaseFromAPI(data) {
        return postRequest('/herocorp/heroes/create', data, 'CREATEALIAS')
    }

    async function createAliase(publicName, realName, powers){
        const data = {
            publicName,
            realName,
            powers
        }
        try {
            const res = await createAliaseFromAPI(data);
            if(res.status === 200){
                return {error: 0 , data: res.data};
            }else{
                return  res
            }

        } catch (error) {
            console.error('Probleme lors de la creation de l\'alias', error.message);
            throw error;
        }
    }

    async function updateAliaseFromAPI(data) {
        return putRequest('/herocorp/heroes/update', data, 'UPDATEALIAS')
    }

    async function updateAliase(id , publicName, realName, powers){
        const data = {
            _id:id,
            publicName,
            realName,
            powers,
        }
        try {
            const res = await updateAliaseFromAPI(data);
            if(res.status === 200){
                return  {error: 0 , data: res.data};
            }
            return  res
        } catch (error) {
            console.error('Probleme lors de la mise a jour de l\'alias', error.message);
            throw error;
        }
    }


    async function getbyidAliaseFromAPI(data) {
        return getRequest('/herocorp/heroes/getbyid/'+data.id , 'GETBYIDALIAS')
    }


    async function getbyidAliase(id) {
        const data = {
            id
        }

        try {
            const res = await getbyidAliaseFromAPI(data);
            if(res.status === 200){
                return {error: 0 , data: res.data};
            }
            return  res
        } catch (error) {
            console.error('Probleme lors de la recuperation de l\'alias', error.message);
            throw error;
        }
    }



    async function updateWithAuthAliaseFromAPI(data){
        return putRequest('/herocorp/heroes/authupdate', data, 'UPDATEWITHAUTHALIAS')
    }

    async function updateWithAuthAliase(id , publicName, realName, powers){
        const data = {
            _id:id,
            publicName,
            realName,
            powers,
        }
        try {
            const res = await updateWithAuthAliaseFromAPI(data);
            if(res.status === 200){
                return  {error: 0 , data: res.data};
            }
            return  res
        } catch (error) {
            console.error('Probleme lors de la mise a jour de l\'alias', error.message);
            throw error;
        }
    }


    async function registerUserFromAPI(data) {
        return postRequest('/authapi/user/register', data, 'REGISTERALIAS')
    }


    async function registerUser(login, password , hero , captchaToken ){
        const data = {
            login,
            password,
            hero,
            captchaToken
        }
        try {
            const res = await registerUserFromAPI(data);
            if(res.status === 200){
                return {error: 0 , data: res.data};
            }else{
                return  res
            }

        } catch (error) {
            console.error('Probleme lors de l\'inscription', error.message);
            throw error;
        }
    }



    export {
        getAliases,
        createAliase,
        updateAliase,
        getbyidAliase,
        updateWithAuthAliase,
        registerUser
    }
