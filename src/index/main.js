import Post from "../js/postClasses.js";
import {getLocalCredentials} from "../js/auth.js";
import {checkDefaults} from "./setDefaults.js";
import {host} from "../js/host.js"
import {listingToPost} from "../js/common.js";

checkDefaults();

let r;

const clientId = localStorage.getItem("clientId")
if (!clientId) document.querySelector("main").innerHTML = `<div class="setup-auth">You must first set up your API credentials. <a href="/auth">Click here to get started.</a></div>`
r = new snoowrap(getLocalCredentials())
const MAX_POSTS_LOADED = 10;
const thrityMinutes = 30 * 60000;

let sortModeStr = localStorage.getItem("sortMode") ?? "best"
let commonOpts = {show: "all", limit: MAX_POSTS_LOADED}
let needNewSlice = localStorage.getItem("beforeExpires") < new Date().getTime() ?? true
if (!needNewSlice){ // get a new slice every 30 minutes
    commonOpts.after = localStorage.getItem("before")
}

console.log({needNewSlice, commonOpts})

let sortModeFunc = {
    "best": r.getBest(commonOpts),
    "hot": r.getHot(commonOpts),
    "new": r.getNew(commonOpts),
    "top": r.getTop(commonOpts),
    "rising": r.getRising(commonOpts)
}



function getPosts() {
    sortModeFunc[sortModeStr].then(listings => {
            if (needNewSlice) {
                localStorage.setItem("before", listings[MAX_POSTS_LOADED - 1].name)
                const nowPlus30 = new Date().getTime() + thrityMinutes
                localStorage.setItem("beforeExpires", nowPlus30.toString())
            }
            listings.forEach(listing => {
                listingToPost(listing, r).createLargeThumbnail()
            })
        }
    )
}
getPosts()