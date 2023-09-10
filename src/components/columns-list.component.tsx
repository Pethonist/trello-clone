'use client';

import { BoardPayload, useBoardQuery } from '@/hooks/use-board-query';
import { useEffect } from 'react';
import { BoardTitle, Column, CreateColumn } from '.';

interface ColumnsListProps {
  board: BoardPayload;
}

export function ColumnsList({ board }: ColumnsListProps) {
  const { data } = useBoardQuery({ initialData: board });

  useEffect(() => {
    document.title = `${data.title} | Trello Clone`;
  }, [data.title]);

  return (
    <>
      <div className='container mx-auto'>
        <BoardTitle boardId={board.id} />
      </div>
      <div className='flex flex-1 gap-10 overflow-x-scroll w-full h-content px-10 pb-5'>
        {data.columns.map((column) => (
          <Column key={`column-${column.id}`} column={column} />
        ))}
        <CreateColumn boardId={board.id} />
      </div>
    </>
  );
}
