import { Controller } from 'react-hook-form';

import Editor, { SunEditorComponentProps } from '@components/organisms/editor/Editor';

interface RHFEditorProps extends SunEditorComponentProps {
  name: string;
  isEditMode: boolean;
}

const RHFEditor = ({ name = 'editor', isEditMode }: RHFEditorProps) => {
  return (
    <Controller
      name={name}
      render={({ field }) => (
        <Editor isEditMode={isEditMode} html={field.value} setContents={field.value} onChange={field.onChange} />
      )}
    />
  );
};

RHFEditor.displayName = 'RHFEditor';

export default RHFEditor;
