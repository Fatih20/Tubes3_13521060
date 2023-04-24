import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";
import {
  classifyQuestion,
  produceDate,
  produceMath,
} from "@/algorithms/Classifier";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).send({});
    return;
  }

  if (!session.user) {
    res.status(401).send({});
    return;
  }

  const body = JSON.parse(req.body) as {
    question?: string;
    chatSessionId?: string;
    stringMatchingAlgorithm?: string;
  };

  const chatSessionId = body.chatSessionId;

  if (!chatSessionId) {
    res.statusMessage = "Chat session ID wasn't provided";
    res.status(400).send({});
    return;
  }

  try {
    await prisma.chatSession.findFirstOrThrow({
      where: { userId: { equals: session.user.id } },
    });
  } catch (e) {
    res.statusMessage =
      "The corresponding user does not have the provided chat session ID";
    res.status(401).send({});
    return;
  }

  const question = body.question;

  if (!question) {
    res.statusMessage = "Question wasn't provided";
    res.status(400).send({});
    return;
  }

  const questionLength = question.length;

  await prisma.chat.create({
    data: {
      fromUser: true,
      text: question,
      textLength: questionLength,
      time: new Date(),
      chatSessionId: chatSessionId,
    },
  });

  const stringMatchingAlgorithm = body.stringMatchingAlgorithm;

  // If string matching method not given, default to BM
  const useKMP = stringMatchingAlgorithm === "KMP";

  const questionClassification = classifyQuestion(question);

  let answer = "";
  switch (questionClassification) {
    case "undefined":
      answer = "Perintah tidak dikenali";
      break;
    case "math":
      answer = produceMath(question);
      break;
    case "date":
      answer = produceDate(question);
      break;
    case "add":
      break;
    case "remove":
      break;
    case "ask":
      break;
  }

  await prisma.chat.create({
    data: {
      fromUser: false,
      text: answer,
      textLength: answer.length,
      time: new Date(),
      chatSessionId: chatSessionId,
    },
  });

  res.status(200).send({});
  return;
}
