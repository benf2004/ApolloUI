import {getInitialToken} from "../js/auth.js";

function getCodeFromURI() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('code');
}

getInitialToken(getCodeFromURI())