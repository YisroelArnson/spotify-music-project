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
    displayInsight(insight)
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
    displayPopSong(popSong)
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

function displayInsight(insightData) {
    document.getElementById('insight').innerHTML = JSON.stringify(insightData);
}

function displaySongCount(insightData) {
    var num = insightData.total_song_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById('song-count-text').innerHTML = num;
}

function displayPopSong(PopSongData) {
    document.getElementById('pop-song').innerHTML = JSON.stringify(PopSongData);
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