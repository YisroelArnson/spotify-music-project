// Date selector functions
//For this function to work, the class names and Ids must match this format. [month, range, all-time]-...
var devMode = true;
if(devMode) {
    var baseUrl = "http://localhost:5000";
} else {
    var baseUrl = "https://spotifyplaylistcreator.herokuapp.com"
}

var masterTrackList = [];
var offset = 0;
var access_token;

function navBarSelectDetector(option) {
    document.getElementById('month-button').className = 'button'
    document.getElementById('range-button').className = 'button'
    document.getElementById('all-time-button').className = 'button'

    

    document.getElementById(option+"-button").className = 'button button-active'


    var divsToHide = document.getElementsByClassName("select-element"); //divsToHide is an array
    for(var i = 0; i < divsToHide.length; i++){
        if(divsToHide[i].classList.contains(option+"-select-groups")) {
            divsToHide[i].style.display = "block"; // depending on what you're doing
        } else {
            divsToHide[i].style.display = "none"; // depending on what you're doing
        }
    }
}

function setDateValues() {
    //Month
    monthStartMonth = document.getElementById("start-month-list").value;
    monthEndYear = document.getElementById("start-year-list").value;
    //Range
    rangeStartMonth = document.getElementById("range-start-month-list").value;
    rangeStartYear = document.getElementById("range-start-year-list").value;

    rangeEndMonth = document.getElementById("range-end-month-list").value;
    rangeEndYear = document.getElementById("range-end-year-list").value;
    console.log("Month: " + monthStartMonth + "-" + monthEndYear)
    console.log("Range: " + rangeStartMonth + "-" + rangeStartYear + ", " + rangeEndMonth + "-" + rangeEndYear)
}

function getAccessToken() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get('code');
    console.log(baseUrl)
    fetch(baseUrl + '/auth/access_token', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            code: code
        })
    }).then(response => {
        console.log(response)
        return response.json()
    }).then(data => {
        if (data.data.error) {
            window.location = baseUrl + "/auth"
        } else {
            access_token = data.data.access_token
            getAllLikedSongs();
        }
    })
    .catch(err => {
        console.log(err)
    })

}

function fetchSongs(limit) {
    const controller = new AbortController();
    const signal = controller.signal;
    return fetch('https://api.spotify.com/v1/me/tracks?limit=' + limit + '&offset=' + offset, {
            method: 'GET',
            signal: signal,
            headers: {
                'Authorization': 'Bearer ' + access_token
            }
        }).then(response => {
            console.log(response)   
            return response.json()  
        }).then(data => {
            return data
        })
}

function getAllLikedSongs() {
    const limit = 50;
    let likedSongsPlaylistCount = 0;
    //Start loading animation here
    fetchSongs(limit).then(data => {
        if(likedSongsPlaylistCount = 0) {
            likedSongsPlaylistCount = data.total;
        }
        offset += limit;   
        if(offset >= likedSongsPlaylistCount) {
            doneFetchingSongs = false;
            lastLoadedDate = new Date(data.items[data.items.length - 1].added_at.split('-')[0], data.items[data.items.length - 1].added_at.split('-')[1], data.items[data.items.length - 1].added_at.split('-')[2].split('T')[0])
            
            console.log(lastLoadedDate)

            masterTrackList = masterTrackList.concat(data.items)
            getAllLikedSongs();
        } else {
            console.log(masterTrackList)
            //end loading animation here
        }
    }).catch(error => {
        console.log(error)
    })
}

