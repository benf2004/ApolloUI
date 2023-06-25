import {host} from "./host.js";

export function getInitialToken(code){
    const options = {
        code: code,
        userAgent: localStorage.getItem("userAgent"),
        clientId: localStorage.getItem("clientId"),
        redirectUri: localStorage.getItem("redirectURI"),
        clientSecret: localStorage.getItem("clientSecret")
    }
    console.log(options)
    snoowrap.fromAuthCode(options).then(r => {
        // Now we have a requester that can access reddit through the user's account
        console.log(r)
        localStorage.setItem("refreshToken", r.refreshToken)
        localStorage.setItem("accessToken", r.accessToken)
        window.open(`${host}`, "_self")
    })
}

export function getLocalCredentials(){
    return {
        clientSecret: localStorage.getItem("clientSecret"),
        clientId: localStorage.getItem("clientId"),
        userAgent: localStorage.getItem("userAgent"),
        refreshToken: localStorage.getItem("refreshToken"),
    }
}