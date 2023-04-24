import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401);
    return;
  }

  if (!session.user) {
    res.status(401);
    return;
  }
  const body = JSON.parse(req.body);

  if (!body.title) {
    res.status(400);
    return;
  }

  const newHistory = await prisma.chatSession.create({
    data: { userId: session.user.id, title: body.title },
  });

  res.status(200).json(newHistory);
  return;
}
