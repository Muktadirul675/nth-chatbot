import { prisma } from "@/lib/prisma";

const PAGE_COUNT = 10;

export async function getChats(page: number = 1) {
  const currentPage = Math.max(1, page);
  const pageSize = PAGE_COUNT;

  const skip = (currentPage - 1) * pageSize;

  const [chats, total] = await Promise.all([
    prisma.chatSession.findMany({
      skip,
      take: pageSize,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        createdAt: true,
        lead_captured: true,
        lead: true,
        escalated: true,
        _count: {
          select: {
            messages: true,
          },
        },
      },
    }),
    prisma.chatSession.count(),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return {
    chats,
    pagination: {
      page: currentPage,
      pageSize,
      total,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    },
  };
}

export async function getLatestChats(count: number = 10) {
    const chats = await prisma.chatSession.findMany({
        take: count,
        select: {
            id: true,
            createdAt: true,
            lead_captured: true,
            lead: true,
            escalated: true,
            _count: {
                select: {
                    messages: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    })
    return chats;
}

export async function getChat(id: string) {
    const chat = await prisma.chatSession.findUnique({
        where: { id },
        include: {
            lead: true,
            messages: true
        }
    })
    return chat;
}
