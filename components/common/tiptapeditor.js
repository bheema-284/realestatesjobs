// components/TiptapEditor.jsx
// This component should ONLY render on the client side

'use client'; // This directive is crucial for App Router in Next.js 13+

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import {
  BoldTextIcon, // Adjust these imports based on your actual Heroicons usage
  ItalicTextIcon,
  LinkIcon,
  ListBulletIcon,
  Bars4Icon ,
  PhotoIcon,
  CodeBracketIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
} from '@heroicons/react/24/outline';
import React, { useEffect, forwardRef, useImperativeHandle } from 'react'; // forwardRef and useImperativeHandle for external control
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaCode,
  FaListOl, // for ordered list
} from 'react-icons/fa';
// Create an SVG component for Bold and Italic (since Heroicons 24/outline doesn't have these directly)
const BoldIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" {...props}>
    <path fillRule="evenodd" d="M9.75 3H12a2.25 2.25 0 0 1 2.25 2.25v1.375c0 1.05-.623 1.943-1.5 2.36V12a2.25 2.25 0 0 1-2.25 2.25H9.75a2.25 2.25 0 0 1-2.25-2.25V5.25A2.25 2.25 0 0 1 9.75 3Zm0 9V5.25H12V12h-2.25ZM9 15.75c0-.974.595-1.813 1.45-2.203.234.307.48.59.736.856l-.545 1.761A2.25 2.25 0 0 1 9 15.75Zm0 3.75c0-.974.595-1.813 1.45-2.203.234.307.48.59.736.856l-.545 1.761A2.25 2.25 0 0 1 9 19.5ZM19.5 7.5H12V21h7.5A2.25 2.25 0 0 0 21 18.75V9.75A2.25 2.25 0 0 0 19.5 7.5Zm-7.5 1.5h6V12h-6V9ZM12 13.5h6V16.5h-6V13.5Z" clipRule="evenodd" />
  </svg>
);

const ItalicIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" {...props}>
    <path fillRule="evenodd" d="M12.75 6.75H10.5V18h2.25v-1.5H16.5V15h-4.5V9h4.5V7.5H12.75V6.75ZM6 6.75H8.25V18H6v-1.5H3V15h3V9h-3V7.5H6V6.75ZM18.75 6.75H21V18h-2.25v-1.5H15V15h3.75V9h-3.75V7.75H18.75V6.75Z" clipRule="evenodd" />
  </svg>
);


const TiptapEditor = forwardRef(({ initialContent, onContentChange, className }, ref) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Image,
    ],
    // *** Crucial for SSR in Next.js ***
    immediatelyRender: false, // Prevents Tiptap from rendering on the server
    content: initialContent, // Set initial content
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none p-4 border border-gray-300 rounded-md min-h-[200px] overflow-y-auto ${className || ''}`,
      },
    },
  });

  // Expose editor methods to parent component if needed (e.g., for clearing content)
  useImperativeHandle(ref, () => ({
    clearContent: () => {
      editor?.commands.clearContent();
    },
    // You can add other methods like:
    // setContent: (html) => editor?.commands.setContent(html),
  }));

  // Effect to set initial content when editor is ready or initialContent changes
  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent || '', false); // false for no history entry
    }
  }, [initialContent, editor]);

  // Render a loading state or nothing on the server
  if (!editor) {
    return <div className="p-4 border border-gray-300 rounded-md min-h-[200px] bg-gray-50 flex items-center justify-center text-gray-500">
             Loading rich text editor...
           </div>;
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
          title="underline"
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
          <Bars4Icon  className="h-5 w-5" />
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

TiptapEditor.displayName = 'TiptapEditor'; // Good practice for forwardRef
export default TiptapEditor;