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

    const previous = document.createElement('li');
    if(page==1){
        previous.className = "page-item disabled";

    }else {
        previous.className = "page-item ";
        previous.addEventListener('click', () => load_posts(addon,page-1));
    }
    const page_a_previous = document.createElement('a');
    page_a_previous.className="page-link";

    page_a_previous.href="#";
    page_a_previous.innerHTML="Previous";
    previous.append(page_a_previous);
    page_list.append(previous);

    for(let item=1; item<=num_pages; item++){
        const page_icon = document.createElement('li');
        if(item==page){
            page_icon.className="page-item active";

        }else {
            page_icon.className="page-item ";
            page_icon.addEventListener('click', () => load_posts(addon,item));
        }
        const page_a = document.createElement('a');
        page_a.className="page-link";
        page_a.href="#";
        page_a.innerHTML = item;
        page_icon.append(page_a);
        


    }

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

function show_profile(creator_id){
    load_posts(`?profile=${creator_id}`,1);
    document.querySelector('#newPost').style.display = 'none';
    follow_button = document.getElementById('follow-button');
    follow_button.style.display = 'none';
    document.querySelector('#profile').style.display = 'block';
    fetch(`/profile/${creator_id}`)
    .then(response => response.json())
    .then(profile => {
        document.getElementById('following-amount').innerHTML = profile.following;
        document.getElementById('following-amount').innerHTML = profile.followers;
        document.getElementById('profile_username').innerHTML = profile.profile_username;
        if(profile.follow_available){
            follow_button.style.display = 'unset';
            if(profile.currently_following){
                follow_button.innerHTML = 'Unfollow';

            }else {
                follow_button.innerHTML = 'Follow';
            }
            follow_button.addEventListener('click', () => update_follow(creator_id));
        }
    })
    window.scrollTo(0,0);
}