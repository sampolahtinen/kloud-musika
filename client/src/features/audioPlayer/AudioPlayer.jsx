import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import ReactPlayer from 'react-player';

function AudioPlayer({ track }) {
  const playerRef = useRef(null);

  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const player = playerRef.current;
    const duration = player.getDuration();
    player.seekTo(10, 'seconds');
  }, [playerRef]);

  const handleProgress = progress => {
    const { playedSeconds } = progress;
    console.log(playedSeconds);
    if (playedSeconds >= 30) {
      setPlaying(false);
    }
  };

  return (
    <ReactPlayer
      ref={playerRef}
      controls
      url={track ? track.metadata.direct_link : '.mp3'}
      // onProgress={handleProgress}
      playing={playing}
      style={{
        width: '500px'
      }}
    />
  );
}

export default AudioPlayer;
