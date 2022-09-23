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

function build_paginator(addon, page,num_pages){
    page_list = document.getElementById('paginator');
    page.list.innerHTML = "";
}
function build_post(post){
    const post_card = document.createElement('div');
    post_card.className = "card col col-6";

    const header = document.createElement('div');
    header.className = "card-header profile";
    header.innerHTML = post.creator_username;
    post_card.append(header);
    header.addEventListener('click', () => show_profile(post.creator_id));

    const card_body = document.createElement('div');
    card_body.className = "card-body";
    card_body.id =  `post_body_${post.id}`;

    const text = document.createElement('p');
    text.className = "card-text";
    text.id = `content_${post.id}`;
    text.innerHTML = post.content;
    card_body.append(text);
}