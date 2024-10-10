import { ButtonProps } from '@src/components/atoms/Button';

export interface DetailButtonProps extends Omit<ButtonProps, 'children'> {
  handleConfirm: () => void;
  bodyText?: string | string[];
}

export interface OnlyOnClick {
  onClick: NonNullable<DetailButtonProps['onClick']>;
}
