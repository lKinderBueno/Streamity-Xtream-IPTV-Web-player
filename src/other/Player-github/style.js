import styled, { css, keyframes } from 'styled-components';

const toUpOpacity = keyframes`
  0% {
    opacity: 0;
    transform: translateY(0);
  }

  30% {
    opacity: 1;
    transform: translateY(-20px);
  }

  100% {
    opacity: 0;
    transform: translateY(0);
  }
`;

export const Container = styled.div`
  & > * {
    outline: 0;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: ${props =>
      props.fontFamily
        ? props.fontFamily
        : "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"};
  }

  width: 100%;
  height: 100%;
  position: relative;
  background: #000;
  overflow: hidden;

  video {
    height: 100% !important;
    max-height: 100% !important;
    width: 100% !important;
    max-width: 100% !important;
    cursor: none;
    opacity: ${props => (props.hideVideo ? 0 : 1)};

    &::cue {
      color: #eee;
      z-index: 4;
      text-shadow: #222 0 0 5px;
      background: none;
      font-family: ${props =>
        props.fontFamily
          ? props.fontFamily
          : "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"};
    }
  }

  ${props =>
    props.fullPlayer &&
    css`
      position: fixed;
      top: 0;
      left: 0;
      z-index: 10000;
    `}
`;

export const Controlls = styled.div`
  opacity: ${props => (props.show ? 1 : 0)};
  transform: ${props => (props.show ? 'scale(1)' : 'scale(1.2)')};

  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  transition: all 0.2s ease-out;

  padding: 10px;
  color: #fff;
  font-size: 1.5em;
  background: rgb(0, 0, 0);
  background: linear-gradient(
    0deg,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 0.7) 20%,
    rgba(0, 0, 0, 0) 40%,
    rgba(0, 0, 0, 0) 60%,
    rgba(0, 0, 0, 0.7) 80%,
    rgba(0, 0, 0, 1) 100%
  );

  .back {
    margin-bottom: auto;
    margin-top: 30px;
    margin-left: 50px;
    display: flex;

    div {
      display: flex;
      font-size: 20px;
      align-items: center;
      opacity: 0.3;
      transition: all 0.2s ease-out;
      overflow: hidden;

      span {
        margin-left: -100%;
        opacity: 0;
        transition: all ease-out 0.2s;
      }

      &:hover {
        opacity: 1;
        transform: translateX(-10px);

        span {
          margin-left: 0;
          opacity: 1;
        }
      }

      svg {
        font-size: 35px;
        margin-right: 5px;
      }
    }
  }

  .line-reproduction {
    display: flex;
    margin-bottom: 10px;

    input {
      margin: auto;
    }

    span {
      font-size: 14px;
      margin-left: 5px;
    }
  }

  .controlls {
    margin: 20px 0;
    display: flex;
    justify-items: center;

    .end {
      margin-left: auto;
    }

    div {
      display: flex;
      justify-items: center;
    }

    .item-control {
      position: relative;
      margin: auto 15px;
    }

    .info-video {
      font-size: 16px;
      margin-top: -1px;

      .info-first {
        font-weight: bold;
        opacity: 1;
        margin-right: 5px;
      }

      .info-secund {
        font-weight: lighter;
        opacity: 0.5;
      }
    }

    svg {
      cursor: pointer;
      opacity: 0.2;
      font-size: 25px;
      transition: all 0.2s ease-out;

      &:hover {
        opacity: 1;
        transform: scale(1.2);
      }
    }
  }

  .progress-bar {
    width: 100%;
    margin-bottom: 15px;
    appearance: none;
    height: 3px;
    transition: height 0.2s ease-out;
    border-radius: 5px;
    background: linear-gradient(
      93deg,
      ${props => props.primaryColor} ${props => props.progressVideo}%,
      #fff ${props => props.progressVideo}%
    );
    -webkit-appearance: none;
    -moz-appearance: none;

    &:focus {
      outline: none !important;
    }

    &::-moz-focus-outer {
      border: 0;
    }

    &::-ms-track {
      background: transparent;
      border-color: transparent;
      color: transparent;
    }

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      border: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: ${props => props.primaryColor};
      cursor: pointer;

      outline: none !important;
      border-color: transparent;
      border: 0 !important;
      box-shadow: none !important;
      box-sizing: none;
    }

    &::-moz-range-thumb {
      -webkit-appearance: none;
      border: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: ${props => props.primaryColor};
      cursor: pointer;

      outline: none !important;
      border-color: transparent;
      border: 0 !important;
      box-shadow: none !important;
      box-sizing: none;
    }

    &:hover {
      height: 1rem;
    }
  }
`;

export const VideoPreLoading = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  padding: 30px;
  transition: all 0.5s ease-out;
  z-index: ${props => (props.show ? 2 : 0)};
  display: flex;
  flex-direction: column;
  opacity: ${props => (props.show ? 1 : 0)};

  header {
    display: flex;
    color: #ffffff;
    align-items: center;

    h1 {
      color: ${props => props.colorTitle};
      font-size: 1.5em;
      font-weight: bold;
    }

    h2 {
      color: ${props => props.colorSubTitle};
      font-size: 1.1em;
    }

    svg {
      color: ${props => props.colorIcon};
      opacity: 0.5;
      margin-left: auto;
      font-size: 4em;
      padding: 10px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        transform: scale(1.2);
        opacity: 1;
      }
    }
  }

  section {
    text-align: center;
    color: #ddd;
    margin: auto;
    transition: all 0.2s ease;
    opacity: ${props => (props.showError ? 1 : 0)};

    .links-error {
      display: inline-flex;
      margin: auto;

      div {
        color: ${props => props.colorButtonError};
        background: ${props => props.backgroundColorButtonError};
        display: flex;
        align-items: center;
        margin: 0 5px;
        padding: 10px;
        font-weight: bold;
        cursor: pointer;
        border-radius: 5px;
        transition: all 0.2s ease;

        &:hover {
          background: ${props => props.backgroundColorHoverButtonError};
          color: ${props => props.colorHoverButtonError};
        }
      }
    }

    h1 {
      font-size: 2em;
    }

    p {
      font-size: 1.5em;
      margin: 20px;
    }
  }
`;

export const StandyByInfo = styled.div`
  position: absolute;
  top: 0;
  background: rgba(0, 0, 0, 0.8);
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 50px;
  transition: all 0.5s ease-out;
  opacity: ${props => (props.show ? 1 : 0)};

  section {
    margin: auto 0;
    padding-top: 100px;
    padding-left: 100px;

    h3 {
      color: #fff;
      font-size: 1.1em;
      margin-bottom: 5px;
    }

    h1 {
      font-weight: bold;
      font-size: 3em;
      color: ${props => props.primaryColor};
      margin: 10px 0;
    }

    h2 {
      color: ${props => props.secundaryColor};
      font-size: 20px;
      margin-top: -5px;
      font-weight: bold;
    }
  }

  footer {
    margin-top: auto;
    margin-bottom: 50px;
    margin-left: auto;
    text-transform: uppercase;
    color: #ffffff;
  }
`;

export const Loading = styled.div`
  position: absolute;
  height: 100% !important;
  width: 100% !important;
  display: flex;

  div {
    display: flex;
    margin: auto;

    div {
      &:nth-child(2) {
        animation-delay: 0.1s;
      }

      &:nth-child(3) {
        animation-delay: 0.2s;
      }

      animation: 1s linear ${toUpOpacity} infinite;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: ${props => props.color};
      margin: auto 5px;
    }
  }
`;

export const VolumeControll = styled.div`
  .volumn-controll {
    bottom: 70px;
    left: -50px;
    position: absolute;
    transform: rotate(-90deg);

    .box {
      background: #222222;
      padding: 10px 18px;
      border-radius: 5px;
    }

    .box-connector {
      width: 20px;
    }

    input {
      border: none;
      appearance: none;
      height: 5px;
      border-radius: 5px;
      background: #999;
      background: linear-gradient(
        93deg,
        ${props => props.primaryColor} ${props => props.percentVolume}%,
        #fff ${props => props.percentVolume}%
      );
      width: 70px;

      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        border: none;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: ${props => props.primaryColor};
        cursor: pointer;
      }

      &::-moz-range-thumb {
        -webkit-appearance: none;
        border: none;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: ${props => props.primaryColor};
        cursor: pointer;
      }
    }
  }
`;

const ItemControllBar = styled.div`
  bottom: 20px;
  right: -20px;
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 300px;

  .box-connector {
    height: 20px;
    width: 100%;
  }
`;

export const IconPlayBackRate = styled.div`
  cursor: pointer;
  font-weight: bold;

  small {
    font-weight: lighter;
    font-weight: 10px;
  }

  span {
    opacity: 0.2;
    font-size: 25px;
    transition: all 0.2s ease-out;

    &:hover {
      opacity: 1;
      transform: scale(1.2);
    }
  }
`;

export const ItemPlaybackRate = styled(ItemControllBar)`
  cursor: pointer;
  font-weight: bold;
  max-width: 150px;

  & > div:first-child {
    background: #333;
    display: flex;
    flex-direction: column;
    border-radius: 5px;

    .title {
      font-size: 18px;
      font-weight: bold;
      padding: 10px;
      margin: 0;
    }

    .item {
      background: #222;
      display: flex;
      font-size: 14px;
      padding: 10px;
      cursor: pointer;
      transition: all 0.2s ease-out;
      flex-direction: row;
      align-items: center;

      &:hover {
        background: #333;
      }
    }

    svg {
      font-size: 14px !important;
      margin-right: 5px;
    }

    .bold {
      font-weight: bold;
    }
  }
`;

export const ItemNext = styled(ItemControllBar)`
  & > div:first-child {
    background: #333;
    display: flex;
    flex-direction: column;
    border-radius: 5px;

    .title {
      font-size: 18px;
      font-weight: bold;
      padding: 10px;
      margin: 0;
    }

    .item {
      background: #222;
      display: flex;
      flex-direction: column;
      font-size: 14px;
      padding: 10px;
      cursor: pointer;
      transition: all 0.2s ease-out;

      &:hover {
        background: #333;
      }
    }
    .bold {
      font-weight: bold;
    }
  }
`;

export const ItemListReproduction = styled(ItemControllBar)`
  max-width: 400px;
  overflow: hidden;

  & > div:first-child {
    background: #333;
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    overflow: hidden;

    .bold {
      font-weight: bold;
    }

    .title {
      font-size: 18px;
      font-weight: bold;
      padding: 10px;
      margin: 0;
    }

    .list-list-reproduction {
      display: flex;
      flex-direction: column;
      max-height: 400px;
      overflow: auto;

      &::-webkit-scrollbar-track {
        background-color: #222;
      }

      &::-webkit-scrollbar {
        width: 8px;
      }

      &::-webkit-scrollbar-thumb {
        background: #333;
      }

      .item-list-reproduction {
        background: #222;
        display: flex;
        flex-direction: row;
        font-size: 14px;
        padding: 10px;
        cursor: pointer;
        transition: all 0.2s ease-out;
        align-items: center;

        &:hover {
          background: #333;
        }

        .percent {
          height: 3px;
          width: 100px;
          margin-left: auto;
        }
      }

      .selected {
        background: #333;
      }
    }
  }
`;

export const ItemListQuality = styled(ItemControllBar)`
  max-width: 200px;
  min-width: 200px;

  & > div:first-child {
    font-size: 14px;
    background: #222222;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    div {
      display: flex;
      align-items: center;
      padding: 10px;
      cursor: pointer;

      &:hover {
        background: #333;
      }
    }

    span {
      margin-right: 5px;

      &:nth-child(1) {
        font-weight: bold;
      }
    }

    svg {
      color: #f78b28;
      font-size: 2em;
      margin-left: auto;
    }
  }
`;
