import type { Video } from '../types/video';

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  return (
    <div className="video-card">
      <h2 className="video-title">{video.title}</h2>
      <a
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        className="video-url"
      >
        {video.url}
      </a>
    </div>
  );
}
