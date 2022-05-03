import React, { useState } from 'react';
import styled from 'styled-components/macro';

const Toggle = ({ initialState, onClick }) => {
  const [active, setActive] = useState(initialState);

  return (
    <Container
      active={active}
      onClick={() => {
        setActive((prev) => !prev);
        if (onClick) {
          onClick(!active);
        }
      }}
    >
      <Circle active={active} />
    </Container>
  );
};

export default Toggle;

const Container = styled.div`
  cursor: pointer;
  border: ${({ theme: { colors } }) => `1px solid ${colors.white}`};
  border-radius: 24px;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 4px;
  background-color: ${({ active, theme: { colors } }) => (active ? colors.white : 'transparent')};
  width: 48px;
`;

const Circle = styled.div`
  border-radius: 50%;
  height: 16px;
  width: 16px;
  transition: transform 0.5s;
  transform: ${({ active }) => (active ? 'translateX(calc(100% + 4px))' : 'translateX(0)')};
  background-color: ${({ active, theme: { colors } }) => (active ? colors.primary : colors.white)};
`;
