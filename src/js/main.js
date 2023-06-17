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
        listings.forEach(listing =>{
            listingToPost(listing).createLargeThumbnail()
        })
    }
)

function listingToPost(l){
    return new Post (
        l.title, l.link_flair_text, l.subreddit_name_prefixed, l.author.name, l.score, l.upvote_ratio, l.num_comments, l.created, l.edited, "p", l.selftext_html, "", new UserActions()
    )
}

