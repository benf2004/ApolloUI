export function getInitialToken(code){
    const url = 'https://api.reddit.com/api/v1/access_token';
    const data = new URLSearchParams();
    data.append('grant_type', 'authorization_code');
    data.append('code', code);
    data.append('redirect_uri', localStorage.getItem("redirectURI"));

    fetch(url, {
        method: 'POST',
        body: data,
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
}