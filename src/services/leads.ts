import { prisma } from "@/lib/prisma";

const PAGE_COUNT = 10;

export async function getLatestLeads(count: number = 10) {
  const leads = await prisma.lead.findMany({
    take: count,
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      chat_session_id: true,
      qualified: true
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return leads;
}

export async function getLeads(page: number = 1) {
  const skip = (page - 1) * PAGE_COUNT;

  const [data, total] = await Promise.all([
    prisma.lead.findMany({
      skip,
      take: PAGE_COUNT,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        chat_session_id: true,
        qualified: true
      },
      orderBy: {
        createdAt: "desc", // optional but recommended
      },
    }),
    prisma.lead.count(),
  ]);

  return {
    data,
    pagination: {
      page,
      pageSize: PAGE_COUNT,
      total,
      totalPages: Math.ceil(total / PAGE_COUNT),
      hasNextPage: page * PAGE_COUNT < total,
      hasPrevPage: page > 1,
    },
  };
}

export async function createLead(chat_session_id: string, name: string, email: string) {
  const lead = await prisma.lead.create({
    data: {
      chat_session_id,
      name,
      email,
    },
  });
  return lead;
}

export async function getLead(id: string) {
  const lead = await prisma.lead.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      chat_session_id: true,
      qualified: true
    }
  })
  return lead;
}

export async function updateLead(id: string, name: string, email: string) {
  const lead = await prisma.lead.update({
    where: { id },
    data: {
      name,
      email
    }
  });
  return lead;
}

export async function deleteLead(id: string) {
  const lead = await prisma.lead.delete({
    where: { id },
  });
  return lead;
}