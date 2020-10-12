    var baseUrl = "https://spotifyplaylistcreator.herokuapp.com"
    // var baseUrl = "http://localhost:5000"
    var access_token = '';
    var month = document.getElementById("month-list").value;
    var year = document.getElementById("year-list").value;
    var endMonth = document.getElementById("end-month-list").value;
    var endYear = document.getElementById("end-year-list").value;
    var trackList = [];
    var removedTracks = [];
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get('code');
    var searchFilter = 'month';
    var isLoading = false;

    $('.toast').toast({
        delay: 4000
    })


    function changeSearchFilter(selector, selectedElemCount) {
        searchFilter = selector
        if (selector == 'range') {
            document.getElementById('end-date-inputs-row').style.display = 'flex'
        } else {
            document.getElementById('end-date-inputs-row').style.display = 'none'
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
        fetch(baseUrl + '/tokencode', {
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
                access_token = data.data.access_token
                if (data.data.error) {
                    window.location = baseUrl + "/auth"
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

    function filterBySpecificMonth(song, listingCounter) {
        if (song.added_at.split('-')[1] == (getMonthFromString(month)) &&
            song.added_at.split('-')[0] ==
            year) {
            trackList.push(song.track.uri);
            createSongListing(song, listingCounter);
            return true;
        }
        return false;
    }

    // https://stackoverflow.com/questions/16080378/check-if-one-date-is-between-two-dates
    function filterByRange(song, listingCounter) {
        var songMonth = parseInt(song.added_at.split('-')[1]);
        var songYear = parseInt(song.added_at.split('-')[0]);
        var startMonth = getMonthFromString(month);
        var startYear = year
        var endingMonth = getMonthFromString(endMonth);
        var endingYear = endYear

        console.log(startMonth + ' < ' + songMonth + ' < ' + endingMonth + " / " + startYear + " < " + songYear + " < " + endingYear)
        if (startMonth < songMonth < endingMonth && startYear < songYear < endingYear) {
            trackList.push(song.track.uri);
            createSongListing(song, listingCounter);
            return true;
        }
        return false;
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
        if (access_token && !isLoading) {
            let offset = 0;
            const limit = 50;
            const numberOfTracks = 100;
            let addedSongCount = 0;
            var listingCounter = 1;
            var callCount = 0;
            var maxCallCount = 115;
            var songCountElement = document.getElementById('song-count-element');
            const controller = new AbortController()
            const signal = controller.signal

            trackList = [];
            songCountElement.innerHTML = addedSongCount;
            clearSongListing();
            startSearchAnimation();
            const fetchInterval = setInterval(function () {
                    fetch('https://api.spotify.com/v1/me/tracks?limit=' + limit + '&offset=' + offset, {
                        method: 'GET',
                        signal: signal,
                        headers: {
                            'Authorization': 'Bearer ' + access_token
                        }
                    }).then(response => {
                        console.log(response)
                        return response.json()
                    }).then(data => {
                        console.log(data.items.length)
                        //If response is 0 stop sending request
                        if (data.items.length <= 0) {
                            stopSearchAnimation();
                            clearInterval(fetchInterval)
                            controller.abort();
                            if (trackList <= 0) {
                                displayNoSongsFoundToast()
                            }
                        }

                        //Loop through returned response of songs and check if they match year and month
                        for (var i = 0; i < data.items.length; i++) {
                            songCountElement.innerHTML = addedSongCount;
                            let song = data.items[i]
                            //Specific month (month, year)
                            if (searchFilter == 'month') {
                                if (filterBySpecificMonth(song, listingCounter)) {
                                    addedSongCount += 1;
                                    listingCounter += 1;
                                }
                                //range of time (Start month, start year, end month, end year)
                            } else if (searchFilter == 'range') {
                                displayErrorToast();

                                // if (filterByRange(song, listingCounter)) {
                                //     addedSongCount += 1;
                                //     listingCounter += 1;
                                // }
                            } else if (addedSongCount != 0) {
                                stopSearchAnimation();
                                clearInterval(fetchInterval)
                                controller.abort();
                                if (trackList <= 0) {
                                    displayNoSongsFoundToast()
                                }
                            }
                        }
                    }).catch(error => {
                        console.log(error)
                        clearInterval(fetchInterval)
                        controller.abort();
                    })
                    callCount += 1;
                    offset += limit;
                },
                200)
        }
    }


    function createPlaylist(userId) {
        if (trackList != 0) {
            fetch('https://api.spotify.com/v1/users/' + userId + '/playlists', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    "name": month + ' ' + year + ' top songs',
                    "description": 'The top songs in my song library from a specific month.',
                    "public": true
                })
            }).then(response => {
                console.log(response)
                return response.json()
            }).then(data => {
                addSongs(data.id)
            }).catch(error => console.log(error))
        } else {
            displayUnsuccesfulPlaylistToast()
        }
    }


    function addSongs(id) {
        var tempTrackList = []
        for (var i = 0; i <= trackList.length; i += 100) {
            tempTrackList = trackList.slice(i, i + 100)

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