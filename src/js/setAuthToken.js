import {generateUUID} from "./utilties.js";

document.getElementById("authorize").addEventListener("click", authorizeUser)

function authorizeUser(){
    const clientId = document.getElementById("client-id").value
    const redirectURI = document.getElementById("redirect-uri").value
    localStorage.setItem("clientId", clientId)
    localStorage.setItem("redirectURI", redirectURI)

    const allScopes = "identity,edit,flair,history,modconfig,modflair,modlog,modposts,modwiki,mysubreddits,privatemessages,read,report,save,submit,subscribe,vote,wikiedit,wikiread"
    const authUrl = `https://www.reddit.com/api/v1/authorize.compact?client_id=${clientId}&response_type=code&state=${generateUUID()}&redirect_uri=${redirectURI}&duration=permanent&scope=${allScopes}`
    window.open(authUrl)
}


