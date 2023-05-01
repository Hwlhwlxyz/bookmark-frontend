import '@uiw/react-markdown-preview/markdown.css';
import '@uiw/react-md-editor/markdown-editor.css';
import dynamic from 'next/dynamic';
import { forwardRef, useState } from 'react';

const MDEditor = dynamic(
    () => import('@uiw/react-md-editor').then((mod) => mod.default),
    { ssr: false },
);
const EditerMarkdown = dynamic(
    () =>
        import('@uiw/react-md-editor').then((mod) => {
            return mod.default.Markdown;
        }),
    { ssr: false },
);

interface EditorProp {
    value: string | undefined;
    onChange: (arg0: string) => void;
}

function Editor(props: EditorProp) {
    const [value, setValue] = useState(props.value || '');
    function handleChange(str: string) {
        setValue(str || '');
        if (props.onChange) {
            props.onChange(str);
        }
    }
    return (
        <div data-color-mode="light" style={{ width: '100%' }}>
            <MDEditor
                value={value}
                onChange={(str) => handleChange(str || '')}
            />
            <div>{/* <EditerMarkdown source={value} /> */}</div>
        </div>
    );
}

export default Editor;
