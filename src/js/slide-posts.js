const list = document.querySelector("main")
new Slip(list)

list.addEventListener('slip:beforereorder', function(e) {
    e.preventDefault();
});

list.addEventListener('slip:swipe', function (e){
    e.preventDefault();
})

list.addEventListener('slip:leftaction', function (e){
    const a = e.target.getBoundingClientRect()
    const leftActionMenu = `<div class="left-action" style="width:a.w; height: ${e.target.style.height}"></div>`
    e.target.insertAdjacentHTML("beforebegin", leftActionMenu)
    const da = document.querySelector(".left-action")
    da.style.borderRight = `${e.detail.transformVal}px solid #EC682C`
})