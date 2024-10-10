/* eslint-disable */
import React, { useCallback, useImperativeHandle, useRef, useState } from 'react';
import { useEffect } from 'react';

import ShakaPlayer from './ShakaPlayer';

const CONFIG = {
  // player setting
};
const MAX_RETRY_PLAY_COUNT = 30;

const TShakaPlayer = ({
  src,
  playerRef,
  onProgress,
  progressInterval = 100,
  muted = false,
  playerConfig = CONFIG,
  loop = true,
  selectedAudioTrack = 0,
  ...rest
}) => {
  const shakaRef = useRef(null);
  const retryIntervalRef = useRef(null);
  const dataLoaded = useRef(false);
  const retryCountRef = useRef(0);
  const [updateProgressEvent, setUpdateProgressEvent] = useState(false);
  const [shown, setShown] = useState(false);
  const progressIntervalRef = useRef(null);

  useEffect(() => {
    const updateProgress = () => setUpdateProgressEvent(true);
    const cancelProgress = () => setUpdateProgressEvent(false);
    setTimeout(() => {
      shakaRef.current?.ui?.configure(CONFIG);
      if (shakaRef.current?.videoElement) {
        shakaRef.current.videoElement.onloadeddata = () => {
          dataLoaded.current = true;
          console.log('TShakaPlayer onloadeddata');
          const audioTracks = shakaRef.current.videoElement.audioTracks;
          //todo en audio
          if (selectedAudioTrack > 0 && audioTracks && audioTracks.length > 1 && audioTracks[selectedAudioTrack]) {
            for (let i = 0; i < audioTracks.length; i++) {
              audioTracks[i].enabled = selectedAudioTrack === i;
            }
          } else {
            console.log('TShakaPlayer no AudioTracks');
          }
          setShown(true);
          // if (onDuration) {
          //   onDuration(shakaRef.current.videoElement.duration);
          // }
          // console.log('shakaRef.current.videoElement.duration', shakaRef.current.videoElement.duration);
        };
        shakaRef.current.videoElement.onplay = updateProgress;
        // shakaRef.current.videoElement.onpause = updateProgress; //not working
        shakaRef.current.videoElement.onabort = cancelProgress;
        shakaRef.current.videoElement.onerror = cancelProgress;
        shakaRef.current.videoElement.onended = cancelProgress;
        playerRef.current.shakaRef = shakaRef;
      }
      if (typeof window === 'object') window.videoPlayer = playerRef.current;
    }, 10);
  }, []);

  useEffect(() => {
    dataLoaded.current = false;
    setShown(false);
    setUpdateProgressEvent(false);
    shakaRef.current?.videoElement?.pause();
    console.log('TShakaPlayer src changed ', src);
  }, [src]);

  useEffect(() => {
    return () => {
      clearProgress();
      clearRetry();
    };
  }, []);

  useEffect(() => {
    clearProgress();
    if (updateProgressEvent) {
      progressIntervalRef.current = setInterval(() => {
        if (onProgress) {
          onProgress(shakaRef.current.videoElement.currentTime);
        }
      }, progressInterval);
    }
  }, [updateProgressEvent, onProgress]);

  const clearRetry = useCallback(() => {
    if (retryIntervalRef.current) {
      clearTimeout(retryIntervalRef.current);
      retryIntervalRef.current = null;
    }
    retryCountRef.current = 0;
    dataLoaded.current = true;
  }, []);

  const clearProgress = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const paused = useCallback(() => {
    return shakaRef.current.videoElement.paused;
  }, []);

  const getDuration = useCallback(() => {
    return shakaRef.current.videoElement.duration;
  }, []);

  const pause = useCallback(() => {
    clearRetry();
    clearProgress();
    setUpdateProgressEvent(false);
    shakaRef.current.videoElement.pause();
  }, []);

  const play = useCallback(() => {
    if (!src || !paused()) {
      console.log('TShakaPlayer already played or no src', src);
      return;
    }
    if (dataLoaded.current) {
      clearRetry();
      shakaRef.current.videoElement.play();
    } else {
      if (retryCountRef.current >= MAX_RETRY_PLAY_COUNT) {
        clearRetry();
        shakaRef.current.videoElement.play();
        setShown(true);
        return;
      }
      retryCountRef.current += 1;
      retryIntervalRef.current = setTimeout(() => {
        console.log('TShakaPlayer data not loaded retry : ', retryCountRef.current);
        play();
      }, 100);
    }
  }, [paused, src]);

  const seekTo = useCallback((sec) => {
    clearRetry();
    shakaRef.current.videoElement.currentTime = sec;
  }, []);

  const getCurrentTime = useCallback(() => {
    return shakaRef.current.videoElement.currentTime;
  }, []);

  const setPlaybackRate = useCallback((rate) => {
    if (Number.isFinite(rate) && rate >= 0) {
      shakaRef.current.videoElement.playbackRate = rate;
    }
  }, []);

  useImperativeHandle(playerRef, () => {
    return {
      play,
      pause,
      paused,
      seekTo,
      getDuration,
      getCurrentTime,
      setPlaybackRate,
      shakaRef: shakaRef,
    };
  }, [play]);

  return (
    <ShakaPlayer
      {...rest}
      src={src}
      config={playerConfig}
      ref={shakaRef}
      chromeless
      width='960px'
      height='540px'
      autoPlay={true}
      controls={false}
      muted={muted}
      loop={loop}
    />
  );
};

export default TShakaPlayer;
