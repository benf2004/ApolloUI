import Post, {Comment} from "../js/postClasses.js"

function getPostFromStorage() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("postid")
    const postJSON = localStorage.getItem(postId)
    const post = Post.fromJSON(postJSON)
    localStorage.removeItem(postId)
    return post;
}

const post = getPostFromStorage()
post.fillInPost()