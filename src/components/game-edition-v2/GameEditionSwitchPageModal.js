import React, { useState, useContext, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components/macro';
import { GameEditionContext } from '../../contexts/GameEditionContext';

import menuItems, { POOL, STATS, SWAP } from '../menuItems';
import GameEditionLabel from './components/GameEditionLabel';
import { PixeledArrowDownIcon } from '../../assets';
import { useHistory, useLocation } from 'react-router-dom';
import { useGameEditionContext } from '../../contexts';

const SCROLL_OFFSET = 95;

const Content = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  max-width: 100%;
  height: 100%;
`;

const ItemsContainer = styled.div`
  display: flex;
  flex-flow: row;
  width: 436px;
  overflow-x: auto;
  scroll-behavior: smooth;
  & > div:first-child {
    margin-left: ${SCROLL_OFFSET}px;
  }
  & > div:last-child {
    margin-right: ${SCROLL_OFFSET}px;
  }
`;
const IconContainer = styled.div`
  margin-bottom: 10px;
  .rotated {
    transform: rotate(180deg);
  }
  svg {
    width: 20px;
    height: 20px;

    path {
      fill: ${({ theme: { colors } }) => colors.gameEditionYellow};
    }
  }
`;

const Item = styled.div`
  display: flex;
  justify-content: center;
`;

const GameEditionSwitchPageModal = ({ direction }) => {
  const location = useLocation();
  const history = useHistory();
  const { closeModal } = useGameEditionContext();
  const [translateX, setTranslateX] = useState(0);

  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const { setButtons } = useContext(GameEditionContext);

  const getCorrectSwitchIndex = (itemIndex) => {
    let index = null;
    if (direction === 'left') {
      if (itemIndex - 1 < 0) {
        index = itemIndex;
      } else {
        index = itemIndex - 1;
      }
    } else {
      if (itemIndex + 1 > menuItems.length) {
        index = itemIndex;
      } else {
        index = itemIndex + 1;
      }
    }
    return index;
  };

  // init index based on the current route when this page is rendered
  useEffect(() => {
    let index = null;
    switch (location.pathname) {
      case SWAP.route:
        const swapIndex = menuItems.findIndex((r) => r.id === SWAP.id);
        index = getCorrectSwitchIndex(swapIndex);
        setSelectedItemIndex(index);
        break;
      case POOL.route:
        const poolIndex = menuItems.findIndex((r) => r.id === POOL.id);
        index = getCorrectSwitchIndex(poolIndex);
        setSelectedItemIndex(index);
        break;
      case STATS.route:
        const statsIndex = menuItems.findIndex((r) => r.id === STATS.id);
        index = getCorrectSwitchIndex(statsIndex);
        setSelectedItemIndex(index);
        break;
      default:
        if (direction === 'left') {
          index = 0;
        } else {
          index = 1;
        }
        break;
    }
    if (direction === 'right' && index + 1 < menuItems.length) {
      const scrollX = index + 1 === 1 ? SCROLL_OFFSET : 0;
      onSwitch(direction, index, scrollX);
    }
    if (direction === 'left' && index - 1 >= 0) {
      const scrollX = index + 1 === menuItems.length ? SCROLL_OFFSET : 0;
      onSwitch(direction, index, scrollX);
    }
  }, []);

  const startTimer = () => {
    const interval = setInterval(() => {
      setSeconds((seconds) => seconds + 1);
    }, 1000);
    setIntervalId(interval);
  };

  const stopTimer = () => {
    clearInterval(setSeconds(0));
  };
  console.log('secondsCount', seconds);
  // init buttons and starting interval to navigate into selected page after 2 seconds
  useEffect(() => {
    setButtons({
      R1: () => onSwitch('right'),
      L1: () => onSwitch('left'),
    });
    stopTimer();
    startTimer();
  }, [selectedItemIndex]);

  // navigate to page if secondsCount === 2
  useEffect(() => {
    if (seconds === 5) {
      setButtons({
        R1: null,
        L1: null,
      });
      closeModal();

      history.push(menuItems[selectedItemIndex].route);
    }
  }, [seconds]);

  // funcation on L1 and R1 buttons
  const onSwitch = (direction, index, scrollX) => {
    if (direction === 'right' && selectedItemIndex + 1 < menuItems.length) {
      setSelectedItemIndex((prev) => index || prev + 1);

      setTranslateX((prev) => prev + 274 + (scrollX || 0));
    }
    if (direction === 'left' && selectedItemIndex - 1 >= 0) {
      setSelectedItemIndex((prev) => index || prev - 1);

      setTranslateX((prev) => prev - 274 - (scrollX || 0));
    }
  };

  useEffect(() => {
    const elementContainer = document.getElementById('switch-items-container');
    if (elementContainer) {
      elementContainer.scrollTo(translateX, 0);
    }
  }, [translateX]);

  return (
    <Content>
      <IconContainer>
        <PixeledArrowDownIcon />
      </IconContainer>
      <ItemsContainer id="switch-items-container" translateX={translateX}>
        {menuItems.map((item, i) => {
          const isSelected = selectedItemIndex === item.id;
          return (
            <Item key={i} selected={isSelected} style={{ minWidth: 274 }}>
              <GameEditionLabel fontSize={92} color={isSelected ? 'yellow' : 'grey'}>
                {item.label}
              </GameEditionLabel>
            </Item>
          );
        })}
      </ItemsContainer>
      <IconContainer>
        <PixeledArrowDownIcon className="rotated" />
      </IconContainer>
    </Content>
  );
};

export default GameEditionSwitchPageModal;
