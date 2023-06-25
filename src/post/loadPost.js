import Post, {Comment} from "../js/postClasses.js"

const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("postid")
console.log(postId)
const postJSON = localStorage.getItem(postId)
console.log(postJSON)
const post = Post.fromJSON(postJSON)
console.log(post)
localStorage.removeItem(postId)