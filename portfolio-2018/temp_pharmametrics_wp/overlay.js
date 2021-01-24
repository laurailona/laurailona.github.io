/* Overlay Button (Disclaimer) */

var disclaimerOverlay = document.querySelector('#disclaimer');
var hideOverlayButton = document.querySelector('#close-disclaimer');
var showDisclaimerButton = document.querySelector('#show-disclaimer');
var cookieButton = document.querySelector('#cn-more-info');
var body = document.querySelector('body');


function hideDisclaimer() {
  disclaimerOverlay.setAttribute("style", "display:none");
  hideOverlayButton.setAttribute("style", "display:none");
  body.setAttribute("style", "overflow:auto");
}

function showDisclaimer() {
  disclaimerOverlay.setAttribute("style", "display:block");
  hideOverlayButton.setAttribute("style", "display:block");
  body.setAttribute("style", "overflow:hidden");
}

hideOverlayButton.addEventListener("click", hideDisclaimer);
showDisclaimerButton.addEventListener("click", showDisclaimer);
cookieButton.addEventListener("click", function(event){
  event.preventDefault()
  disclaimerOverlay.setAttribute("style", "display:block");
  hideOverlayButton.setAttribute("style", "display:block");
  body.setAttribute("style", "overflow:hidden");
});
