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
var displayedSongListingStart = 0;
var amountSongListingAmount = 50;
var currentDisplayedSongList = [];

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

function clearSongListingContainer() {
    displayedSongListingStart = 0;
    document.getElementById("song-listing-container").innerHTML = ""
}

function finishedLoadingSongsAnimation() {
    document.getElementById('search-button').className = 'button button-dark'
    document.getElementById('add-playlist-button').className = 'button button-dark'
}

function startSearch() {
    let filteredSongs = [];
    if(finishedFetchingLikedSongs) {
        clearSongListingContainer()
        if(searchMode == "month") {
            filteredSongs = filterSongsByMonth()
        } else if(searchMode == "range") {
            filteredSongs = filterSongsByRange()
        } else {
            filteredSongs = filterSongsByAllTime()
        }
        displaySongsData(filteredSongs);
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
            finishedLoadingSongsAnimation();
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
    // if(finishedFetchingLikedSongs) {
        let filteredSongs = [];
        let dateValues = setDateValues();
        for(let i = 0; i < masterTrackList.length; i++) {
            let songDate = new Date(masterTrackList[i].added_at.split('-')[0], masterTrackList[i].added_at.split('-')[1] - 1, masterTrackList[i].added_at.split('-')[2].split('T')[0], 0, 0, 0, 0)
            if(songDate.getUTCMonth() == dateValues[0] && songDate.getUTCFullYear() == dateValues[1]) {
                filteredSongs.push(masterTrackList[i])
                // console.log(masterTrackList[i], "Song is in range")
            }    
        }
        console.log(filteredSongs)     
        displaySongs(filteredSongs)   
        return filteredSongs;
}

function filterSongsByRange() {
    //Requires two sets of dates and comparing if the song is between the two. So convert to miliseconds
    let filteredSongs = [];
    let dateValues = setDateValues();
    let startDate = new Date (dateValues[3], dateValues[2], 1, 0, 0, 0, 0)
    let endDate = new Date (dateValues[5], dateValues[4], 1, 0, 0, 0, 0)
    for(let i = 0; i < masterTrackList.length; i++) {
        let songDate = new Date(masterTrackList[i].added_at.split('-')[0], masterTrackList[i].added_at.split('-')[1] - 1, masterTrackList[i].added_at.split('-')[2].split('T')[0], 0, 0, 0, 0)
    
        if(songDate.getTime() >= startDate.getTime() && songDate.getTime() <= endDate.getTime()) {
            filteredSongs.push(masterTrackList[i])
        }
    }
    console.log(filteredSongs);
    displaySongs(filteredSongs)   
    return filteredSongs;

}

function filterSongsByAllTime() {
    let filteredSongs = masterTrackList;
    displaySongs(filteredSongs)
    return filteredSongs;

}

function displaySongs(songList) {
    //display first 50 songs
    //Then when users scrolls to bottom of those songs, display 50 more, etc. If it gets too laggy with a lot of songs, then undisplay songs above the fold as users's scrool
    currentDisplayedSongList = songList;
    if(songList.length > 0) {
        for(let i = displayedSongListingStart; i < (displayedSongListingStart + amountSongListingAmount); i++) {
            if(currentDisplayedSongList[i]) {
                let artistList = [];
                for(let j = 0; j < currentDisplayedSongList[i].track.artists.length; j++) {
                    artistList.push(currentDisplayedSongList[i].track.artists[j].name)
                }
        
                if(i < songList.length) {
                    document.getElementById("song-listing-container").innerHTML +=
                    `
                    <div class="song-listing">
                        <h5 class="gray">${i+1}</h5>
                        <div class="song-image"><img src="${songList[i].track.album.images[2].url}"></div>
                        <div class="song-text-container">
                                <h5 class="song-name bold">${songList[i].track.name}</h5>
                                <h5 class="song-artist gray">${artistList.join(", ")}</h5>
                        </div>
                        <h5 class="song-albumn gray">${songList[i].track.album.name}</h5>
                        <a href="${songList[i].track.external_urls.spotify}" target="_blank"><div class="shift-arrow-button"><img src="assets/icons/up arrow.svg" alt=""></div></a>
                    </div>
                    `
                }
            }
        }
        const elements = document.getElementsByClassName("add-songs-button-container");
        while(elements.length > 0){
            elements[0].parentNode.removeChild(elements[0]);
        }
    
        if((displayedSongListingStart + amountSongListingAmount) < songList.length) {
            document.getElementById("song-listing-container").innerHTML +=
            `
            <div class="add-songs-button-container">
                <button onClick="displayMoreSongs()" class="display-more-songs-button">+</button>
            </div>
            `
        }
    }
    
}

function displayMoreSongs() {
    displayedSongListingStart += amountSongListingAmount;
    displaySongs(currentDisplayedSongList)
}

function getAverageOfList(list) {
    let total = 0;
    for(let i = 0; i < list.length; i++) {
        total += parseInt(list[i])
    }
    return (total / list.length);
}

function displaySongsData(filteredSongs) {
    //Count of unique artists
    let artistList = [];
    let releaseYearList = [];
    let popularityList = [];
    for(let i = 0; i < filteredSongs.length; i++) {
        for(let j = 0; j < filteredSongs[i].track.artists.length; j++) {
            artistList.push(filteredSongs[i].track.artists[j].name)
        }
        releaseYearList.push(filteredSongs[i].track.album.release_date.substr(0, 4))
        popularityList.push(filteredSongs[i].track.popularity);
    }
    const uniqueArtistCount = new Set(artistList).size;

        

    document.getElementById('total-songs-stat').innerHTML = filteredSongs.length;
    document.getElementById('unique-artists-stat').innerHTML = uniqueArtistCount;
    document.getElementById('release-year-average-stat').innerHTML = parseInt(getAverageOfList(releaseYearList));
    document.getElementById('popularity-average-stat').innerHTML = parseInt(getAverageOfList(popularityList)) + "/100";
   
}