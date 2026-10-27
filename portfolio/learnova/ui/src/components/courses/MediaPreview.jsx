import { useMemo } from 'react';

const getYouTubeEmbedUrl = (url) => {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes('youtu.be')) {
      return `https://www.youtube.com/embed/${parsed.pathname.replace('/', '')}`;
    }

    if (parsed.hostname.includes('youtube.com')) {
      const videoId = parsed.searchParams.get('v');
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }

      if (parsed.pathname.startsWith('/embed/')) {
        return url;
      }
    }
  } catch (_error) {
    // ignore invalid URLs
  }

  return null;
};

export const MediaPreview = ({ url, type }) => {
  const sanitizedUrl = useMemo(() => {
    if (!url) {
      return null;
    }

    if (type === 'video') {
      const ytEmbed = getYouTubeEmbedUrl(url);
      if (ytEmbed) {
        return ytEmbed;
      }
    }

    return url;
  }, [type, url]);

  if (!sanitizedUrl) {
    return null;
  }

  if (type === 'video') {
    const isYouTube = sanitizedUrl.includes('youtube.com/embed/');

    return (
      <div className="mt-4 flex flex-col gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Video preview</p>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-900/5">
          {isYouTube ? (
            <iframe
              src={sanitizedUrl}
              className="aspect-video w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Course video"
            />
          ) : (
            <video controls className="w-full" src={sanitizedUrl} preload="metadata">
              Your browser does not support the video tag.
            </video>
          )}
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-primary-600 hover:text-primary-700"
        >
          Open video in new tab
        </a>
      </div>
    );
  }

  if (type === 'pdf') {
    return (
      <div className="mt-4 flex flex-col gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">PDF preview</p>
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <iframe
            src={`${sanitizedUrl}#toolbar=0`}
            className="h-96 w-full"
            title="Course PDF preview"
          />
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-primary-600 hover:text-primary-700"
        >
          Open PDF in new tab
        </a>
      </div>
    );
  }

  return null;
};
