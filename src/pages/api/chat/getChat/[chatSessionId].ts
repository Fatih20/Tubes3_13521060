import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
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

  const query = req.query as { chatSessionId?: string };
  const chatSessionId = query.chatSessionId;

  if (!chatSessionId) {
    res.statusMessage = "Chat session ID wasn't provided";
    res.status(400).send({});
    return;
  }

  try {
    await prisma.chatSession.findFirstOrThrow({
      where: {
        userId: { equals: session.user.id },
        id: { equals: chatSessionId },
      },
    });
  } catch (e) {
    res.statusMessage =
      "The corresponding user does not have the provided chat session ID";
    res.status(401).send({});
    return;
  }

  const chatHistory = await prisma.chat.findMany({
    orderBy: { time: "asc" },
    where: { chatSessionId: { equals: chatSessionId } },
  });
  console.log(chatHistory);

  return res.status(200).json(chatHistory);
}
