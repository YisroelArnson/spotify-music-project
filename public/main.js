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
var searchMode = "month";
var finishedFetchingLikedSongs = false;

function navBarSelectDetector(option) {
    document.getElementById('month-button').className = 'button'
    document.getElementById('range-button').className = 'button'
    document.getElementById('all-time-button').className = 'button'

    

    document.getElementById(option+"-button").className = 'button button-active'

    searchMode = option;

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
    monthMonth = getMonthFromString(document.getElementById("start-month-list").value);
    monthYear = document.getElementById("start-year-list").value;
    //Range
    rangeStartMonth = getMonthFromString(document.getElementById("range-start-month-list").value);
    rangeStartYear = document.getElementById("range-start-year-list").value;

    rangeEndMonth = getMonthFromString(document.getElementById("range-end-month-list").value);
    rangeEndYear = document.getElementById("range-end-year-list").value;
    // console.log("Month: " + monthMonth + "-" + monthYear)
    // console.log("Range: " + rangeStartMonth + "-" + rangeStartYear + ", " + rangeEndMonth + "-" + rangeEndYear)
    return ([monthMonth, monthYear, rangeStartMonth, rangeStartYear, rangeEndMonth, rangeEndYear])
}

function startSearch() {
    if(searchMode == "month") {
        filterSongsByMonth()
    } else if(searchMode == "range") {
        filterSongsByRange()
    } else {
        console.log("Searching in all time")
    }
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
            // console.log(response)   
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
        likedSongsPlaylistCount = data.total;
        offset += limit;   
        if(masterTrackList.length != likedSongsPlaylistCount) {
            doneFetchingSongs = false;
            lastLoadedDate = new Date(data.items[data.items.length - 1].added_at.split('-')[0], data.items[data.items.length - 1].added_at.split('-')[1] - 1, data.items[data.items.length - 1].added_at.split('-')[2].split('T')[0])
            
            // console.log(lastLoadedDate)

            masterTrackList = masterTrackList.concat(data.items)
            getAllLikedSongs();
        } else {
            console.log(masterTrackList)
            finishedFetchingLikedSongs = true;
            //end loading animation here
        }
    }).catch(error => {
        console.log(error)
    })
}

function getMonthFromString(mon) {
    var date = new Date(Date.parse(mon + " 1, 2012")).getMonth()
    // if (("" + date).length == 1) {
    //     return "0" + date;
    // }
    return date;
}

function filterSongsByMonth() {
    //match up the dates from songs to the dates inputed by user. Ensure that they are comparable with == or > or <
    // console.log(new Date(2021, 0, 1))
    //go through the masterTrackList and check if songs have been added in that month-year, if yes add to var filteredSongs, if not move on.
    //Display songs 50/filteredSongs.count    
    if(finishedFetchingLikedSongs) {
        let filteredSongs = [];
        let dateValues = setDateValues();
        for(let i = 0; i < masterTrackList.length; i++) {
            let songDate = new Date(masterTrackList[i].added_at.split('-')[0], masterTrackList[i].added_at.split('-')[1] - 1, masterTrackList[i].added_at.split('-')[2].split('T')[0], 0, 0, 0, 0)
            if(songDate.getUTCMonth() == dateValues[0] && songDate.getUTCFullYear() == dateValues[1]) {
                filteredSongs.push(masterTrackList[i])
                console.log(masterTrackList[i], "Song is in range")
            }    
        }
        console.log(filteredSongs)        
    }
}

function filterSongsByRange() {
    //Requires two sets of dates and comparing if the song is between the two. So convert to miliseconds
    let filteredSongs = [];
    let dateValues = setDateValues();
    let startDate = new Date (dateValues[3], dateValues[2], 1, 0, 0, 0, 0)
    let endDate = new Date (dateValues[5], dateValues[4], 1, 0, 0, 0, 0)
    for(let i = 0; i < masterTrackList.length; i++) {
        let songDate = new Date(masterTrackList[i].added_at.split('-')[0], masterTrackList[i].added_at.split('-')[1] - 1, masterTrackList[i].added_at.split('-')[2].split('T')[0], 0, 0, 0, 0)
        console.log(startDate.getTime(), endDate.getTime(), songDate.getTime())
    
        if(songDate.getTime() >= startDate.getTime() && songDate.getTime() <= endDate.getTime()) {
            filteredSongs.push(masterTrackList[i])
        }
    }
    console.log(filteredSongs);
}