const list = document.querySelector(".comments")
new Slip(list)
let lastSwipeDistance = 1000; // any number greater than threshold
const thresholdVal = 350; // in px
let selectedAction = null;

list.addEventListener('slip:beforereorder', function(e) {
    e.preventDefault();
});

list.addEventListener('slip:beforeswipe', function(e) {
    removeActions()
});

list.addEventListener('slip:swipe', function (e){
    e.preventDefault();
    const node = e.target;
    const event = new CustomEvent(selectedAction + "Swipe")
    node.dispatchEvent(event)
    removeActions()
})

function removeActions(){
    selectedAction = null
    let la = document.querySelector(".left-action")
    let ra = document.querySelector(".right-action")
    if (la) la.remove()
    if (ra) ra.remove()
}

list.addEventListener('slip:cancelswipe', removeActions)

list.addEventListener('slip:leftaction', function (e){
    let ra = document.querySelector(".right-action")
    if (ra) ra.remove()
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

    const a = e.target.getBoundingClientRect()
    let ra = document.querySelector(".right-action")
    if (!ra) {
        const rightActionMenu =
            `<div class="right-action flex">
            <img class="icon-white" alt="collapse" src="../icons/chevronup.svg" style="height: 50px; max-width: 50px;">
            </div>`
        e.target.insertAdjacentHTML("beforebegin", rightActionMenu)
        ra = document.querySelector(".right-action")
    }
    ra.style = `width:${a.x * -1}px; z-index: 99; height: ${a.height}px; position: fixed; top: ${a.top}px; right: 0; align-items: center; justify-content: center`
    const isFarRightAction = e.detail.transformVal > thresholdVal;
    ra.style.backgroundColor = isFarRightAction ? "#57B2F9" : "#3578F7"
    selectedAction = isFarRightAction ? "farRight" : "right"
    if ((lastSwipeDistance > thresholdVal && e.detail.transformVal < thresholdVal) || (lastSwipeDistance < thresholdVal && e.detail.transformVal > thresholdVal)){
        ra.querySelector("img").src = isFarRightAction ? "../icons/reply.svg" : "../icons/chevronup.svg"
        ra.querySelector("img").alt = isFarRightAction ? "down arrow" : "up arrow"
    }
    lastSwipeDistance = e.detail.transformVal
})