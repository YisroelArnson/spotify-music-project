// start fetching all of the users liked songs ASAP
// Save these songs in a master list
// When the user clicks search Search through the master list 
// This prevents the need to fetch the songs for each search and will speed up loading times by A LOT
// What if the user searches for a date that hasn't been loaded yet?
// then set a 3 second timeout and recheck the list. Do this until song date has been found
// or until there are no more songs to fetch from API.


// Searching by month

// Look for songs that have the month that the user is searching for. If the last song of the tracklist is a song with the corresponding month
// then restart the search. 
// Keep checking until we reach the last song of the tracklist. If the last song has the corresponding date then restart the search after 3 seconds. 

    // var baseUrl = "https://spotifyplaylistcreator.herokuapp.com"
    var baseUrl = "http://localhost:5000"
    var access_token = '';
    var month = document.getElementById("month-list").value;
    var year = document.getElementById("year-list").value;
    var specifiedDate = new Date();
    var endMonth = document.getElementById("end-month-list").value;
    var endYear = document.getElementById("end-year-list").value;
    var trackList = [];
    var playlistSongs = [];
    var removedTracks = [];
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get('code');
    var searchFilter = 'month';
    var isLoading = false;
    var monthInMili = 2629746000;
    let offset = 0;
    const limit = 50;
    const controller = new AbortController();
    const signal = controller.signal;
    var fetchingSongs = false;
    var lastLoadedDate;
    var displayedListingIndex = 0;
    var doneFetchingSongs = false;

    $('.toast').toast({
        delay: 4000
    })


    function changeSearchFilter(selector, selectedElemCount) {
        searchFilter = selector
        if (selector == 'range') {
            document.getElementById('end-date-inputs-row').style.display = 'flex'
            document.getElementById('start-indic').style.display = 'flex'
            document.getElementById('end-indic').style.display = 'flex'
        } else {
            document.getElementById('end-date-inputs-row').style.display = 'none'
            document.getElementById('start-indic').style.display = 'none'
            document.getElementById('end-indic').style.display = 'none'
        }

        if(selector == 'all-time') {
            document.getElementById('start-date-inputs-row').style.display = 'none'
        } else {
            document.getElementById('start-date-inputs-row').style.display = 'flex'
        }

        var selecterElems = document.getElementsByClassName('filter-buttons')

        for (var i = 0; i < selecterElems.length; i++) {
            selecterElems[i].classList.remove('filter-buttons-selected');
        }

        selecterElems[selectedElemCount].classList.add('filter-buttons-selected')
    }


    function getMonthVal() {
        month = document.getElementById("month-list").value;
    }


    function getYearVal() {
        year = document.getElementById("year-list").value;
    }

    function getEndMonthVal() {
        endMonth = document.getElementById("end-month-list").value;
    }


    function getEndYearVal() {
        endYear = document.getElementById("end-year-list").value;
    }


    function removeSong(songUri, songId) {
        var clickedListItem = document.getElementsByClassName(songId)[0]
        const index = trackList.indexOf(songUri);
        if (index > -1) {
            trackList.splice(index, 1);
            removedTracks.push({
                songUri: songUri,
                index: index
            })
            clickedListItem.style.opacity = 0.5;
        } else {
            for (var i = 0; i < removedTracks.length; i++) {
                if (removedTracks[i].songUri == songUri) {
                    trackList.splice(removedTracks[i].index, 0, songUri)
                    removedTracks.splice(i, 1)
                    clickedListItem.style.opacity = 1;
                }
            }
        }
    }


    function getToken() {
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


    function createSongListing(song, listingCounter) {
        var trimmedTrackName = song.track.name;
        if (screen.width <= 400) {
            trimmedTrackName = song.track.name.substring(0, 12) + "...";
        }

        document.getElementById("results-container").innerHTML +=
            `
                    <div class="row listing-body justify-content-between align-items-center my-3 px-4  ${song.track.id}">
                        <div class="row align-items-center">
                            <div class="col-1">
                                <h6 class="align-self-center text-muted">${listingCounter}</h6>
                            </div>
                            <div class="col-1">
                                <a class="mx-2" href="${song.track.external_urls.spotify}"  target=_blank>
                                    <img class="align-self-center mx-2 listing-images" width="45" height="45" src="${song.track.album.images[2].url}" />
                                </a>
                            </div>
                        </div>
                         
                        <div class="col-4">
                            <a class="mx-2" href="${song.track.external_urls.spotify}"  target=_blank>
                                <h6>${trimmedTrackName}</h6>
                            </a>
                        </div> 
                        <div class="col-4">
                            <a class="mx-2" href="${song.track.external_urls.spotify}"  target=_blank>
                                <h7>${song.track.artists[0].name}</h7>
                            </a>
                        </div> 
                        <div class="col-2">
                        </div> 
                    </div>
                `
    }


    function clearSongListing() {
        document.getElementById("results-container").innerHTML = ''
    }

    function startSearchAnimation() {
        isLoading = true;
        document.getElementById('search-songs-button').innerHTML = `   <div class="sk-chase">
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
    </div>
    `
    }

    function stopSearchAnimation() {
        isLoading = false;
        document.getElementById('search-songs-button').innerHTML = 'Search'
    }

    //Change search function based on if search is month, range, or all time
    function manageSearchFunction() {
        displayedListingIndex = 0;
        clearSongListing();
        if(searchFilter == 'month') {
            filterBySpecificMonth(); 
            startSearchAnimation();
        }   
        else if(searchFilter == 'range') {
            filterByRange();
            startSearchAnimation();
        } else if(searchFilter == 'all-time') {
            allTimePlaylist();
            startSearchAnimation();
        }
    }

    function filterBySpecificMonth() {
        playlistSongs = [];
        if(access_token != '') {
            specifiedDate = new Date(year, getMonthFromString(month)-1);
            isLoading = true;
            if(Date.parse(specifiedDate) < Date.parse(lastLoadedDate)) {
                setTimeout(function() {
                    filterBySpecificMonth()
                }, 500)
            } else {
                let listingCounter = 0;
                let songCountElement = document.getElementById('song-count-element');

                clearSongListing()
                for(var i = 0; i < trackList.length; i++) {
                    if (trackList[i].added_at.split('-')[1] == (getMonthFromString(month)) &&
                        trackList[i].added_at.split('-')[0] ==
                        year) {
                            listingCounter += 1;
                            playlistSongs.push(trackList[i])
                            if(listingCounter <= 50) {
                                createSongListing(trackList[i], listingCounter)
                                displayedListingIndex++;
                            }
                        }
                        songCountElement.innerHTML = listingCounter;
                    }
                    if(playlistSongs.length == 0 && !access_token) {
                        displayNoSongsFoundToast();
                    }
                    const clearAnimationInterval = setInterval(() => {
                    if(Date.parse(lastLoadedDate) + monthInMili < Date.parse(specifiedDate)) {
                        stopSearchAnimation()
                        isLoading = false;
                        clearInterval(clearAnimationInterval)
                    }
                }, 500);
            }
        }
    }

    function filterByRange() {
        playlistSongs = [];
        if(access_token != '') {
            var startDate = new Date(year, getMonthFromString(month)-1);
            var endDate = new Date(endYear, getMonthFromString(endMonth)-1);
            //TO DO: Check if start date is more recent than end date
            if((Date.parse(endDate) + monthInMili) < Date.parse(lastLoadedDate)) {
                setTimeout(function() {
                    console.log('reloading')
                    filterByRange()
                }, 500)
            } else {
                var listingCounter = 0;
                var songCountElement = document.getElementById('song-count-element');
                var parsedStartDate = Date.parse(startDate)
                var parsedEndDate = Date.parse(endDate)
                var index = 0;

                function doBlock() {
                    var count = 100;
                    while(count > 0 && index < trackList.length) {
                        let songDate = new Date(trackList[index].added_at)
                        // console.log(Date.parse(startDate) + " > " + Date.parse(songDate) + " > " + Date.parse(endDate))
                        // console.log(startDate + " > " + songDate + " > " + endDate)
                        if (parsedStartDate > Date.parse(songDate) && Date.parse(songDate) > parsedEndDate) {
                                // console.log("Added ::::" + songDate)    
                                listingCounter += 1;
                                playlistSongs.push(trackList[index])
                                // createSongListing(trackList[index], listingCounter)
                            }
                            songCountElement.innerHTML = listingCounter;
                            ++index;
                            --count;
                            if(playlistSongs.length == 0 && !access_token) {
                                displayNoSongsFoundToast();
                            }
                    }
                    if(index < trackList.length) {
                        setTimeout(doBlock, 10);
                    } else if(index >= trackList.length) {
                        displaySongListings(100);
                        stopSearchAnimation();                        
                    }
                }
                doBlock();
            }
        }
    }

    function allTimePlaylist() {
        playlistSongs = [];
        if(access_token != '') {
            isLoading = true;
            if(!doneFetchingSongs) {
                setTimeout(function() {
                    allTimePlaylist()
                }, 1000)
            } else {
                let listingCounter = 0;
                let songCountElement = document.getElementById('song-count-element');

                clearSongListing()
                listingCounter = trackList.length;
                playlistSongs = trackList;
                let minimumCountToDisplay = 100;
                if(playlistSongs.length < minimumCountToDisplay) {
                    minimumCountToDisplay = playlistSongs.length;
                }
                for(var i = 0; i < minimumCountToDisplay; i++) {
                    createSongListing(trackList[i], i+1)
                    displayedListingIndex++;
                }

                songCountElement.innerHTML = listingCounter;
                if(playlistSongs.length == 0 && !access_token) {
                    displayNoSongsFoundToast();
                }
                const clearAnimationInterval = setInterval(() => {
                    if(doneFetchingSongs) {
                        stopSearchAnimation()
                        isLoading = false;
                        clearInterval(clearAnimationInterval)
                    }
                }, 500);
            }
        }
    }

    function displaySongListings(amountToLoad) {
        if(displayedListingIndex == 0) {
            clearSongListing()
        }
        let startingIndex = displayedListingIndex;
        let displayHowMuch = amountToLoad || 50;
        let count = startingIndex;

        while(count < startingIndex + displayHowMuch && displayedListingIndex < playlistSongs.length) {
            createSongListing(playlistSongs[count], count+1)
            count++;    
            displayedListingIndex++;
        }
    }

    function displaySuccesfulPlaylistToast() {
        $('.playlist-succesful-toast').toast('show')
    }

    function displayUnsuccesfulPlaylistToast() {
        $('.playlist-unsuccesful-toast').toast('show')
    }

    function displayNoSongsFoundToast() {
        $('.no-songs-found-toast').toast('show')
    }

    function displayErrorToast() {
        $('.error-toast').toast('show')
    }

    function fetchSongs() {
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
                if(data.items.length == 0) {
                    fetchingSongs = false;
                }
                return data.items
            })
    }

    function getAllLikedSongs() {
        fetchingSongs = true;
        fetchSongs().then(songs => {
            // console.log(songs)
            offset += limit;   
            if(songs.length != 0) {
                doneFetchingSongs = false;
                lastLoadedDate = new Date(songs[songs.length - 1].added_at.split('-')[0], songs[songs.length - 1].added_at.split('-')[1], songs[songs.length - 1].added_at.split('-')[2].split('T')[0])
                
                console.log(lastLoadedDate)

                trackList = trackList.concat(songs)
                getAllLikedSongs();
            } else {
                console.log(trackList)
                doneFetchingSongs = true;
            }
        }).catch(error => {
            console.log(error)
        })
    }


    function createPlaylist(userId) {
        console.log(playlistSongs)
        //When the user chooses to create a playlist, Send the chosen list to my own API
        fetch(baseUrl + '/tracks/playlist', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(playlistSongs)
        }).then(response => {
            console.log(response.status)
        })

        fetch(baseUrl + '/tracks/tracks', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(playlistSongs)
            }).then(response => {
                console.log(response.status)
            })
        // if (trackList != 0) {
        //     fetch('https://api.spotify.com/v1/users/' + userId + '/playlists', {
        //         method: 'POST',
        //         headers: {
        //             'Authorization': 'Bearer ' + access_token,
        //             'content-type': 'application/json',
        //         },
        //         body: JSON.stringify({
        //             "name": month + ' ' + year + ' top songs',
        //             "description": 'The top songs in my song library from a specific month.',
        //             "public": true
        //         })
        //     }).then(response => {
        //         console.log(response)
        //         return response.json()
        //     }).then(data => {
        //         addSongsToPlaylist(data.id)
        //     }).catch(error => console.log(error))
        // } else {
        //     displayUnsuccesfulPlaylistToast()
        // }
    }

    // function uploadTracksToPlaylist() {
    //     return fetch('https://api.spotify.com/v1/playlists/' + id + '/tracks', {
    //         method: 'POST',
    //         headers: {
    //             'Authorization': 'Bearer ' + access_token,
    //             'content-type': 'application/json'
    //         },
    //         body: JSON.stringify(tempTrackList)
    //     })
    // }

    // function addSongsToPlaylist(id) {
    //     var uriTrackList = [];
    //     var tempTrackList = [];
    //     let index = 0;
    //     let count = 100;
    //     for(var j = 0; j < playlistSongs.length; j++) {
    //         uriTrackList.push(playlistSongs[j]['track']['uri'])
    //     }

    //     function flipFlopUpload() {
    //         while(count > 0 && index < playlistSongs.length) {
    //             tempTrackList = uriTrackList.slice(index, index + 100)



    //             count--;
    //             index += 100;    
    //         }
    //     }


    //     for (var i = 0; i <= uriTrackList.length; i += 100) {
    //         tempTrackList = uriTrackList.slice(i, i + 100)

    //         fetch('https://api.spotify.com/v1/playlists/' + id + '/tracks', {
    //             method: 'POST',
    //             headers: {
    //                 'Authorization': 'Bearer ' + access_token,
    //                 'content-type': 'application/json'
    //             },
    //             body: JSON.stringify(tempTrackList)
    //         }).then(response => {
    //             console.log(response.status)
    //             if (response.status == 201) {
    //                 displaySuccesfulPlaylistToast()
    //             } else {
    //                 displayUnsuccesfulPlaylistToast()
    //             }
    //             return response.json()
    //         }).then(data => {
    //             console.log(data)
    //         }).catch(error => console.log(error))
    //     }
    // }

    function addSongsToPlaylist(id) {
        var uriTrackList = [];
        var tempTrackList = [];

        for(var j = 0; j < playlistSongs.length; j++) {
            uriTrackList.push(playlistSongs[j]['track']['uri'])
        }
        console.log(uriTrackList)
        for (var i = 0; i <= uriTrackList.length; i += 100) {
            tempTrackList = uriTrackList.slice(i, i + 100)

            fetch('https://api.spotify.com/v1/playlists/' + id + '/tracks', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'content-type': 'application/json'
                },
                body: JSON.stringify(tempTrackList)
            }).then(response => {
                console.log(response.status)
                if (response.status == 201) {
                    displaySuccesfulPlaylistToast()
                } else {
                    displayUnsuccesfulPlaylistToast()
                }
                return response.json()
            }).then(data => {
                console.log(data)
            }).catch(error => console.log(error))
        }
    }



    function getUserInfo() {
        fetch('https://api.spotify.com/v1/me', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + access_token
            }
        }).then(response => {
            console.log(response)
            return response.json()
        }).then(data => {
            console.log(data)
            createPlaylist(data.id)
        })
    }


    function getMonthFromString(mon) {
        var date = new Date(Date.parse(mon + " 1, 2012")).getMonth() + 1
        if (("" + date).length == 1) {
            return "0" + date;
        }
        return date;
    }

    getToken()