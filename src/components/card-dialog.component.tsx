'use client';

import { useCardQuery } from '@/hooks/use-card-query';
import { useUpdateCardMutation } from '@/hooks/use-update-card-mutation';
import { boardContext } from '@/providers';
import { MDXEditorMethods } from '@mdxeditor/editor';
import { useContext, useEffect, useRef, useState } from 'react';
import Markdown from 'react-markdown';
import { Button, Dialog, MdxEditor } from '.';

export function CardDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [showMdxEditor, setShowMdxEditor] = useState(false);
  const mdxEditor = useRef<MDXEditorMethods>(null);

  const { selectedCard, selectCard } = useContext(boardContext);
  const { data } = useCardQuery({ id: selectedCard });
  const { mutateAsync, isLoading } = useUpdateCardMutation();

  const handleDescriptionClick = () => {
    if (window.getSelection()?.toString().length !== 0) return;

    setShowMdxEditor(true);
  };

  const handleSave = async () => {
    const markdown = mdxEditor.current?.getMarkdown();

    await mutateAsync({
      cardId: selectedCard!,
      data: {
        description: markdown,
      },
    });

    setShowMdxEditor(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    if (isLoading) return;

    setIsOpen(false);
    setShowMdxEditor(false);
    setTimeout(() => {
      selectCard(null);
    }, 300);
  };

  useEffect(() => {
    if (selectedCard) {
      openModal();
    }
  }, [selectedCard]);

  return (
    <Dialog isOpen={isOpen} closeModal={closeModal} title={data?.title || ''}>
      <p className='text-lg font-semibold mb-4'>Description</p>
      <div className='mb-4 markdown-section'>
        {showMdxEditor && (
          <div>
            <MdxEditor value={data?.description} ref={mdxEditor} />
            <Button onClick={handleSave} isLoading={isLoading}>
              Save
            </Button>
          </div>
        )}

        {!showMdxEditor && (
          <>
            {data?.description ? (
              <div onClick={handleDescriptionClick}>
                <Markdown>{data?.description || ''}</Markdown>
              </div>
            ) : (
              <p
                onClick={handleDescriptionClick}
                className='p-4 bg-gray-600 hover:bg-gray-500 cursor-pointer'>
                Add more detailed description
              </p>
            )}
          </>
        )}
      </div>
    </Dialog>
  );
}
