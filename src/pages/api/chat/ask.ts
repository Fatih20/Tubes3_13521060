import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";
import {
  classifyQuestion,
  getAddedQuestion,
  getRemovedQuestion,
  produceAnswer,
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

  // .All logic for producing answers are here
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
    case "ask":
      const savedQuestions = await prisma.savedQuestion.findMany({
        where: { userId: { equals: session.user.id } },
      });
      answer = produceAnswer(question, useKMP, savedQuestions);
      break;
    case "add":
      const [addedQuestion, addedAnswer] = getAddedQuestion(question);
      console.log(addedQuestion);
      let questionExist = true;
      try {
        await prisma.savedQuestion.findFirstOrThrow({
          where: {
            question: { equals: addedQuestion },
            userId: { equals: session.user.id },
          },
        });
      } catch (e) {
        questionExist = false;
      }
      answer = questionExist
        ? `Pertanyaan ${addedQuestion} sudah ada! Jawaban di-update ke ${addedAnswer}`
        : `Pertanyaan ${addedQuestion} telah ditambah`;

      if (questionExist) {
        await prisma.savedQuestion.updateMany({
          where: {
            question: { equals: addedQuestion },
            userId: { equals: session.user.id },
          },
          data: {
            answer: addedAnswer,
            answerLength: addedAnswer.length,
            time: new Date(),
            userId: session.user.id,
          },
        });
      } else {
        await prisma.savedQuestion.create({
          data: {
            answer: addedAnswer,
            answerLength: addedAnswer.length,
            question: addedQuestion,
            questionLength: addedQuestion.length,
            time: new Date(),
            userId: session.user.id,
          },
        });
      }
      break;
    case "remove":
      const removedQuestion = getRemovedQuestion(question);
      const deleted = await prisma.savedQuestion.deleteMany({
        where: {
          question: { equals: removedQuestion },
          userId: { equals: session.user.id },
        },
      });
      answer =
        deleted.count > 0
          ? `Pertanyaan ${removedQuestion} telah dihapus`
          : `Tidak ada pertanyaan ${removedQuestion} di database`;
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
