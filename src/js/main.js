import Post, {UserActions} from "./postClasses.js";
import {getLocalCredentials} from "./api/auth.js";
import {checkDefaults} from "./setDefaults.js";

checkDefaults();

const r = new snoowrap(getLocalCredentials())

let sortModeStr = localStorage.getItem("sortMode") ?? "best"
let sortModeFunc = {
    "best": r.getBest(),
    "hot": r.getHot(),
    "new": r.getNew(),
    "top": r.getTop(),
    "rising": r.getRising()
}

sortModeFunc[sortModeStr].then(listings => {
        console.log(listings)
        listings.forEach(listing => {
            listingToPost(listing).createLargeThumbnail()
        })
    }
)

function getPostType(postHint) {
    if (postHint === null || postHint === undefined || postHint === "self") return "text"
    else if (postHint.includes("video")) return "video"
    else return postHint
}

function getPostContent(l, postType){
    if (postType === "text"){
        return l.selftext
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
        l.created, l.edited, postType, postContent, "", r, l.name
    )
}

