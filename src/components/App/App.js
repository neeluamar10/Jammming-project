import React from 'react';
import { SearchBar } from '../SearchBar/SearchBar';
import './App.css';
import { SearchResults } from '../SearchResults/SearchResults';
import { Playlist } from '../Playlist/Playlist';
import { Spotify } from '../../util/Spotify';

export class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      searchResults: [
        {
          name: "Electric Dreams",
          artist: "SynthWave Master",
          album: "Neon Nights",
          id:1
        },
        {
          name: "Rhythmic Groove",
          artist: "Funky Beats Ensemble",
          album: "Groove Fusion",
          id: 2
        },
        {
          name: "Sunset Serenity",
          artist: "Chillout Vibes Collective",
          album: "Relaxation Waves",
          id: 3
        }
      ],
      playlistName: 'Neelima',
      playlistTracks: [
        {
          name: "playlist Electric Dreams",
          artist: "playlist SynthWave Master",
          album: "playlist Neon Nights",
          id:4
        },
        {
          name: "playlist Rhythmic Groove",
          artist: "playlist Funky Beats Ensemble",
          album: "playlist Groove Fusion",
          id: 5
        },
        {
          name: "playlist Sunset Serenity",
          artist: "playlist Chillout Vibes Collective",
          album: "playlist Relaxation Waves",
          id: 6
        }
      ]
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track){
    const checkPlaylist = this.state.playlistTracks.find((prevList) => prevList.id === track.id);
    const newTrack = this.state.playlistTracks.concat(track);
    checkPlaylist ? console.log('already exists') : this.setState({playlistTracks: newTrack})
  }

  removeTrack(track){
    const newTrack = this.state.playlistTracks.filter((prevList) => prevList.id !== track.id);
    this.setState({ playlistTracks: newTrack });
  }

  updatePlaylistName(name){
    this.setState({playlistName: name})
  }

  savePlaylist(){
    var trackURIs = this.state.playlistTracks.map(track => track.uri);
    var name = this.state.playlistName;
    Spotify.savePlaylist(name, trackURIs)
    .then(()=> {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: [],
      })
    })
  }

  search(term){
    Spotify.search(term)
    .then(result => {
      this.setState({searchResults: result})
    })
    console.log(term);
  }

  render(){
  return (
  <div>
  <h1>Ja<span className="highlight">mmm</span>ing</h1>
  <div className="App">
    <SearchBar onSearch={this.search} />
    <div className="App-playlist">
      <SearchResults 
      searchResults={this.state.searchResults} 
      onAdd={this.addTrack}/>
      <Playlist 
      playlistName={this.state.playlistName} 
      playlistTracks={this.state.playlistTracks} 
      onRemove={this.removeTrack}
      onNameChange={this.updatePlaylistName}
      onSave={this.savePlaylist} />
    </div>
  </div>
</div>
  );
}
}

export default App;
