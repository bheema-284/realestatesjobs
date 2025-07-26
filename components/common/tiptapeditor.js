// components/TiptapEditor.jsx
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';

import {
  ListBulletIcon,
  Bars4Icon,
  PhotoIcon,
  CodeBracketIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  LinkIcon,
} from '@heroicons/react/24/outline';
import React, { useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import {
  FaBold,
  FaItalic,
  FaUnderline,
} from 'react-icons/fa';


const TiptapEditor = forwardRef(({ initialContent, onContentChange, className }, ref) => {
  // Add a state to trigger re-render of toolbar
  const [editorState, setEditorState] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Image,
      Underline,
    ],
    immediatelyRender: false,
    content: initialContent,
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
      // Also update state on content change to ensure toolbar is always in sync
      setEditorState(prev => prev + 1);
    },
    // Crucial addition for selection-based active state updates
    onSelectionUpdate: () => {
      setEditorState(prev => prev + 1); // Increment state to force re-render of buttons
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none p-4 border border-gray-300 rounded-md min-h-[200px] overflow-y-auto ${className || ''}`,
      },
    },
  });

  useImperativeHandle(ref, () => ({
    clearContent: () => {
      editor?.commands.clearContent();
    },
  }));

  useEffect(() => {
    // Only set content if the editor exists and the content is different
    // This prevents unnecessary re-renders and potential cursor jumps
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent || '', false);
    }
  }, [initialContent, editor]); // Depend on editor instance and initialContent

  if (!editor) {
    return (
      <div className="p-4 border border-gray-300 rounded-md min-h-[200px] bg-gray-50 flex items-center justify-center text-gray-500">
        Loading rich text editor...
      </div>
    );
  }

  const addImage = () => {
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <>
      <div className="border border-gray-300 rounded-md rounded-b-none p-2 flex flex-wrap gap-2 bg-gray-50">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-1 rounded ${editor.isActive('bold') ? 'bg-indigo-200' : 'hover:bg-gray-200'}`}
          title="Bold"
        >
          <FaBold />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-1 rounded ${editor.isActive('italic') ? 'bg-indigo-200' : 'hover:bg-gray-200'}`}
          title="Italic"
        >
          <FaItalic />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          className={`p-1 rounded ${editor.isActive('underline') ? 'bg-indigo-200' : 'hover:bg-gray-200'}`}
          title="Underline"
        >
          <FaUnderline />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={!editor.can().chain().focus().toggleBulletList().run()}
          className={`p-1 rounded ${editor.isActive('bulletList') ? 'bg-indigo-200' : 'hover:bg-gray-200'}`}
          title="Bullet List"
        >
          <ListBulletIcon className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={!editor.can().chain().focus().toggleOrderedList().run()}
          className={`p-1 rounded ${editor.isActive('orderedList') ? 'bg-indigo-200' : 'hover:bg-gray-200'}`}
          title="Ordered List"
        >
          <Bars4Icon className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => {
            const previousUrl = editor.getAttributes('link').href;
            const url = window.prompt('URL', previousUrl);

            if (url === null) {
              return;
            }
            if (url === '') {
              editor.chain().focus().unsetLink().run();
              return;
            }
            editor.chain().focus().setLink({ href: url }).run();
          }}
          className={`p-1 rounded ${editor.isActive('link') ? 'bg-indigo-200' : 'hover:bg-gray-200'}`}
          title="Add Link"
        >
          <LinkIcon className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={addImage}
          className="p-1 rounded hover:bg-gray-200"
          title="Add Image"
        >
          <PhotoIcon className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
          className={`p-1 rounded ${editor.isActive('codeBlock') ? 'bg-indigo-200' : 'hover:bg-gray-200'}`}
          title="Code Block"
        >
          <CodeBracketIcon className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1 rounded hover:bg-gray-200"
          title="Undo"
        >
          <ArrowUturnLeftIcon className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1 rounded hover:bg-gray-200"
          title="Redo"
        >
          <ArrowUturnRightIcon className="h-5 w-5" />
        </button>
      </div>

      <EditorContent editor={editor} className="mt-0" />
    </>
  );
});

// Add the displayName property here
TiptapEditor.displayName = 'TiptapEditor';

export default TiptapEditor;