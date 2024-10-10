import { ReactNode, useState } from 'react';

import styled from 'styled-components';

import { BottomSheetIcon } from '@src/assets/images';
import { Button, Div, Img } from '@src/components/atoms';
import { flex, font, size } from '@src/styles/variables';

export interface AccordionProps {
  title: string;
  children: ReactNode;
}

const AccordionContainer = styled(Div)`
  --padding: 10px 0px;
  border-top: 1px solid ${({ theme }) => theme.colors.gray03};
  padding: var(--padding);
  border-radius: 4px;
`;

const AccordionHeader = styled(Button)`
  ${flex({ justify: 'space-between' })}
  width: 100%;
  padding: var(--padding);
  cursor: pointer;
`;

const AccordionContent = styled(Div)<{ isOpen: boolean }>`
  padding: var(--padding);
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`;

const AccordionTitle = styled.span`
  ${font({ size: '24px', weight: '700' })}
`;

const Icon = styled(Img)<{ isOpen: boolean }>`
  ${size({ w: '40px', h: '40px' })}
  opacity: 0.9;
  transform: ${({ isOpen }) => isOpen && 'rotate(180deg)'};
`;

const Accordion = ({ title, children }: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <AccordionContainer>
      <AccordionHeader onClick={toggleAccordion}>
        <AccordionTitle>{title}</AccordionTitle>
        <Icon isOpen={isOpen} src={BottomSheetIcon} />
      </AccordionHeader>
      <AccordionContent isOpen={isOpen}>{children}</AccordionContent>
    </AccordionContainer>
  );
};

export default Accordion;
