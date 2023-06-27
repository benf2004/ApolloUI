import Post, {Comment} from "./postClasses.js";

export function generateUUID() { // created by ChatGPT
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });

    return uuid;
}

function getHourDifference(epochTimestamp) {
    // Convert epoch timestamp to milliseconds
    const timestampMs = epochTimestamp * 1000;

    // Get the current time in milliseconds
    const nowMs = Date.now();

    // Calculate the time difference in milliseconds
    const differenceMs = nowMs - timestampMs;

    // Convert milliseconds to hours
    const hours = differenceMs / (1000 * 60 * 60);

    // Round to the nearest tenth
    const roundedHours = Math.round(hours * 10) / 10; // nearest tenth of an hour

    return roundedHours;
}

export function getPrettyTimeDiff(epochTimeStamp){
    const hourDif = getHourDifference(epochTimeStamp)
    if (hourDif < 1){
        return `${Math.round(hourDif * 60)}m`
    }
    else if (hourDif < 24) {
        return `${Math.round(hourDif)}h`
    }
    const dayDif = Math.round(hourDif / 24)
    if (dayDif < 30){
        return `${dayDif}d`
    }
    const monthDif = dayDif / 30 // approximate
    if (monthDif < 12){
        return (`${Math.round(monthDif)}m`)
    }
    const yearDif = monthDif / 12
    const roundedYearDif = Math.round(yearDif * 10) * 10 // nearest 10th
    return `${roundedYearDif}y`
}

export function findTopNode(el) {
    if (el.classList.contains("post-main") || !el.parentNode) {
        return el;
    }

    let ancestor = el.parentNode;
    while (!ancestor.classList.contains("post-main")) {
        ancestor = ancestor.parentNode;
    }

    return ancestor;
}

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

export function listingToComment(l, r){
    return new Comment (
        l.author.name, l.body_html, l.name, l.parent_id, l.likes, l.saved, l.depth, l.score, l.created, l.edited, r
    )
}

export function listingToPost(l, r){
    const postType = getPostType(l.post_hint)
    const postContent = getPostContent(l, postType)
    return new Post (
        l.title, l.link_flair_text, l.subreddit.display_name, l.author.name, l.score, l.upvote_ratio, l.num_comments,
        l.created, l.edited, postType, postContent, "", r, l.name, l.likes, l.visited, l.saved, l.comments
    )
}

export function commentListingToArray(comments, r, commentList=[]) {
    for (let comment of comments) {
        commentList.push(listingToComment(comment, r))
        if (comment.replies) {
            commentList = commentListingToArray(comment.replies, r, commentList)
        }
    }
    return commentList
}

export function bounceIcon(el){
    el.classList.add("pulsate-fwd")
    setTimeout(() => el.classList.remove("pulsate-fwd"), 1500)
}