import React, { useState, useEffect } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faVolumeUp, faVolumeDown, faHeart, faPlus, faForward, faBackward } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [audioSrc, setAudioSrc] = useState(localStorage.getItem('audioSrc') || null);
  const [audioPlayer, setAudioPlayer] = useState(null);
  const [volume, setVolume] = useState(parseFloat(localStorage.getItem('volume')) || 0.5); // Initial volume
  const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem('favorites')) || []);
  const [queue, setQueue] = useState(JSON.parse(localStorage.getItem('queue')) || []);

  useEffect(() => {
    localStorage.setItem('audioSrc', audioSrc);
    localStorage.setItem('volume', volume);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    localStorage.setItem('queue', JSON.stringify(queue));
  }, [audioSrc, volume, favorites, queue]);

  useEffect(() => {
    if (audioSrc) {
      const newAudio = new Audio(audioSrc);
      newAudio.volume = volume; // Set initial volume
      setAudioPlayer(newAudio);
      newAudio.play();
    }
  }, [audioSrc, volume]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const audio = URL.createObjectURL(file);
    setAudioSrc(audio);
  };

  const handlePlayPause = () => {
    if (audioPlayer.paused) {
      audioPlayer.play();
    } else {
      audioPlayer.pause();
    }
  };

  const handleVolumeUp = () => {
    const newVolume = Math.min(volume + 0.1, 1);
    setVolume(newVolume);
    if (audioPlayer) {
      audioPlayer.volume = newVolume;
    }
  };

  const handleVolumeDown = () => {
    const newVolume = Math.max(volume - 0.1, 0);
    setVolume(newVolume);
    if (audioPlayer) {
      audioPlayer.volume = newVolume;
    }
  };

  const handleAddToFavorites = () => {
    if (audioSrc && !favorites.includes(audioSrc)) {
      setFavorites([...favorites, audioSrc]);
    }
  };

  const handleAddToQueue = () => {
    if (audioSrc && !queue.includes(audioSrc)) {
      setQueue([...queue, audioSrc]);
    }
  };

  const handleNext = () => {
    if (queue.length > 0) {
      const nextSong = queue.shift();
      setAudioSrc(nextSong);
      if (audioPlayer) {
        audioPlayer.pause();
        audioPlayer.src = nextSong;
        audioPlayer.play();
      }
      setQueue([...queue]);
    }
  };

  const handleBack = () => {
    // Simulate going back to the previous song in the queue
    // (For simplicity, we don't actually remove the current song from the queue)
    if (queue.length > 0) {
      const prevSong = queue[queue.length - 1];
      setAudioSrc(prevSong);
      if (audioPlayer) {
        audioPlayer.pause();
        audioPlayer.src = prevSong;
        audioPlayer.play();
      }
    }
  };

  return (
    <div className="App">
      <div className="background">
        <div className="music-icon"></div>
        <div className="song-name">{audioSrc && audioSrc.split('/').pop()}</div>
        <div className="controls">
          <FontAwesomeIcon icon={audioPlayer && audioPlayer.paused ? faPlay : faPause} onClick={handlePlayPause} className="control-icon" />
          <FontAwesomeIcon icon={faVolumeUp} onClick={handleVolumeUp} className="control-icon" />
          <FontAwesomeIcon icon={faVolumeDown} onClick={handleVolumeDown} className="control-icon" />
          <FontAwesomeIcon icon={faHeart} onClick={handleAddToFavorites} className="control-icon" />
          <FontAwesomeIcon icon={faPlus} onClick={handleAddToQueue} className="control-icon" />
          <FontAwesomeIcon icon={faForward} onClick={handleNext} className="control-icon" />
          <FontAwesomeIcon icon={faBackward} onClick={handleBack} className="control-icon" />
          <input type="file" accept="audio/*" onChange={handleFileChange} />
        </div>
      </div>
      <div className="favorites-container">
        <h2>Favorites</h2>
        <ul>
          {favorites.map((favorite, index) => (
            <li key={index}>{favorite.split('/').pop()}</li>
          ))}
        </ul>
      </div>
      <div className="queue-container">
        <h2>Queue</h2>
        <ul>
          {queue.map((song, index) => (
            <li key={index}>{song.split('/').pop()}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;