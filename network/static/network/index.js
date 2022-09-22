document.addEventListener("DOMContentLoaded", function(){
    document.querySelector('#profile').style.display = 'none';
    window.history.pushState('The Network', 'The Network', 'http://127.0.0.1:8000/');
    if(document.getElementById('following')) {
        document.getElementById('following').addEventListener('click', () => load_posts ("/followed",1));

    }else {
        document.getElementById('newPost').addEventListener('click', () => force_login());

    }
    load.posts("",1);
});

function load_posts(addon,page){
    if(addon.includes("?")) {
        addon += `&page = ${page}`;
    }else {
        document.querySelector('#profile').style.display = 'none';
        addon += `?page = ${page}`;
    }
    console.log(`access ${addon}`);
    fetch(`/load ${addon}`)    
    .then(response => response.jsone())
    .then(response => {
        document.getElementById('post').innerHTML ="";
        build_paginator(addon, page, response.num_pages);
        response.posts.forEach(post => build.post(post));
    })

}
