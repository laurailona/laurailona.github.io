//Search bar hide and show
let searchIcon = document.getElementById("search-icon")
let searchBar = document.getElementById("search-bar");
let closeButton = document.getElementById("close-button");

function hideSearchIcon() {
  searchIcon.classList.add("hidden-icon");
  searchBar.classList.add("visible-search-bar");
  closeButton.classList.add("visible-close-button");
}

function showSearchIcon() {
   searchIcon.classList.remove("hidden-icon");
   searchBar.classList.remove("visible-search-bar");
  closeButton.classList.remove("visible-close-button");
}

searchIcon.addEventListener("click", hideSearchIcon);
closeButton.addEventListener("click", showSearchIcon);

//Preparing JSON function to display results
let searchResults = document.getElementById("search-results");
let input = "";
let url = "";

function displayResults() {
  $.getJSON(url, function(result) {
    document.getElementById("search-results").innerHTML = ""; //removing previous search-results, if any
    for(let i = 0; i < result[1].length; i++) {
      let div = document.createElement("div");
      div.classList.add("single-result");

      let title = document.createElement("h2");
      title.textContent = result[1][i];

      let link = document.createElement("a");
      link.setAttribute("href", result[3][i]);
      link.setAttribute("target", "_blank");
      link.innerHTML = "<button>Read full article</button>"

      let excerpt = document.createElement("p");
      excerpt.textContent = result[2][i];

      div.appendChild(title);
      div.appendChild(excerpt);
      div.appendChild(link);
      searchResults.appendChild(div);
    }
  });
  searchResults.classList.add("show-results");
  }

//getting input value and executing JSON function
let firstSearch = true;
  document.addEventListener('keydown', function(event){
    if (event.keyCode === 13) {
      document.getElementById("search-results").classList.remove("show-results");
      function showResults() {
        input = document.getElementById('search-bar').value;
        url = "https://en.wikipedia.org/w/api.php?action=opensearch&format=json&origin=*&search=" + input;
        displayResults();
        firstSearch = false;
      }
      if(firstSearch){
        showResults();
      }
      else {
        setTimeout(showResults, 300); //allowing old results to fadeout before blending in new results
      }
    }
  });
