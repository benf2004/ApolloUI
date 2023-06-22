export default class Post {
    constructor(title, flair, subreddit, OPUsername, score, percentUpvote, commentsAmount, timeCreated, timeEdited, postType, postContent,
                subredditIcon, r, id, likes, viewed, clicked, saved) {
        this.title = title; // str
        this.flair = flair; // str
        this.subName = subreddit; // str
        this.OPUsername = OPUsername;
        this.score = score; // int
        this.commentsAmount = commentsAmount
        this.percentUpvote = percentUpvote // int
        this.timeCreated = timeCreated; // int
        this.timeEdited = timeEdited; // int
        this.postType = postType; // str: either "image", "link", "video", or "text"
        this.postContent = postContent; // str (either content or url)
        this.subredditIcon = subredditIcon; // str of url
        this.r = r;
        this.id = id;
        this.actions = new UserActions(likes === true, likes === false, viewed, clicked, saved); // see UserInteractions class
    }

    addComments(comments){
        this.comments = comments
    }

    userIsOP(userName) {
        return userName === this.OPUsername
    }

    userIsMod(userModerates=[]){
        return (this.subName in userModerates)
    }

    upvote(){
        if (!this.actions.upvoted) {
            this.actions.upvoted = true
            this.actions.downvoted = false
            this.r.getSubmission(this.id).upvote()
        }
        else {
            this.actions.upvoted = false
            this.r.getSubmission(this.id).upvote()
        }
        this.updateButtonStyles()
        this.removeMenu()
    }

    downvote(){
        if (!this.actions.downvoted) {
            this.actions.upvoted = false
            this.actions.downvoted = true
            this.r.getSubmission(this.id).downvote()
        }
        else {
            this.actions.downvoted = false
            this.r.getSubmission(this.id).downvote()
        }
        this.updateButtonStyles()
        this.removeMenu()
    }

    savePost(){

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

    doMenuFuncThenClose(func){
        func()
        this.cancelBtn.addEventListener("click", this.removeMenu)
    }

    createMenu() {
        const menuTemplate = document.getElementById("iosMenu")
        const menuClone = menuTemplate.content.cloneNode(true)

        menuClone.querySelector(".upvote").addEventListener("click", () => this.upvote())
        menuClone.querySelector(".downvote").addEventListener("click", () => this.downvote())


        this.cancelBtn = menuClone.querySelector(".cancelButton")
        this.cancelBtn.addEventListener("click", this.removeMenu)

        document.body.querySelector("main").appendChild(menuClone)
    }

    removeMenu(){
        if (document.querySelector(".iosMenu")) document.querySelector(".iosMenu").remove()
    }

    createLargeThumbnail() {
        const thumbNailTemplate = document.getElementById("largeThumbnail");
        const tnc = thumbNailTemplate.content.cloneNode(true); //thumbNailClone

        // Fill in the template with the post information
        tnc.querySelector('.title').textContent = this.title;
        tnc.querySelector('.flair').textContent = this.flair;
        tnc.querySelector('.subName').textContent = this.subName;
        //tnc.querySelector('.subreddit-name-icon img.subIcon').src = this.subredditIcon;
        tnc.querySelector('.score').textContent = this.score;
        tnc.querySelector('.comments').textContent = this.commentsAmount;
        //tnc.querySelector('.time').textContent = this.hoursSincePosted;
        const pc = tnc.querySelector('.post-content')
        if (this.postType === "text") {
            const html = `<p class="darkgray"></p>`
            pc.insertAdjacentHTML("afterbegin", html)
            pc.querySelector("p").innerText = this.postContent
        }
        else if (this.postType === "image") {
            const html = `<img src="${this.postContent}">`
            pc.insertAdjacentHTML("afterbegin", html)
        }
        else if (this.postType === "link") {
            const html = `<p><a href="${this.postContent}">${this.postContent}</a></p>`
            pc.insertAdjacentHTML("afterbegin", html)
        }

        this.upvoteBtn = tnc.querySelector(".upvote")
        this.upvoteIcon = this.upvoteBtn.querySelector("img")
        this.downvoteBtn = tnc.querySelector(".downvote")
        this.downvoteIcon = this.downvoteBtn.querySelector("img")
        this.upvoteBtn.addEventListener("click", () => this.upvote())
        this.downvoteBtn.addEventListener("click", () => this.downvote())

        this.ellipsisMenu = tnc.querySelector(".ellipsis")
        this.ellipsisMenu.addEventListener("click", () => this.createMenu())

        this.updateButtonStyles()


        // Append the filled template to the document
        document.body.querySelector("main").appendChild(tnc);
    }
}

class iosMenu {
    constructor(id, r) {
        this.id = id;
        this.r = r;
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