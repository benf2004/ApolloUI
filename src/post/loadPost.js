import Post, {Comment} from "../js/postClasses.js"
import {getLocalCredentials} from "../js/auth.js";
import {listingToPost} from "../js/common.js";

let r;
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("postid")

async function getPostFromStorage() {
    const postJSON = localStorage.getItem(postId)
    if (!postJSON) return await getPostFromServer()
    const post = Post.fromJSON(postJSON)
    return post;
}

async function getPostFromServer(){
    r = new snoowrap(getLocalCredentials())
    const listing = await r.getSubmission(postId).fetch()
    const post = listingToPost(listing, r)
    console.log(post)
    return post
}

const post = await getPostFromStorage()
post.fillInPost()