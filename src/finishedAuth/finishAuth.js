import {getInitialToken} from "../js/auth.js";

function getCodeFromURI() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('code');
}

getInitialToken(getCodeFromURI())
setTimeout(() => document.getElementById("redirect").style.display = "block", 3000)