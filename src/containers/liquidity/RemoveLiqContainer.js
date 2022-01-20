/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from 'react';
import { Button } from 'semantic-ui-react';
import styled, { css } from 'styled-components/macro';
import { ArrowBack } from '../../assets';
import TxView from '../../components/swap/swap-modals/TxView';
import WalletRequestView from '../../components/swap/swap-modals/WalletRequestView';
import { WalletContext } from '../../contexts/WalletContext';
import { ReactComponent as CloseGE } from '../../assets/images/shared/close-ge.svg';
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

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  width: 100%;
  max-width: ${({ gameEditionView }) => !gameEditionView && `550px`};
  margin-left: auto;
  margin-right: auto;
  padding: ${({ gameEditionView }) => gameEditionView && `10px 10px`};
  margin-top: 0px;
  position: relative;

  ${({ gameEditionView }) => {
    if (gameEditionView) {
      return css`
        height: 100%;
        display: flex;
        flex-direction: column;
      `;
    } else {
      return css`
        max-width: 550px;
      `;
    }
  }}
`;

const SubContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  width: 100%;
  padding: ${({ gameEditionView }) => gameEditionView && '10px'};

  & > *:first-child {
    margin-bottom: 16px;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ gameEditionView }) => (gameEditionView ? '10px' : `14px`)};
  width: 100%;
  padding: ${({ gameEditionView }) => gameEditionView && '10px'};
`;

const Title = styled.span`
  font: ${({ theme: { fontFamily }, gameEditionView }) =>
    gameEditionView ? `normal normal normal 16px/19px ${fontFamily.pressStartRegular}` : `normal normal bold 32px/57px ${fontFamily.bold}`};
  letter-spacing: 0px;
  color: ${({ theme: { colors }, gameEditionView }) => (gameEditionView ? `${colors.black}` : `${colors.white}`)};
  text-transform: capitalize;

  svg {
    path {
      fill: ${({ theme: { colors } }) => colors.white};
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
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
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
    flex-flow: column;
  }
`;

const InnerRowContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${({ gameEditionView }) => !gameEditionView && '10px'};
  flex-flow: row;
  @media (max-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel + 1}px`}) {
    margin-bottom: 5px;
    flex-flow: row;
  }
`;

const Label = styled.span`
  font: ${({ theme: { fontFamily }, gameEditionView }) =>
    gameEditionView ? `normal normal normal 10px/12px ${fontFamily.pressStartRegular}` : `normal normal normal 13px/16px ${fontFamily.regular}`};
  color: ${({ theme: { colors }, gameEditionView }) => (gameEditionView ? `${colors.black}` : `${colors.white}`)};
  text-transform: capitalize;
`;

const Value = styled.span`
  font: ${({ theme: { fontFamily }, gameEditionView }) =>
    gameEditionView ? `normal normal normal 10px/12px ${fontFamily.pressStartRegular}` : `normal normal normal 13px/16px ${fontFamily.bold}`};
  line-height: 20px;
  color: ${({ theme: { colors }, gameEditionView }) => (gameEditionView ? `${colors.black}` : `${colors.white}`)};
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
    <Container gameEditionView={gameEditionView}>
      <WalletRequestView show={wallet.isWaitingForWalletAuth} error={wallet.walletError} onClose={() => onWalletRequestViewModalClose()} />
      <TitleContainer gameEditionView={gameEditionView}>
        <Title gameEditionView={gameEditionView}>
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
        </Title>
        {gameEditionView && <CloseGE onClick={() => props.closeLiquidity()} />}
      </TitleContainer>

      <FormContainer
        containerStyle={gameEditionView ? { border: 'none', padding: 0 } : {}}
        footer={
          <ButtonContainer gameEditionView={gameEditionView}>
            <Button.Group fluid style={{ padding: 0 }}>
              <CustomButton
                type="secondary"
                loading={loading}
                disabled={isNaN(amount) || reduceBalance(amount) === 0}
                onClick={async () => {
                  if (wallet.signing.method !== 'sign' && wallet.signing.method !== 'none') {
                    setLoading(true);
                    const res = await liquidity.removeLiquidityLocal(
                      tokenData[token0].code,
                      tokenData[token1].code,
                      reduceBalance(pooled, PRECISION)
                    );
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
                    const res = await liquidity.removeLiquidityWallet(
                      tokenData[token0].code,
                      tokenData[token1].code,
                      reduceBalance(pooled, PRECISION)
                    );
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
                Remove Liquidity
              </CustomButton>
            </Button.Group>
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
            label={{ content: '%' }}
            onChange={(e) => {
              if (Number(e.target.value) <= 100 && Number(e.target.value) >= 0) {
                setAmount(limitDecimalPlaces(e.target.value, 2));
              }
            }}
            numberOnly
          />
          <ButtonContainer gameEditionView={gameEditionView} style={gameEditionView ? { marginTop: '3px' } : {}}>
            <Button.Group fluid>
              <CustomButton
                buttonStyle={{
                  width: '20%',
                }}
                type={amount === 25 ? 'secondary' : 'primary'}
                onClick={() => setAmount(25)}
              >
                25%
              </CustomButton>
              <MyButtonDivider />
              <CustomButton
                buttonStyle={{
                  width: '20%',
                }}
                type={amount === 50 ? 'secondary' : 'primary'}
                onClick={() => setAmount(50)}
              >
                50%
              </CustomButton>
              <MyButtonDivider />
              <CustomButton
                buttonStyle={{
                  width: '20%',
                }}
                type={amount === 75 ? 'secondary' : 'primary'}
                onClick={() => setAmount(75)}
              >
                75%
              </CustomButton>
              <MyButtonDivider />
              <CustomButton
                buttonStyle={{
                  width: '20%',
                }}
                type={amount === 100 ? 'secondary' : 'primary'}
                onClick={() => setAmount(100)}
              >
                100%
              </CustomButton>
            </Button.Group>
          </ButtonContainer>
        </SubContainer>

        <ResultContainer gameEditionView={gameEditionView}>
          <InnerRowContainer gameEditionView={gameEditionView}>
            <Label gameEditionView={gameEditionView}>
              {token0} per {token1}
            </Label>
            <Value gameEditionView={gameEditionView}>{pairUnit(extractDecimal(pooled))}</Value>
          </InnerRowContainer>
          <InnerRowContainer gameEditionView={gameEditionView}>
            <Label gameEditionView={gameEditionView}>Pooled {token0}</Label>
            <Value gameEditionView={gameEditionView}>{pairUnit(extractDecimal(pooledToken0))}</Value>
          </InnerRowContainer>
          <InnerRowContainer gameEditionView={gameEditionView}>
            <Label gameEditionView={gameEditionView}>Pooled {token1}</Label>
            <Value gameEditionView={gameEditionView}>{pairUnit(extractDecimal(pooledToken1))}</Value>
          </InnerRowContainer>
        </ResultContainer>
      </FormContainer>
    </Container>
  );
};

export default RemoveLiqContainer;
