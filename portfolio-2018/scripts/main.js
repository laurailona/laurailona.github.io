$(document).ready(function(){
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

//jQuery smooth scrolling
  $("a").on('click', function(event) {
    if (this.hash !== "") {
      event.preventDefault();

      var hash = this.hash;

      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 800, function(){

        window.location.hash = hash;
      });
    }
  });

});
