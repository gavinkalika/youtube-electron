import { useState, FormEvent } from 'react';
import { useVideo } from './hooks/useVideo';
import { VideoCard } from './components/VideoCard';
import './App.css';

export function App() {
  const [videoId, setVideoId] = useState('');
  // hook aka behavior of the component
  const { loading, video, error, fetchVideo, reset } = useVideo();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (videoId.trim()) {
      fetchVideo(videoId.trim());
    }
  };

  const handleReset = () => {
    setVideoId('');
    reset();
  };

  return (
    <div className="app">
      <h1>YouTube Video Fetcher</h1>

      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={videoId}
          onChange={(e) => setVideoId(e.target.value)}
          placeholder="Enter YouTube video ID"
          className="search-input"
          disabled={loading}
        />
        <button type="submit" className="search-button" disabled={loading}>
          {loading ? 'Loading...' : 'Fetch'}
        </button>
        {(video || error) && (
          <button type="button" onClick={handleReset} className="reset-button">
            Reset
          </button>
        )}
      </form>

      {error && <div className="error">{error}</div>}

      {video && <VideoCard video={video} />}
    </div>
  );
}
