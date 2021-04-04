import React from 'react';
import './App.css';
import TrackList from '../features/trackList/TrackList';
import { GlobalStyle } from '../styles/globalStyle';
import Layout from '../components/Layout/Layout';
import AudioPlayer from '../features/audioPlayer/AudioPlayer.jsx';
import { useState } from 'react';

function App() {
  const [selectedTrack, setSelectedTrack] = useState(undefined);
  return (
    <div className="App">
      <GlobalStyle />
      <Layout>
        <AudioPlayer track={selectedTrack} />
        <TrackList onTrackSelect={setSelectedTrack} />
      </Layout>
    </div>
  );
}

export default App;
