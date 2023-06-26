import Post, {Comment} from "../js/postClasses.js"
import {getLocalCredentials} from "../js/auth.js";
import {commentListingToArray, listingToPost} from "../js/common.js";

let r = new snoowrap(getLocalCredentials())
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("postid")

async function getPostFromStorage() {
    const postJSON = localStorage.getItem(postId)
    if (!postJSON) return await getPostFromServer()
    const post = Post.fromJSON(postJSON)
    localStorage.removeItem(postId)
    return post;
}

async function getPostComments(){
    const comments = await r.getSubmission(postId).fetch().comments
    return comments
}

async function getPostFromServer(){
    const listing = await r.getSubmission(postId).fetch()
    const post = listingToPost(listing, r)
    console.log(post)
    return post
}

const post = await getPostFromStorage()
post.fillInPost()
console.log(post.commentList)
if (!post.commentList || post.commentList.length === 0) post.commentList = await getPostComments()
post.comments = commentListingToArray(post.commentList, r, [])
post.comments.forEach(comment => comment.createComment())