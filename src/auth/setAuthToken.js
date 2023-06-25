import {generateUUID} from "../js/utilities.js";

document.getElementById("authorize").addEventListener("click", authorizeUser)

function authorizeUser(){
    const clientId = document.getElementById("client-id").value
    const redirectURI = document.getElementById("redirect-uri").value
    const userAgent = document.getElementById("user-agent").value
    const clientSecret = document.getElementById("client-secret").value
    const state = generateUUID()
    localStorage.setItem("clientId", clientId)
    localStorage.setItem("redirectURI", redirectURI)
    localStorage.setItem("state", state)
    localStorage.setItem("userAgent", userAgent)
    localStorage.setItem("clientSecret", clientSecret)

    const allScopes = "identity,edit,flair,history,modconfig,modflair,modlog,modposts,modwiki,mysubreddits,privatemessages,read,report,save,submit,subscribe,vote,wikiedit,wikiread"
    const authUrl = `https://www.reddit.com/api/v1/authorize.compact?client_id=${clientId}&response_type=code&state=${state}&redirect_uri=${redirectURI}&duration=permanent&scope=${allScopes}`
    window.open(authUrl, "_self")
}

