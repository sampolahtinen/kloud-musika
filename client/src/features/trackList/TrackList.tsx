import React from 'react';
import styled, { css, StyledComponent } from 'styled-components';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';

const TRACKS = gql`
  {
    tracks {
      id
      title
      artist {
        id
        name
      }
      metadata {
        id
        direct_link
      }
    }
  }
`;

interface TrackListProps {
  onTrackSelect: (param?: any) => void;
}

function TrackList({ onTrackSelect }: TrackListProps) {
  const { loading, error, data } = useQuery(TRACKS);

  const handleTrackSelect = (track: any) => {
    onTrackSelect(track);
  };

  if (loading) {
    return <span>Loading...</span>;
  }

  if (error) return <span>error</span>;

  return (
    <TrackListContainer>
      <Grid>
        <GridElement bold heading>
          Artist
        </GridElement>
        <GridElement bold heading>
          Title
        </GridElement>
        {data.tracks.map((track: any) => (
          <>
            <GridElement onClick={() => handleTrackSelect(track)}>
              {track.artist.name}
            </GridElement>
            <GridElement>{track.title}</GridElement>
          </>
        ))}
      </Grid>
    </TrackListContainer>
  );
}

const Track = styled.div``;

const TrackListContainer = styled.div`
  width: 500px;
  max-height: 800px;
  border-radius: 10px;
  overflow-y: scroll;
  padding: 5rem;
  box-shadow: 10px 10px 35px -7px rgba(0, 0, 0, 0.34);
`;

const Grid = styled.div`
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(2, 200px);
`;

type GridElementModifiers = {
  bold?: boolean;
  heading?: boolean;
};

const GridElement = styled.span<GridElementModifiers>`
  text-align: left;
  ${({ bold, heading }) => {
    return css`
      font-weight: ${bold && 800};
      font-size: ${heading && '20px'};
    `;
  }}
`;

export default TrackList;
