//Show-Hide top navigation
var showMenuButton = document.getElementById("show-menu-button");
var topNav = document.getElementById("top-nav");
var menuVisible = false;

function showMenu() {
  if (menuVisible) {
    topNav.classList.remove("menu-visible");
    menuVisible = false;
  }
  else {
    topNav.classList.add("menu-visible");
    menuVisible = true;
  }
}

showMenuButton.addEventListener("click", showMenu);
