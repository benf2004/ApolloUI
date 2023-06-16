import {getInitialToken } from "./api/auth.js";

function getCodeFromURI() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('code');
}

getInitialToken(getCodeFromURI())