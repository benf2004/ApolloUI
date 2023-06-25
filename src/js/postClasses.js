import {getPrettyTimeDiff, findTopNode} from "./utilities.js";
import {host} from "./host.js"

export default class Post {
    constructor(title, flair, subreddit, OPUsername, score, percentUpvote, commentsAmount, timeCreated, timeEdited, postType, postContent,
                subredditIcon, r, id, likes, clicked, saved, comments) {
        this.title = title; // str
        this.flair = flair; // str
        this.subName = subreddit; // str
        this.OPUsername = OPUsername;
        this.score = score; // int
        this.commentsAmount = commentsAmount
        this.percentUpvote = percentUpvote // int
        this.timeCreatedString = getPrettyTimeDiff(timeCreated); // int
        this.timeEdited = timeEdited; // int TODO add edit time with pencil icon (check if equal to time created)
        this.postType = postType; // str: either "image", "link", "video", or "text"
        this.postContent = postContent; // str (either content or url)
        this.subredditIcon = subredditIcon; // str of url
        this.r = r;
        this.id = id;
        this.actions = new UserActions(likes === true, likes === false, false, clicked, saved); // see UserInteractions class
    }

    userIsOP(userName) {
        return userName === this.OPUsername
    }

    userIsMod(userModerates=[]){
        return (this.subName in userModerates)
    }

    savePost(){

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

    createMenu() {
        const menuTemplate = document.getElementById("iosMenu")
        const menuClone = menuTemplate.content.cloneNode(true)

        menuClone.querySelector(".upvote").addEventListener("click", () => this.upvote())
        menuClone.querySelector(".downvote").addEventListener("click", () => this.downvote())


        this.cancelBtn = menuClone.querySelector(".cancelButton")
        this.cancelBtn.addEventListener("click", this.removeMenu)

        document.body.querySelector("main").appendChild(menuClone)
    }

    openPost(e){
        const topNode = findTopNode(e.target)
        if (topNode.classList.contains("do-not-open") || e.target.classList.contains("do-not-open")){
            return;
        }
        topNode.classList.add('bg-lightgray')
        localStorage.setItem(this.id, JSON.stringify(this))
        let url = `${host}/post/?postid=${this.id}`
        console.log(url)
        window.open(url, "_self")
    }

    removeMenu(){
        if (document.querySelector(".iosMenu")) document.querySelector(".iosMenu").remove()
    }

    createLargeThumbnail() {
        const thumbNailTemplate = document.getElementById("largeThumbnail");
        let tnc = thumbNailTemplate.content.cloneNode(true); //thumbNailClone

        // Fill in the template with the post information
        tnc.querySelector('.title').textContent = this.title;
        tnc.querySelector('.flair').textContent = this.flair;
        tnc.querySelector('.subName').textContent = this.subName;
        //tnc.querySelector('.subreddit-name-icon img.subIcon').src = this.subredditIcon; // TODO add support for subreddit icon
        tnc.querySelector('.score').textContent = this.score;
        tnc.querySelector('.comments').textContent = this.commentsAmount;
        tnc.querySelector('.time').textContent = this.timeCreatedString;
        const pc = tnc.querySelector('.post-content')
        if (this.postType === "text") {
            const html = `<p class="darkgray"></p>`
            pc.insertAdjacentHTML("afterbegin", html)
            pc.querySelector("p").innerHTML = this.postContent
        }
        else if (this.postType === "image") {
            const html = `<img src="${this.postContent}">`
            pc.insertAdjacentHTML("afterbegin", html)
        }
        else if (this.postType === "link") {
            const html = `<p><a href="${this.postContent}">${this.postContent}</a></p>`
            pc.insertAdjacentHTML("afterbegin", html)
        }

        const outerContainer = tnc.querySelector(".post-main")

        // add event listeners
        // using "this" selectors make styling easier
        this.upvoteBtn = tnc.querySelector(".upvote")
        this.upvoteIcon = this.upvoteBtn.querySelector("img")
        this.downvoteBtn = tnc.querySelector(".downvote")
        this.downvoteIcon = this.downvoteBtn.querySelector("img")
        this.upvoteBtn.addEventListener("click", () => this.upvote())
        this.downvoteBtn.addEventListener("click", () => this.downvote())
        outerContainer.addEventListener("farLeftSwipe", () => this.downvote())
        outerContainer.addEventListener("leftSwipe", () => this.upvote())
        //tnc.addEventListener("rightSwipe", () => this.reply()) // TODO: add reply function
        outerContainer.addEventListener("farRightSwipe", () => this.savePost()) // TODO: add working save function
        outerContainer.addEventListener("click", (e) => this.openPost(e))

        this.ellipsisMenu = tnc.querySelector(".ellipsis")
        this.ellipsisMenu.addEventListener("click", () => this.createMenu())

        // Append the filled template to the document
        document.body.querySelector("main").appendChild(tnc);

        this.updateButtonStyles()
    }

    fillInPost() {
        const template = `
        <div class="post-full-content">
            <h2 class="post-title"></h2>
            <div class="post-body">
            </div>
            <div class="post-footer darkgray">
                <p class="subname-username bold">in <span class="subname"></span> by <span class="username"></span></p>
                <p class="post-icons">
                    <img class="icon-darkgray" alt="upvote icon" src="../icons/arrowup.svg"> <span class="upvote-count"></span>
                    <img class="icon-darkgray" alt="smiley face" src="../icons/smileyface.svg" alt="smiley face"> <span class="upvote-percent"></span>
                    <img class="icon-darkgray" alt="message bubble" src="../icons/message.svg" alt="messages"> <span class="comment-count"></span>
                </p>
            </div>
        </div>
        `
        // copy the template
        const commentTemplate = document.getElementById("post-body-template");
        const ptc = commentTemplate.content.cloneNode(true); // post template clone

        // fill in info
        ptc.querySelector(".post-title").textContent = this.title
        ptc.querySelector(".post-body").innerHTML = this.postContent
        ptc.querySelector(".subname").textContent = this.subName
        ptc.querySelector(".username").textContent = this.OPUsername

        // add actions

        // append to main
        document.querySelector("main").appendChild(ptc)

    }

    static fromJSON(serializedJson) { // see https://stackoverflow.com/questions/43626064/parsing-es6-class-objects-from-localstorage-doesnt-include-class-functions
        return Object.assign(new Post(), JSON.parse(serializedJson))
    }
}

export class Comment {
    constructor(username, body, id, parentId, likes, saved, depth, score, created, edited, r){
        this.username = username; // str
        this.body = body; // str
        this.id = id // str
        this.parentId = parentId // str
        this.depth = depth // int
        this.score = score // int
        this.created = created // int
        this.edited = edited // int
        this.r = r // Snoowrap
        this.actions = new UserActions(likes === true, likes === false, false, false, saved); // see UserInteractions class
    }

    upvote(){
        if (this.actions.downvoted) this.scoreSpan.innerText = Number(this.scoreSpan.innerText) + 1
        if (!this.actions.upvoted) {
            this.scoreSpan.innerText = Number(this.scoreSpan.innerText) + 1
            this.actions.upvoted = true
            this.actions.downvoted = false
            this.r.getSubmission(this.id).upvote()
        }
        else {
            this.scoreSpan.innerText = Number(this.scoreSpan.innerText) - 1
            this.actions.upvoted = false
            this.r.getSubmission(this.id).upvote()
        }
        this.updateIconStyle()
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
        this.updateIconStyle()
        this.removeMenu()
    }

    createComment(){
        // copy the template
        const commentTemplate = document.getElementById("comment-template");
        const ctc = commentTemplate.content.cloneNode(true); //thumbNailClone

        // fill in the info
        const commentDiv = ctc.querySelector(".comment")
        ctc.querySelector(".comment-username").textContent = this.username;
        ctc.querySelector(".comment-upvotes").textContent = this.score;
        //ctc.querySelector(".comment-time").textContent = this.timeSincePost TODO: fill in
        ctc.querySelector(".comment-body").innerHtml = this.body

        this.voteIcon = ctc.querySelector(".vote-icon")
        this.scoreSpan = ctc.querySelector(".comment-score")

        if (this.depth > 0) {
            commentDiv.setAttribute("data-parent-comment", this.parentId)
            commentDiv.setAttribute("top", "false")
        }
        else {
            commentDiv.setAttribute("top", "true")
        }

        // add actions TODO: Add username clicked action & menu actions
        commentDiv.addEventListener("farLeftSwipe", () => this.downvote())
        commentDiv.addEventListener("leftSwipe", () => this.upvote())
        //commentDiv.addEventListener("farRightSwipe", () => this.reply()) // TODO: Add reply and collapse functions
        //commentDiv.addEventListener("rightSwipe", () => this.collapseToTop())

        // append the template to the comments
        document.querySelector(".comments").appendChild(ctc)

        this.updateIconStyle()
    }

    removeMenu(){

    }

    updateIconStyle(){
        this.voteIcon.classList.remove("icon-upvote-orange", "icon-downvote-cobalt", "icon-darkgray")
        this.scoreSpan.classList.remove("upvote-orange", "downvote-cobalt", "darkgray")
        if (this.actions.upvoted){
            this.voteIcon.classList.add("icon-upvote-orange")
            this.scoreSpan.classList.add("upvote-orange")
        }
        else if (this.actions.downvoted){
            this.voteIcon.classList.add("icon-downvote-cobalt")
            this.scoreSpan.classList.add("downvote-cobalt")
        }
        else {
            this.voteIcon.classList.add("icon-darkgray")
            this.scoreSpan.classList.add("darkgray")
        }
    }
}

export class UserActions {
    constructor(upvoted=false, downvoted=false, viewed=false, clicked=false, saved=false) {
        this.upvoted = upvoted; // bool
        this.downvoted = downvoted; // bool
        this.viewed = viewed; // bool
        this.clicked = clicked // bool
        this.saved = saved; // bool
    }
}