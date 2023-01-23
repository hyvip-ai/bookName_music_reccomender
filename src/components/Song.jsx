import Image from 'next/image';
import React from 'react';

function Song({
  name,
  artists,
  image,
  onClick,
  albumName,
  songPreview,
  uri,
  showCheck,
}) {
  return (
    <div className='song'>
      <div>
        <Image src={image} alt='song_image' height={64} width={64} />
      </div>
      <div className='right'>
        <h4>{name}</h4>
        <h6>{artists}</h6>
        <h6>{albumName}</h6>
      </div>
      <div className='left'>
        <audio src={songPreview} controls />
      </div>
      {showCheck ? (
        <div className='checkBox'>
          <input
            type='checkbox'
            onChange={(e) => onClick(e.target.checked, uri)}
          />
        </div>
      ) : null}
    </div>
  );
}

export default Song;
