'use client';

import { ColumnPayload, useColumnQuery } from '@/hooks/use-column-query';
import { useUpdateColumnMutation } from '@/hooks/use-update-column-mutation';
import { DragEvent, useEffect, useRef, useState } from 'react';
import { CreateCard } from './create-card.component';

interface ColumnProps {
  column: ColumnPayload;
}

const MIN_WIDTH = 200;

export function Column({ column }: ColumnProps) {
  const { data } = useColumnQuery({ initialData: column });

  const initialDragX = useRef<number>(0);
  const [width, setWidth] = useState(data.width);

  useEffect(() => {
    setWidth(data.width);
  }, [data.width]);

  const onResizeStart = (e: DragEvent<HTMLDivElement>) => {
    initialDragX.current = e.clientX;
  };

  const onResize = (e: DragEvent<HTMLDivElement>) => {
    if (e.clientX === 0) return;

    const movedBy = e.clientX - initialDragX.current;
    initialDragX.current = e.clientX;

    setWidth((width) => {
      const newWidth = width + movedBy;

      if (newWidth < MIN_WIDTH) return MIN_WIDTH;

      return newWidth;
    });
  };

  const { mutateAsync } = useUpdateColumnMutation();

  const onResizeEnd = async () => {
    await mutateAsync({ columnId: data.id, data: { width } });
  };

  return (
    <div
      style={{ minWidth: width, width }}
      className='block w-full pb-4 border h-fit rounded-lg shadow bg-gray-800 border-gray-700 sticky top-0'>
      <div className='sticky top-0 bg-gray-800 p-4 border-t border-gray-700 rounded-t-lg'>
        <h5 className='text-lg font-bold tracking-tight text-white'>{data.title}</h5>
        <div
          className='absolute -right-px top-[0.5rem] bottom-[0.5rem] cursor-move w-px bg-gray-700 select-none opacity-0'
          draggable
          onDragStart={onResizeStart}
          onDrag={onResize}
          onDragEnd={onResizeEnd}
        />
      </div>
      <div className='flex flex-col gap-4 px-4'>
        {data.cards.map((card) => (
          <div
            key={card.id}
            className='flex items-center p-3 text-base font-bold rounded-lg group cursor-pointer hover:shadow bg-gray-600 hover:bg-gray-500 text-white'>
            {card.title}
          </div>
        ))}
        <CreateCard columnId={column.id} />
      </div>
    </div>
  );
}
