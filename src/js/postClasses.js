export default class Post {
    constructor(title, flair, subreddit, OPUsername, upvotes, percentUpvote, commentsAmount, timeCreated, timeEdited, postType, postContent,
                subredditIcon, actions) {
        this.title = title; // str
        this.flair = flair; // str
        this.subreddit = subreddit; // str
        this.OPUsername = OPUsername
        this.upvotes = upvotes; // int
        this.commentsAmount = commentsAmount
        this.percentUpvote = percentUpvote // i1nt
        this.timeCreated = timeCreated; // int
        this.timeEdited = timeEdited // int
        this.postType = postType; // str: either "img", "p", "video", or "a" (maybe add poll support via browser extension?)
        this.postContent = postContent; // str (either content or url)
        this.subredditIcon = subredditIcon; // str of url
        this.actions = actions // see UserInteractions class
    }

    addComments(comments){
        this.comments = comments
    }

    userIsOP(userName) {
        return userName === this.OPUsername
    }

    userIsMod(userModerates=[]){
        return (this.subreddit in userModerates)
    }

    upvote(){
        if (!this.actions.upvoted) {
            this.actions.upvoted = true
            this.actions.downvoted = false
        }
        else {
            this.actions.upvoted = false
        }
        this.updateButtonStyles()
    }

    downvote(){
        if (!this.actions.downvoted) {
            this.actions.upvoted = false
            this.actions.downvoted = true
        }
        else {
            this.actions.downvoted = false
        }
        this.updateButtonStyles()
    }

    updateButtonStyles(){
        if (this.actions.downvoted){
            this.downvoteIcon.classList.remove("icon-darkgray")
            this.downvoteIcon.classList.add("icon-white")
            this.downvoteBtn.classList.add("bg-downvote-cobalt")
        }
        else {
            this.downvoteIcon.classList.add("icon-darkgray")
            this.downvoteIcon.classList.remove("icon-white")
            this.downvoteBtn.classList.remove("bg-downvote-cobalt")
        }
        if (this.actions.upvoted) {
            this.upvoteIcon.classList.remove("icon-darkgray")
            this.upvoteIcon.classList.add("icon-white")
            this.upvoteBtn.classList.add("bg-upvote-orange")
        }
        else {
            this.upvoteIcon.classList.add("icon-darkgray")
            this.upvoteIcon.classList.remove("icon-white")
            this.upvoteBtn.classList.remove("bg-upvote-orange")
        }
    }

    createLargeThumbnail() {
        const thumbNailTemplate = document.getElementById("largeThumbnail");
        const tnc = thumbNailTemplate.content.cloneNode(true); //thumbNailClone

        // Fill in the template with the post information
        tnc.querySelector('.title').textContent = this.title;
        tnc.querySelector('.flair').textContent = this.flair;
        tnc.querySelector('.subName').textContent = this.subreddit;
        //tnc.querySelector('.subreddit-name-icon img.subIcon').src = this.subredditIcon;
        tnc.querySelector('.upvotes').textContent = this.upvotes;
        tnc.querySelector('.comments').textContent = this.commentsAmount;
        tnc.querySelector('.time').textContent = this.hoursSincePosted;
        const postContent = tnc.querySelector('.post-content');
        if (this.postType === "p") {
            postContent.querySelector('p').innerHTML = this.postContent;
        }
        else if (this.postType === "img") {
            postContent.querySelector('img').src = this.postContent;
        }
        else if (this.postType === "a") {
            postContent.querySelector('a').href = this.postContent;
        }
       // postContent.querySelectorAll('p, a, img').forEach(e => {
         //   if (e.tagName.toLowerCase() !== this.postType) e.remove();
        //});

        this.upvoteBtn = tnc.querySelector(".upvote")
        this.upvoteIcon = this.upvoteBtn.querySelector("img")
        this.downvoteBtn = tnc.querySelector(".downvote")
        this.downvoteIcon = this.downvoteBtn.querySelector("img")
        this.upvoteBtn.addEventListener("click", () => this.upvote())
        this.downvoteBtn.addEventListener("click", () => this.downvote())

        this.ellipsisMenu = tnc.querySelector(".ellipsis")
        this.ellipsisMenu.addEventListener("click", () => new iosMenu().openMenu())


        // Append the filled template to the document
        document.body.querySelector("main").appendChild(tnc);
    }
}

class iosMenu {
    openMenu() {
        const menuTemplate = document.getElementById("iosMenu")
        const menuClone = menuTemplate.content.cloneNode(true)

        this.cancelBtn = menuClone.querySelector(".cancelButton")
        this.cancelBtn.addEventListener("click", this.removeMenu)

        document.body.querySelector("main").appendChild(menuClone)
    }

    removeMenu(){
        document.querySelector(".iosMenu").remove()
    }
}

export class UserActions {
    constructor(upvoted=false, downvoted=false, viewed=false, clicked=false, saved=false) {
        this.upvoted = upvoted; // bool
        this.downvoted = downvoted; // bool
        this.viewed = viewed; // bool
        this.saved = saved; // bool
    }
}