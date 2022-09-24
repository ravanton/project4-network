from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

from .models import User


def index(request):
    return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

@login_required

def load_followed_posts(request):
    followed_profiles = request.user.get_followed_profiles.all()
    print(followed_profiles)
    posts = Post.objects.filter(creator__in = followed_profiles).all()
    return paginated_posts(request,posts)

def load_posts(request):
    profile = request.GET.get("profile", None)
    if(profile):
        post = Post.objects.filter(creator=profile).all()
    else:
        posts = Post.objects.all()
    return paginated_posts(request,posts)

def paginated_posts(request,posts):
    posts = posts.order_by("-created_date").all()
    paginator = Paginator(post,10)
    page_obj = paginator.get_page(request,GET["page"])
    return JsonResponse({
        "post": [post.serialize(request.user) for post in page_obj],
        "num_pages": paginator.num_pages
        }
        , safe=False)

def profile(request,user_id):
    profile = Profile.object.filter(id=user_id).first()
    return Jsonresponse(profile.serialize(request.user,status = 200))