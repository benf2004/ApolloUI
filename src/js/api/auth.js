export function getInitialToken(code){
    snoowrap.fromAuthCode({
        code: code,
        userAgent: 'My appasdfasd',
        clientId: localStorage.getItem("clientId"),
        redirectUri: localStorage.getItem("redirectURI"),
        clientSecret: localStorage.getItem("clientSecret")
    }).then(r => {
        // Now we have a requester that can access reddit through the user's account
        localStorage.setItem("refreshToken", r.refreshToken)
        localStorage.setItem("accessToken", r.accessToken)
    })
}