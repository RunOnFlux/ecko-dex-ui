/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from 'react';
import styled, { css } from 'styled-components/macro';
import { ArrowBack } from '../../assets';
import TxView from '../../components/swap/swap-modals/TxView';
import WalletRequestView from '../../components/swap/swap-modals/WalletRequestView';
import { WalletContext } from '../../contexts/WalletContext';
import CustomButton from '../../components/shared/CustomButton';
import FormContainer from '../../components/shared/FormContainer';
import Input from '../../components/shared/Input';
import { PRECISION } from '../../constants/contextConstants';
import tokenData from '../../constants/cryptoCurrencies';
import { extractDecimal, limitDecimalPlaces, pairUnit, reduceBalance } from '../../utils/reduceBalance';
import { theme } from '../../styles/theme';
import { LiquidityContext } from '../../contexts/LiquidityContext';
import { GameEditionContext } from '../../contexts/GameEditionContext';
import GradientBorder from '../../components/shared/GradientBorder';
import { LightModeContext } from '../../contexts/LightModeContext';
import { ModalContext } from '../../contexts/ModalContext';
import Label from '../../components/shared/Label';
import PixeledSwapResult from '../../assets/images/game-edition/pixeled-swap-result.png';

const Container = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;

  margin-left: auto;
  margin-right: auto;
  justify-content: ${({ $gameEditionView }) => ($gameEditionView ? 'space-between' : 'center')};
  ${({ $gameEditionView }) => {
    if ($gameEditionView) {
      return css`
        justify-content: space-between;
        width: 100%;
      `;
    }
    return css`
      justify-content: center;
      max-width: 550px;
      width: 550px;
    `;
  }}
`;

const SubContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  width: 100%;

  & > *:first-child {
    margin-bottom: 16px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  & > button:not(:last-child) {
    margin-right: 4px;
  }
  & > button:last-child {
    margin-right: 0px;
  }
`;

const MyButtonDivider = styled.div`
  width: 2%;
  height: auto;
  display: inline-block;
`;

const ResultContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 16px 0px;
  flex-flow: column;
  width: 100%;
  padding: ${({ gameEditionView }) => gameEditionView && '10px'};

  ${({ gameEditionView }) => {
    if (gameEditionView) {
      return css`
        display: flex;
        flex-flow: row;
        justify-content: space-between;
        margin: 10px 0px 0px;
        padding: 0px 10px;
        width: 436px;
        overflow-x: auto;
        overflow-y: hidden;
        white-space: nowrap;
      `;
    }
  }}

  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
    flex-flow: column;
  }
`;

const InnerRowContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${({ gameEditionView }) => !gameEditionView && '10px'};
  flex-flow: row;

  ${({ gameEditionView }) => {
    if (gameEditionView) {
      return css`
        margin-right: 15px;
        display: flex;
        flex-flow: column;
        min-width: 194px;
        min-height: 64px;
        justify-content: center;
        text-align: center;
        align-items: center;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        background-image: ${`url(${PixeledSwapResult})`};
      `;
    }
  }}

  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
    margin-bottom: 5px;
    flex-flow: row;
  }
`;

const RemoveLiqContainer = (props) => {
  const wallet = useContext(WalletContext);
  const liquidity = useContext(LiquidityContext);
  const { themeMode } = useContext(LightModeContext);
  const modalContext = useContext(ModalContext);
  const { gameEditionView, openModal, closeModal } = useContext(GameEditionContext);
  const { token0, token1, balance, pooledAmount } = props.pair;

  const [amount, setAmount] = useState(100);
  const [showTxModal, setShowTxModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pooled, setPooled] = useState(balance);
  const [pooledToken0, setPooledToken0] = useState(reduceBalance(pooledAmount[0], 12));

  const [pooledToken1, setPooledToken1] = useState(reduceBalance(pooledAmount[1], 12));

  useEffect(() => {
    if (!isNaN(amount)) {
      setPooled(reduceBalance((extractDecimal(balance) * amount) / 100, PRECISION));
      setPooledToken0(reduceBalance((extractDecimal(pooledAmount[0]) * amount) / 100, PRECISION));
      setPooledToken1(reduceBalance((extractDecimal(pooledAmount[1]) * amount) / 100, PRECISION));
    }
  }, [amount]);

  useEffect(() => {
    if (wallet.walletSuccess) {
      //?//
      setLoading(false);
      wallet.setWalletSuccess(false);
    }
  }, [wallet.walletSuccess]);

  const onWalletRequestViewModalClose = () => {
    wallet.setIsWaitingForWalletAuth(false);
    wallet.setWalletError(null);
  };

  useEffect(() => {
    if (showTxModal) {
      if (gameEditionView) {
        openModal({
          title: 'transaction details',
          closeModal: () => {
            setShowTxModal(false);
            closeModal();
          },
          content: (
            <TxView
              view="Remove Liquidity"
              token0={token0}
              onClose={() => {
                setShowTxModal(false);
                closeModal();
              }}
              token1={token1}
            />
          ),
        });
      } else {
        modalContext.openModal({
          title: 'transaction details',
          description: '',
          onClose: () => {
            setShowTxModal(false);
            modalContext.closeModal();
          },
          content: (
            <TxView
              view="Remove Liquidity"
              token0={token0}
              onClose={() => {
                setShowTxModal(false);
                modalContext.closeModal();
              }}
              token1={token1}
            />
          ),
        });
      }
    }
  }, [showTxModal]);

  return (
    <Container $gameEditionView={gameEditionView}>
      <WalletRequestView show={wallet.isWaitingForWalletAuth} error={wallet.walletError} onClose={() => onWalletRequestViewModalClose()} />
      <Label
        fontSize={32}
        geCenter
        fontFamily="bold"
        geFontSize={44}
        labelStyle={{ marginBottom: 14 }}
        geLabelStyle={{ lineHeight: '32px', marginBottom: 10 }}
        onClose={() => props.closeLiquidity()}
      >
        {!gameEditionView && (
          <ArrowBack
            style={{
              cursor: 'pointer',
              color: theme(themeMode).colors.white,
              marginRight: '15px',
              justifyContent: 'center',
            }}
            onClick={() => props.closeLiquidity()}
          />
        )}
        Remove Liquidity
      </Label>

      <FormContainer
        containerStyle={gameEditionView ? { border: 'none', padding: 0 } : {}}
        footer={
          <ButtonContainer gameEditionView={gameEditionView}>
            <CustomButton
              fluid
              type="secondary"
              loading={loading}
              disabled={isNaN(amount) || reduceBalance(amount) === 0}
              onClick={async () => {
                if (wallet.signing.method !== 'sign' && wallet.signing.method !== 'none') {
                  setLoading(true);
                  const res = await liquidity.removeLiquidityLocal(tokenData[token0].code, tokenData[token1].code, reduceBalance(pooled, PRECISION));
                  if (res === -1) {
                    setLoading(false);
                    alert('Incorrect password. If forgotten, you can reset it with your private key');
                    return;
                  } else {
                    setShowTxModal(true);
                    setLoading(false);
                  }
                } else {
                  setLoading(true);
                  const res = await liquidity.removeLiquidityWallet(tokenData[token0].code, tokenData[token1].code, reduceBalance(pooled, PRECISION));
                  if (!res) {
                    wallet.setIsWaitingForWalletAuth(true);
                    setLoading(false);
                    /* pact.setWalletError(true); */
                    /* walletError(); */
                  } else {
                    wallet.setWalletError(null);
                    setShowTxModal(true);
                    setLoading(false);
                  }
                }
              }}
            >
              Press B to remove liquidity
            </CustomButton>
          </ButtonContainer>
        }
      >
        {!gameEditionView && <GradientBorder />}
        <SubContainer gameEditionView={gameEditionView}>
          <Input
            value={amount}
            error={isNaN(amount)}
            topLeftLabel="Pool Tokens to Remove"
            placeholder="Enter Amount"
            size="large"
            color={gameEditionView && '#fff'}
            withBorder
            label={{ content: '%' }}
            onChange={(e) => {
              if (Number(e.target.value) <= 100 && Number(e.target.value) >= 0) {
                setAmount(limitDecimalPlaces(e.target.value, 2));
              }
            }}
            numberOnly
          />
          <ButtonContainer>
            <CustomButton
              fluid
              type={amount === 25 ? 'secondary' : 'primary'}
              background={gameEditionView && amount === 25 && '#6D99E4'}
              onClick={() => setAmount(25)}
            >
              25%
            </CustomButton>
            <MyButtonDivider />
            <CustomButton
              fluid
              type={amount === 50 ? 'secondary' : 'primary'}
              background={gameEditionView && amount === 50 && '#6D99E4'}
              onClick={() => setAmount(50)}
            >
              50%
            </CustomButton>
            <MyButtonDivider />
            <CustomButton
              fluid
              type={amount === 75 ? 'secondary' : 'primary'}
              background={gameEditionView && amount === 75 && '#6D99E4'}
              onClick={() => setAmount(75)}
            >
              75%
            </CustomButton>
            <MyButtonDivider />
            <CustomButton
              fluid
              type={amount === 100 ? 'secondary' : 'primary'}
              background={gameEditionView && amount === 100 && '#6D99E4'}
              onClick={() => setAmount(100)}
            >
              100%
            </CustomButton>
          </ButtonContainer>
        </SubContainer>

        <ResultContainer gameEditionView={gameEditionView}>
          <InnerRowContainer gameEditionView={gameEditionView}>
            <Label fontSize={13} geFontSize={20} geColor="blue">
              {token0} per {token1}
            </Label>
            <Label geFontSize={28} fontSize={13} fontFamily="bold">
              {pairUnit(extractDecimal(pooled))}
            </Label>
          </InnerRowContainer>
          <InnerRowContainer gameEditionView={gameEditionView}>
            <Label fontSize={13} geFontSize={20} geColor="blue">
              Pooled {token0}
            </Label>
            <Label geFontSize={28} fontSize={13} fontFamily="bold">
              {pairUnit(extractDecimal(pooledToken0))}
            </Label>
          </InnerRowContainer>
          <InnerRowContainer gameEditionView={gameEditionView}>
            <Label fontSize={13} geFontSize={20} geColor="blue">
              Pooled {token1}
            </Label>
            <Label geFontSize={28} fontSize={13} fontFamily="bold">
              {pairUnit(extractDecimal(pooledToken1))}
            </Label>
          </InnerRowContainer>
        </ResultContainer>
      </FormContainer>
    </Container>
  );
};

export default RemoveLiqContainer;
