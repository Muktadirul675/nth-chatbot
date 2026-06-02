import { prisma } from "@/lib/prisma";

const PAGE_COUNT = 20;

export async function getInformation(id: string){
  const information = await prisma.information.findUnique({
    where: {id}
  })
  return information;
}

export async function deleteInformation(id: string){
  const information = await prisma.information.delete({
    where: {id}
  })
  return information;
}

export async function getInformations(page: number = 1) {
  const skip = (page - 1) * PAGE_COUNT;

  const [data, total] = await Promise.all([
    prisma.information.findMany({
      skip,
      take: PAGE_COUNT,
      orderBy: {
        createdAt: "desc", // optional but recommended
      },
    }),
    prisma.information.count(),
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

export async function updateInformation(id: string, url: string, content: string){
  const res = await prisma.information.update({
    where: {id},
    data:{
      url,
      content
    }
  })
  return res;
}
