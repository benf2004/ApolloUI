const list = document.querySelector(".comments")
new Slip(list)

list.addEventListener('slip:beforereorder', function(e) {
    e.preventDefault();
});


list.addEventListener('slip:swipe', function (e){
    removeActions()
    e.preventDefault();
})

function removeActions(){
    let la = document.querySelector(".left-action")
    let ra = document.querySelector(".right-action")
    if (la) la.remove()
    if (ra) ra.remove()
}

list.addEventListener('slip:cancelswipe', removeActions)

list.addEventListener('slip:leftaction', function (e){
    const a = e.target.getBoundingClientRect()
    let la = document.querySelector(".left-action")
    if (!la) {
        const leftActionMenu =
            `<div class="left-action flex">
            <img class="icon-white" src="" height="50px;">
            </div>`
        e.target.insertAdjacentHTML("beforebegin", leftActionMenu)
        la = document.querySelector(".left-action")
    }
    la.style = `width:${a.x}px; z-index: 99; height: ${a.height}px; position: fixed; top: ${a.top}px; left: 0; margin-right: 50px; align-items: center; justify-content: center`
    la.style.backgroundColor = e.detail.transformVal > 250 ? "#585FDB" : "#EC682C"
    la.querySelector("img").src = e.detail.transformVal > 250 ? "../icons/arrowdown.svg" : "../icons/arrowup.svg"
})