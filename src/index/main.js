import Post from "../js/postClasses.js";
import {getLocalCredentials} from "../js/auth.js";
import {checkDefaults} from "./setDefaults.js";
import {host} from "../js/host.js"

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
                listingToPost(listing).createLargeThumbnail()
            })
        }
    )
}
getPosts()

function getPostType(postHint) {
    if (postHint === null || postHint === undefined || postHint === "self") return "text"
    else if (postHint.includes("video")) return "video"
    else return postHint
}

function getPostContent(l, postType){
    if (postType === "text"){
        return l.selftext_html
    }
    else if (postType === "link"){
        return l.url
    }
    else if (postType === "image"){
        return l.preview.images[0].source.url
    }
}

function listingToPost(l){
    const postType = getPostType(l.post_hint)
    const postContent = getPostContent(l, postType)
    return new Post (
        l.title, l.link_flair_text, l.subreddit.display_name, l.author.name, l.score, l.upvote_ratio, l.num_comments,
        l.created, l.edited, postType, postContent, "", r, l.name, l.likes, l.visited, l.saved, l.comments
    )
}

