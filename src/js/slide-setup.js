const list = document.querySelector("main")
new Slip(list)

list.addEventListener('slip:beforereorder', function(e) {
    e.preventDefault();
});

list.addEventListener('slip:swipe', function (e){
    e.preventDefault();
})