import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import ReactPlayer from 'react-player';

const GENERATE_DIRECT_MEDIA_LINK = gql`
  mutation GenerateMediaDirectLink($trackId: String!) {
    generateDirectMediaLink(trackId: $trackId) {
      id
      direct_link
  }
  }
`;

type Track = {
  id: string,
    title: string,
    metadata: {
      direct_link?: string,
    }
}
type AudioPlayerProps = {
  track: Track | undefined
}

const AudioPlayer = ({ track }: AudioPlayerProps) => {
  const [playing, setPlaying] = useState(true);
  const [directMediaLink, setDirectMediaLink] = useState('');
  const playerRef = useRef(null);

  const [generateLink] = useMutation(GENERATE_DIRECT_MEDIA_LINK, {
    onCompleted: ({ generateDirectMediaLink }) => setDirectMediaLink(generateDirectMediaLink.direct_link)
  });

  useEffect(() => {
    if (track) {
      console.log(track)
      generateLink({ variables: { trackId: track.id}})
    }
  }, [track])

  // useEffect(() => {
  //   const player = playerRef.current;
  //   const duration = player.getDuration();
  //   player.seekTo(10, 'seconds');
  // }, [playerRef]);

  const handleProgress = (progress: any) => {
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
      url={directMediaLink}
      // url={track ? track.metadata.direct_link : '.mp3'}
      // onProgress={handleProgress}
      playing={!!directMediaLink}
      style={{
        width: '500px'
      }}
    />
  );
}

export default AudioPlayer;
