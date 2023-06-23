const list = document.querySelector(".comments")
new Slip(list)

list.addEventListener('slip:beforereorder', function(e) {
    e.preventDefault();
});


list.addEventListener('slip:swipe', function (e){
    console.log(e.target.style.transform)
    e.preventDefault();
})