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

  const body = req.body as { question?: string; chatSessionId?: string };

  const chatSessionId = body.chatSessionId;

  if (!body.chatSessionId) {
    res.statusMessage = "Chat session ID wasn't provided";
    res.status(400);
    return;
  }

  try {
    await prisma.chatSession.findFirstOrThrow({
      where: { userId: { equals: session.user.id } },
    });
  } catch (e) {
    res.statusMessage =
      "The corresponding user does not have the provided chat session ID";
    res.status(401);
    return;
  }

  const question = body.question;

  if (!question) {
    res.statusMessage = "Question wasn't provided";
    res.status(400);
    return;
  }

  const questionLength = question.length;

  const histories = await prisma.chatSession.findMany({
    where: { userId: { equals: session.user.id } },
  });

  return res.status(200);
}
