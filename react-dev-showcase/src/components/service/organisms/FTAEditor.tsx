import { ComponentProps } from 'react';

import { RHFEditor } from '@src/components/rhf';

export interface FTAEditorProps extends ComponentProps<typeof RHFEditor> {}

const FTAEditor = ({ ...rest }: FTAEditorProps) => {
  return <RHFEditor {...rest} />;
};

FTAEditor.displayName = 'FTAEditor';

export default FTAEditor;
