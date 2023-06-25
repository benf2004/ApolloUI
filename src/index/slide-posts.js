const list = document.querySelector("main")
new Slip(list)
let lastSwipeDistance = 1000; // any number greater than threshold
const thresholdVal = 400; // in px
let selectedAction = null;

list.addEventListener('slip:beforereorder', function(e) {
    e.preventDefault();
});

list.addEventListener('slip:beforeswipe', function(e) {
    removeActions(e.target)
});

list.addEventListener('slip:swipe', function (e){
    e.preventDefault(); // makes it so swipe doesn't remove the post. see slip.js docs.
    const node = e.target;
    const event = new CustomEvent(selectedAction + "Swipe")
    node.dispatchEvent(event)
    removeActions(e.target)
})

function removeActions(node){
    selectedAction = null
    let la = document.querySelector(".left-action")
    let ra = document.querySelector(".right-action")
    if (la) la.remove()
    if (ra) ra.remove()
    setTimeout(() => node.classList.remove("do-not-open"), 500)
}

list.addEventListener('slip:cancelswipe', function (e){
    removeActions(e.target)
})

list.addEventListener('slip:leftaction', function (e){
    let ra = document.querySelector(".right-action")
    if (ra) ra.remove()

    e.target.classList.add("do-not-open")

    const a = e.target.getBoundingClientRect()
    let la = document.querySelector(".left-action")
    if (!la) {
        const leftActionMenu =
            `<div class="left-action flex">
            <img class="icon-white" alt="up arrow" src="../icons/arrowup.svg" style="height: 50px">
            </div>`
        e.target.insertAdjacentHTML("beforebegin", leftActionMenu)
        la = document.querySelector(".left-action")
    }
    la.style = `width:${a.x}px; z-index: 99; height: ${a.height}px; position: fixed; top: ${a.top}px; left: 0; align-items: center; justify-content: center`
    const isFarLeftAction = e.detail.transformVal > thresholdVal;
    la.style.backgroundColor = isFarLeftAction ? "#585FDB" : "#EC682C"
    selectedAction = isFarLeftAction ? "farLeft" : "left"
    if ((lastSwipeDistance > thresholdVal && e.detail.transformVal < thresholdVal) || (lastSwipeDistance < thresholdVal && e.detail.transformVal > thresholdVal)){
        la.querySelector("img").src = isFarLeftAction ? "../icons/arrowdown.svg" : "../icons/arrowup.svg"
        la.querySelector("img").alt = isFarLeftAction ? "down arrow" : "up arrow"
    }
    lastSwipeDistance = e.detail.transformVal
})

list.addEventListener("slip:rightaction", function (e){
    let la = document.querySelector(".left-action")
    if (la) la.remove()

    e.target.classList.add("do-not-open")

    const a = e.target.getBoundingClientRect()
    let ra = document.querySelector(".right-action")
    if (!ra) {
        const rightActionMenu =
            `<div class="right-action flex">
            <img class="icon-white" alt="collapse" src="../icons/reply.svg" style="height: 50px; max-width: 50px;">
            </div>`
        e.target.insertAdjacentHTML("beforebegin", rightActionMenu)
        ra = document.querySelector(".right-action")
    }
    ra.style = `width:${a.x * -1}px; z-index: 99; height: ${a.height}px; position: fixed; top: ${a.top}px; right: 0; align-items: center; justify-content: center`

    const isFarRightAction = e.detail.transformVal > thresholdVal;
    ra.style.backgroundColor = isFarRightAction ? "#56BB36" : "#57B2F9"
    selectedAction = isFarRightAction ? "farRight" : "right"
    if ((lastSwipeDistance > thresholdVal && e.detail.transformVal < thresholdVal) || (lastSwipeDistance < thresholdVal && e.detail.transformVal > thresholdVal)){
        ra.querySelector("img").src = isFarRightAction ? "../icons/bookmark.svg" : "../icons/reply.svg"
        ra.querySelector("img").alt = isFarRightAction ? "down arrow" : "up arrow"
    }
    lastSwipeDistance = e.detail.transformVal
})