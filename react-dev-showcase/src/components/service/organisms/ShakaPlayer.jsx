import React from 'react';

import shaka from 'shaka-player/dist/shaka-player.ui';
import styled, { css } from 'styled-components';

import { Button, Div, Modal } from '@components/index';
import { useModal } from '@src/hooks';
import { flex, font, size } from '@src/styles/variables';

const ButtonCss = css`
  ${size({ w: '75px', h: '55px' })}
  ${font({ size: '16px', weight: '700' })}
  padding: 15px 18px 14px 18px;
  line-height: 18.72px;
  text-align: center;
  margin: 5px;
`;

const ButtonSection = styled(Div)`
  ${flex({})}
  gap: 10px;
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
function ShakaPlayer({ src, config, chromeless, className, ...rest }, ref) {
  const { showModal, closeModal } = useModal();
  const uiContainerRef = React.useRef(null);
  const videoRef = React.useRef(null);

  const [player, setPlayer] = React.useState(null);
  const [ui, setUi] = React.useState(null);

  // 에러 이벤트 핸들러 함수
  const onErrorEvent = (event) => {
    // Shaka Error 객체를 받아옵니다.
    const error = event.detail;
    onError(error);
  };

  const onError = (error) => {
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
  React.useEffect(() => {
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
  React.useEffect(() => {
    if (player && config) {
      player.configure(config);
    }
  }, [player, config]);

  // Load the source url when we have one.
  React.useEffect(() => {
    if (player && src) {
      player.load(src).catch(onError);
    }
  }, [player, src]);

  // Define a handle for easily referencing Shaka's player & ui API's.
  React.useImperativeHandle(
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
}

export default React.forwardRef(ShakaPlayer);
