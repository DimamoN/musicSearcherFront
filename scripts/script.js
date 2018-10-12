const SEARCH_TRACK_URL = 'https://music-searcher.herokuapp.com/google_music/search/';

let searchButton = document.getElementById('searchBtn');
let searchInput = document.getElementById('searchInput');

let resultDiv = document.getElementById('result');
resultDiv.hidden = true;

let resultTrackLink = document.getElementById('resultTrackLink');
let resultAlbumLink = document.getElementById('resultAlbumLink');
let resultTrackLinkIndicator = document.getElementById('resultTrackLinkIndicator');

let resultTrackArtist = document.getElementById('resultTrackArtist');
let resultTrackName = document.getElementById('resultTrackName');

// controls
let play = document.getElementById("play");
let pause = document.getElementById("pause");

let audio = new Audio('');

// execute a function when the user releases a key on the keyboard
searchInput.addEventListener("keyup", function (event) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Number 13 is the "Enter" key
    if (event.keyCode === 13) {
        // Trigger the button element with a click
        searchButton.click();
    }
});

// play control by space
window.addEventListener("keyup", function(event) {

  // disable if focus is on input
  if (document.activeElement === searchInput) {
    return;
  }

  event.preventDefault();
  // Number 32 is the "Space" key
  if (event.keyCode === 32) {
      playStop();
    }
});

play.addEventListener("click", (event) => playStop());
pause.addEventListener("click", (event) => playStop());


let HttpClient = function () {
    this.get = function (aUrl, aCallback) {
        let anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function () {
            if (anHttpRequest.readyState === 4 && anHttpRequest.status === 200)
                aCallback(anHttpRequest.responseText);
        };
        anHttpRequest.open("GET", aUrl, true);
        anHttpRequest.send(null);
    }
};

searchButton.onclick = function () {
    const requestString = searchInput.value;
    console.log("Sending request:" + requestString + " to: " + SEARCH_TRACK_URL);
    let client = new HttpClient();
    client.get(SEARCH_TRACK_URL + requestString, function (response) {
        showMessage(response);
    });
};

function showMessage(response) {
    console.log("Response:" + response);

    if (response == null) {
        resultTrackLinkIndicator.innerHTML = "Error";
    }
    else {
        const result = JSON.parse(response);
        console.log("Response:" + result);

        resultTrackLink.href = result.streamUrl;
        resultAlbumLink.href = result.albumUrl;

        // below player
        resultTrackArtist.innerHTML = result.artistName;
        resultTrackName.innerHTML = result.trackName;


        audio.pause();
        audio = new Audio(result.streamUrl);
        audio.volume = 0.8;

        // set art
        cover.style.backgroundImage = 'url(' + result.albumArtUrl + ')';

        resultDiv.hidden = false;

        audio.play();
        $('.fa-pause').show();
        $('.fa-play').hide();
        $('.music-card').addClass('playing');
    }
}

// Player control

function playStop() {
  if (audio.paused === false) {
      audio.pause();
      $('.fa-play').show();
      $('.fa-pause').hide();
      $('.music-card').removeClass('playing');
  } else {
      audio.play();
      $('.fa-pause').show();
      $('.fa-play').hide();
      $('.music-card').addClass('playing');
  }
}

$('.trigger').click(playStop);
