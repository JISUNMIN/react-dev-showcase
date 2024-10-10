// NOTE: Mixin 모음

interface FlexProps {
  direction?: string;
  align?: string;
  justify?: string;
  gap?: string;
}

interface GridProps {
  columns?: string;
  rows?: string;
  gap?: string;
  align?: string;
  justify?: string;
}

interface FontProps {
  family?: string;
  size?: string;
  weight?: string;
}

interface SizeProps {
  w?: string;
  h?: string;
}

interface TruncateProps {
  width: string;
  line: number;
}

interface PositionProps {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
}
interface PseudoElementProps extends PositionProps {
  width?: string;
  height?: string;
}

export const flex = ({ direction, align, justify, gap }: FlexProps) => `
  display: flex;
  flex-direction: ${direction ?? 'row'};
  align-items: ${align ?? 'center'};
  justify-content: ${justify ?? 'center'};
  gap: ${gap ?? '10px'};
`;

export const grid = ({ columns, rows, gap, align, justify }: GridProps) => `
  display: grid;
  grid-template-columns: ${columns ?? '1fr'};
  grid-template-rows: ${rows ?? 'auto'};
  gap: ${gap ?? '10px'};
  align-items: ${align ?? 'stretch'};
  justify-items: ${justify ?? 'stretch'};

`;

export const font = ({ family, size, weight }: FontProps) => `
  font-family: ${family ?? 'inherit'};
  font-size: ${size ?? '1rem'};
  font-weight: ${weight ?? '600'};
`;

export const size = ({ w, h = w }: SizeProps) => `
  width: ${w ?? '100px'};
  height: ${h};
`;

export const truncate = ({ width, line }: TruncateProps) => `
  width: ${width};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: break-word;
  -webkit-line-clamp: ${line ?? 2};
`;

export const absolute = ({ top, bottom, left, right }: PositionProps) => `
  position: absolute;
  top: ${top ?? ''};
  bottom: ${bottom ?? ''};
  left: ${left ?? ''};
  right: ${right ?? ''};
`;

export const PseudoElement = ({ width, height, top, bottom, left, right }: PseudoElementProps) => `
  display: block;
  content: '';
  width: ${width};
  height: ${height};
  ${absolute({ top, bottom, left, right })}

`;

const customMediaQuery = (maxWidth: number): string => {
  return `@media (max-width: ${maxWidth}px)`;
};

export const media = {
  custom: customMediaQuery,
  xs: customMediaQuery(400),
  sm: customMediaQuery(640),
  md: customMediaQuery(768),
  lg: customMediaQuery(1024),
  xl: customMediaQuery(1280),
};
