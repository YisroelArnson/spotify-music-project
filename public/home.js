var accessToken;
var baseUrl = window.location.href;
var insight;
var popSong;

async function onLoad() {
    console.log('Fetching insight')
    insight = await fetchInsight()
    console.log('Insight fetched: ' + insight)
    
    console.log('Fetching Access Token')
    accessTokenData = await getAccessToken()
    accessToken = accessTokenData.access_token
    console.log('Access Token fetched: ' + accessToken)
    displayData(insight)

    console.log("Fetching pop_song")
    popSong = await fetchPopSong()
    console.log("Pop_song fetched: " + popSong)
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

function displayData(data) {
    document.getElementById('loading-section').style.display = 'none'
    document.getElementById('content-section').style.display = 'block'
    document.getElementById('insight').innerHTML = JSON.stringify(data);
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