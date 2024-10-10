/* eslint-disable */
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';

import shaka from 'shaka-player/dist/shaka-player.ui';
import styled, { css } from 'styled-components';

import { Button, Div, Modal } from '@components/index';
import { useModal } from '@src/hooks';
import { flex, font, size } from '@src/styles/variables';

const ButtonCss = css`
  ${size({ w: '75px', h: '55px' })}
  ${font({ size: '16px', weight: '700' })}
  line-height: 18.72px;
  padding: 15px 18px 14px 18px;
  text-align: center;
  margin: 5px;
`;

const ButtonSection = styled(Div)`
  ${flex({ gap: '10px' })}
`;

/**
 * A React component for shaka-player.
 *
 * @class
 * @param {string} src
 * @param {shaka.extern.PlayerConfiguration} config
 * @param {boolean} autoPlay
 * @param {number} width
 * @param {number} height
 * @param ref
 * @returns {any}
 */
//shakaPlayer react 는 최신 버전의 shaka player를 가지고 있지 않아, ui 부분만 별도로 내포함.
const ShakaPlayer = forwardRef(({ src, config, chromeless, className, ...rest }, ref) => {
  const { showModal, closeModal } = useModal();
  const uiContainerRef = useRef(null);
  const videoRef = useRef(null);

  const [player, setPlayer] = useState(null);
  const [ui, setUi] = useState(null);

  // 에러 이벤트 핸들러 함수
  const onErrorEvent = (event) => {
    // Shaka Error 객체를 받아옵니다.
    const error = event.detail;
    onError(error);
  };

  const onError = (error) => {
    console.error('Error code', error.code, 'object', error);

    // 오류를 처리합니다.
    switch (error.code) {
      case shaka.util.Error.Code.MEDIA_SOURCE_OPERATION_THREW:
        showModal(
          <Modal
            key={shaka.util.Error.Code.MEDIA_SOURCE_OPERATION_THREW}
            footerChildren={
              <ButtonSection>
                <Button
                  onClick={() => closeModal(shaka.util.Error.Code.MEDIA_SOURCE_OPERATION_THREW)}
                  $layout='square'
                  $variantColor='primary'
                  classes={{ Button: ButtonCss }}
                >
                  확인
                </Button>
              </ButtonSection>
            }
          >
            <Text>이 비디오 파일 형식은 지원되지 않습니다. 다른 파일을 선택해 주세요.</Text>
          </Modal>
        );
        break;

      case shaka.util.Error.Code.UNABLE_TO_GUESS_MANIFEST_TYPE:
        showModal(
          <Modal
            key={shaka.util.Error.Code.UNABLE_TO_GUESS_MANIFEST_TYPE}
            footerChildren={
              <ButtonSection>
                <Button
                  onClick={() => closeModal(shaka.util.Error.Code.UNABLE_TO_GUESS_MANIFEST_TYPE)}
                  $layout='square'
                  $variantColor='primary'
                  classes={{ Button: ButtonCss }}
                >
                  확인
                </Button>
              </ButtonSection>
            }
          >
            <Text>이 비디오 파일 형식은 지원되지 않습니다. 다른 파일을 선택해 주세요.</Text>
          </Modal>
        );
        break;

      default:
        console.log('Unhandled error:', error);
    }

    // 오류가 처리되었음을 표시합니다.
    error.handled = true;
  };

  // Effect to handle component mount & mount.
  // Not related to the src prop, this hook creates a shaka.Player instance.
  // This should always be the first effect to run.
  useEffect(() => {
    const player = new shaka.Player(videoRef.current);
    player.addEventListener('error', onErrorEvent);
    setPlayer(player);

    let ui;
    if (!chromeless) {
      const ui = new shaka.ui.Overlay(player, uiContainerRef.current, videoRef.current);
      setUi(ui);
    }

    return () => {
      player.destroy();
      player.removeEventListener('error', onErrorEvent);
      if (ui) {
        ui.destroy();
      }
    };
  }, []);

  // Keep shaka.Player.configure in sync.
  useEffect(() => {
    if (player && config) {
      player.configure(config);
    }
  }, [player, config]);

  // Load the source url when we have one.
  useEffect(() => {
    if (player && src) {
      player.load(src).catch(onError);
    }
  }, [player, src]);

  // Define a handle for easily referencing Shaka's player & ui API's.
  useImperativeHandle(
    ref,
    () => ({
      get player() {
        return player;
      },
      get ui() {
        return ui;
      },
      get videoElement() {
        return videoRef.current;
      },
    }),
    [player, ui]
  );

  return (
    <div ref={uiContainerRef} className={className}>
      <video ref={videoRef} {...rest} />
    </div>
  );
});

const CONFIG = {
  // player setting
};
const MAX_RETRY_PLAY_COUNT = 30;

const FTAShakaPlayer = ({
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
        };
        shakaRef.current.videoElement.onplay = updateProgress;
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

export default FTAShakaPlayer;
