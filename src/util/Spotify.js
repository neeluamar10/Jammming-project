
const clientID = '7b2ec6db98314f81adb02ca1206a31ba';
const redirectURI = 'http://localhost:3000/';
//const redirectURI = 'https://www.JammmingProject.surge.sh';
let accessToken = '';

const Spotify = {
    getAccessToken(){
        if(accessToken){
            console.log('getAccessToken method');
        return accessToken;
        } 
    const urlAccessToken = window.location.href.match(/access_token=([^&]*)/);
    const urlExpiresIn = window.location.href.match(/expires_in=([^&]*)/);

    if(urlAccessToken && urlExpiresIn){
        accessToken = urlAccessToken[1];
        const expiresIn = Number(urlExpiresIn[1]);
        window.setTimeout(() => (accessToken = ''), expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');
    }else {
        const redirect = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`
        window.location = redirect;
    }
    },

    async search(term){
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {Authorization: `Bearer ${accessToken}`}
          })
          .then((response) => {
            return response.json();
          })
          .then((jsonResponse) => {
            if(!jsonResponse.tracks){
                return [];
            }
            return jsonResponse.tracks.items.map(tracks => ({
                        id: tracks.id,
                        name: tracks.name,
                        artist: tracks.artists[0].name,
                        album: tracks.album.name,
                        uri: tracks.uri

                    }
                )
            )
          })
    },

    savePlaylist(name,trackURIs){
        if(!name || !trackURIs){
            return;
        }
        let accessToken = Spotify.getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`
        };
        var userID = '';
        return fetch('https://api.spotify.com/v1/me', {headers: headers})
        .then(response => response.json())
        .then( jsonResponse => {
            userID = jsonResponse.id
            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({name: name})
            }).then(response => response.json())
            .then(jsonResponse => {
                const playlistID = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({uris: trackURIs})
                })
            })
        })
    }
}

export { Spotify };