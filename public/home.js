var accessToken;
var baseUrl = window.location.href;
var insight;
var popSong;

async function onLoad() {
    //Fetch Insight, display content section, display insight
    console.log('Fetching insight')
    insight = await fetchInsight()
    console.log('Insight fetched: ' + insight)
    // displayContentSection()
    console.log(insight)
    // displayInsight(insight)
    displaySongCount(insight)
    //Fetch access token so that I can fetch the popular song using the ID I got from insight
    console.log('Fetching Access Token')
    accessTokenData = await getAccessToken()
    accessToken = accessTokenData.access_token
    console.log('Access Token fetched: ' + accessToken)
    //Query spotify API to fetch popular song and display the popular song
    console.log("Fetching pop_song")
    popSong = await fetchPopSong()
    console.log("Pop_song fetched: " + popSong)
    console.log(popSong)
    // displayPopSong(popSong) DELETE SOON
    displayTopSong(insight)
    displayTopGenres(insight)
    displayTopYearRelease(insight)

    popArtist = await fetchPopArtist(insight.pop_artists);
    popArtistTopSongs = await fetchArtistTopSongs(popArtist)
    displayTopArtist(popArtist, popArtistTopSongs)
}

async function fetchInsight() {
    return new Promise((resolve, reject) => {

        const insightUrl = baseUrl + 'insights/insight'

        fetch(insightUrl, {
            method: 'GET',
        }).then(response => {
            return response.json()
        }).then(data => {
            resolve(data)
        }).catch(err => {
            console.log(err)
            reject(err)
        })
    })
}

async function getAccessToken() {
    return new Promise((resolve, reject) => {
        fetch(baseUrl + 'auth/access_token', {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
            },
        }).then(response => {
            return response.json()
        }).then(data => {
            resolve(data)
        })
            .catch(err => {
                console.log(err)
                reject(err)
            })
    })
}

function displayContentSection() {
    document.getElementById('loading-section').style.display = 'none'
    document.getElementById('content-section').style.display = 'block'
}

// function displayInsight(insightData) {
//     document.getElementById('insight').innerHTML = JSON.stringify(insightData);
// }

function displaySongCount(insightData) {
    var num = insightData.total_song_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById('song-count-text').innerHTML = num;
}

function displayTopSong(insightData) {
    document.getElementById('top-song-title').innerHTML = insightData.pop_song.song_name.substring(0, 10);
    document.getElementById('top-song-artist').innerHTML = insightData.pop_song.artists[0].name;
    document.getElementById('top-song-genres').innerHTML = toTitleCase(insightData.pop_song.genres.join(", "));
    document.getElementById('top-song-popularity').innerHTML = insightData.pop_song.popularity + " / 100";
}

function displayTopArtist() {

}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function displayTopGenres(insightData) {
    const pickHighest = (obj, num = 3) => {
        const requiredObj = {};
        if(num > Object.keys(obj).length){
           return false;
        };
        Object.keys(obj).sort((a, b) => obj[b] - obj[a]).forEach((key, ind) =>
        {
           if(ind < num){
              requiredObj[key] = obj[key];
           }
        });
        return requiredObj;
     };
    let topGenres = pickHighest(insightData.pop_genres, 3);
    let topGenresStr = Object.keys(topGenres);


    document.getElementById('top-genre-1').innerHTML = toTitleCase(topGenresStr[0]);
    document.getElementById('top-genre-2').innerHTML = toTitleCase(topGenresStr[1]);
    document.getElementById('top-genre-3').innerHTML = toTitleCase(topGenresStr[2]);
}

function displayTopYearRelease(insighData) {
    const pickHighest = (obj, num = 3) => {
        const requiredObj = {};
        if(num > Object.keys(obj).length){
           return false;
        };
        Object.keys(obj).sort((a, b) => obj[b] - obj[a]).forEach((key, ind) =>
        {
           if(ind < num){
              requiredObj[key] = obj[key];
           }
        });
        return requiredObj;
     };
    let topYears = pickHighest(insighData.pop_year_release, 3);
    let topYearsStr = Object.keys(topYears);

    document.getElementById('top-year-release-1').innerHTML = toTitleCase(topYearsStr[2]);
    document.getElementById('top-year-release-2').innerHTML = toTitleCase(topYearsStr[1]);
    document.getElementById('top-year-release-3').innerHTML = toTitleCase(topYearsStr[0]);
}

function displayPopSong(PopSongData) {
    document.getElementById('pop-song').innerHTML = JSON.stringify(PopSongData);
}

function displayTopArtist(artist, topTracks) {
    console.log(artist)
    console.log(topTracks)

    document.getElementById('top-artist-name').innerHTML = artist.name;
    document.getElementById('top-artist-pop').innerHTML = artist.popularity + " / 100";
    for(let i = 0; i < 5; i++) {
        document.getElementById('song-table-container').innerHTML += 
        `
        <a href="${topTracks.tracks[i].external_urls.spotify}" target="_blank">
        <div class="song-table-row">
            <h9>${topTracks.tracks[i].name}</h9>
                <h9 class="e7">${topTracks.tracks[i].album.name}</h9>
                <h9 class="e7">${topTracks.tracks[i].popularity + "/ 100"}</h9>
        </div>
        </a>
        `
    }


}

async function fetchPopSong() {
    return new Promise((resolve, reject) => {
        fetch('https://api.spotify.com/v1/tracks/' + insight.pop_song.song_id, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        }).then(response => {
            return response.json();
        }).then(data => {
            resolve(data)
        }).catch(err => {
            console.log(err)
            reject(err)
        })
    })
}

async function fetchPopArtist(topArtists) {
    topArtist = Object.keys(topArtists).reduce(function(a, b){ return topArtists[a] > topArtists[b] ? a : b });
    return new Promise((resolve, reject) => {
        fetch('https://api.spotify.com/v1/artists/' + topArtist, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        }).then(response => {
            return response.json();
        }).then(data => {
            resolve(data)
        }).catch(err => {
            console.log(err)
            reject(err)
        })
    })
}

async function fetchArtistTopSongs(artist) {
    return new Promise((resolve, reject) => {
        fetch('https://api.spotify.com/v1/artists/' + artist.id + "/top-tracks?market=US", {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        }).then(response => {
            return response.json();
        }).then(data => {
            resolve(data)
        }).catch(err => {
            console.log(err)
            reject(err)
        })
    })
}