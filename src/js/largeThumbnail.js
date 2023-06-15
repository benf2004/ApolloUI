export default class largeThumbnail {
    constructor(title, flair, subreddit, upvotes, hoursSincePosted, postType, postContent) {
        this.title = title; // str
        this.flair = flair; // str
        this.subreddit = subreddit; // str
        this.upvotes = upvotes; // int
        this.hoursSincePosted = hoursSincePosted; // int
        this.postType = postType; // str: either "img", "text", "video", or "link" (maybe add poll support via browser extension?)
        this.postContent = postContent; // str (either content or url)
    }


}