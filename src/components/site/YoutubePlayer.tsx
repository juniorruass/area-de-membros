import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<void> | null = null;
function loadYoutubeApi() {
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    if (window.YT?.Player) {
      resolve();
      return;
    }
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(script);
  });
  return apiPromise;
}

export function YoutubePlayer({ videoId, title }: { videoId: string; title: string }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [started, setStarted] = useState(false);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(true);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    let destroyed = false;
    setStarted(false);
    setReady(false);
    setPaused(true);

    loadYoutubeApi().then(() => {
      if (destroyed || !mountRef.current) return;
      playerRef.current = new window.YT.Player(mountRef.current, {
        videoId,
        playerVars: {
          controls: 0,
          modestbranding: 1,
          rel: 0,
          iv_load_policy: 3,
          playsinline: 1,
          fs: 0,
        },
        events: {
          onReady: () => {
            if (destroyed) return;
            setReady(true);
            setVolume(playerRef.current?.getVolume?.() ?? 100);
          },
          onStateChange: (e: { data: number }) => {
            if (destroyed) return;
            setPaused(e.data !== 1);
          },
        },
      });
    });

    return () => {
      destroyed = true;
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
  }, [videoId]);

  useEffect(() => {
    const onFsChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const start = () => {
    setStarted(true);
    playerRef.current?.playVideo?.();
  };

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (paused) playerRef.current.playVideo();
    else playerRef.current.pauseVideo();
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (muted) {
      playerRef.current.unMute();
      setMuted(false);
    } else {
      playerRef.current.mute();
      setMuted(true);
    }
  };

  const onVolumeChange = (v: number) => {
    setVolume(v);
    playerRef.current?.setVolume?.(v);
    if (v === 0) {
      playerRef.current?.mute?.();
      setMuted(true);
    } else if (muted) {
      playerRef.current?.unMute?.();
      setMuted(false);
    }
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      wrapperRef.current?.requestFullscreen?.();
    }
  };

  return (
    <div
      ref={wrapperRef}
      className="relative aspect-video w-full overflow-hidden bg-navy-deep [&:fullscreen]:aspect-auto [&:fullscreen]:h-screen"
    >
      <div ref={mountRef} className="h-full w-full" />

      {!started ? (
        <button
          type="button"
          onClick={start}
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-navy-deep"
        >
          <span className="flex size-16 items-center justify-center rounded-full bg-pink text-3xl text-navy shadow-soft transition-transform active:scale-95">
            ▶
          </span>
          <span className="px-6 text-center text-sm font-semibold text-primary-foreground/80">
            Toque para assistir
          </span>
        </button>
      ) : (
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-navy-deep/85 px-3 py-2 backdrop-blur-sm">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={paused ? "Tocar" : "Pausar"}
            disabled={!ready}
            className="flex size-8 shrink-0 items-center justify-center text-lg text-primary-foreground disabled:opacity-40"
          >
            {paused ? "▶" : "⏸"}
          </button>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "Ativar som" : "Silenciar"}
            disabled={!ready}
            className="flex size-8 shrink-0 items-center justify-center text-base text-primary-foreground disabled:opacity-40"
          >
            {muted || volume === 0 ? "🔇" : "🔊"}
          </button>
          <input
            type="range"
            min={0}
            max={100}
            value={muted ? 0 : volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            disabled={!ready}
            aria-label="Volume"
            className="w-16 accent-pink"
          />
          <div className="flex-1" />
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={fullscreen ? "Sair da tela cheia" : "Tela cheia"}
            className="flex size-8 shrink-0 items-center justify-center text-base text-primary-foreground"
          >
            {fullscreen ? "🗗" : "⛶"}
          </button>
        </div>
      )}

      <span className="sr-only">{title}</span>
    </div>
  );
}
