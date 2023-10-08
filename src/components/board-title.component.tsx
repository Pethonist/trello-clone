'use client';

import { useCachedBoardQuery } from '@/hooks/use-board-query';
import { useUpdateBoardMutation } from '@/hooks/use-update-board-mutation';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface BoardTitleProps {
  boardId: string;
}

export function BoardTitle({ boardId }: BoardTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const { data } = useCachedBoardQuery({ boardId });
  const { mutate } = useUpdateBoardMutation();

  const titleClasses = clsx({
    'cursor-pointer': !isEditing,
    'cursor-text': isEditing,
  });

  const turnOnEditing = () => {
    if (isEditing) return;

    setIsEditing(true);
  };

  const onBlur = () => {
    setIsEditing(false);
    mutate({
      boardId,
      data: {
        title: titleRef.current?.innerText || 'Untitled',
      },
    });
  };

  useEffect(() => {
    if (data?.title && titleRef.current) {
      titleRef.current.innerText = data.title;
    }
  }, [data?.title]);

  return (
    <h1
      className={twMerge(
        'text-white text-4xl text-center mb-8 font-bold transition outline-none hover:bg-black/20',
        titleClasses
      )}
      contentEditable={isEditing}
      onClick={turnOnEditing}
      ref={titleRef}
      onBlur={onBlur}>
      {data?.title ?? ''}
    </h1>
  );
}
