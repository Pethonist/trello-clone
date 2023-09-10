import { prisma } from '@/core/prisma';
import { NextResponse } from 'next/server';
import { BoardRouteContext } from '../route';

export async function GET(req: Request, { params }: BoardRouteContext) {
  const { id } = params;

  const board = await prisma.boards.findUnique({
    where: { id },
  });

  if (!board) {
    return NextResponse.json([
      {
        code: 'not_found',
        messages: 'Board not found',
      },
    ]);
  }

  return NextResponse.json(board);
}
