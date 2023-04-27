import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";
import {
  classifyQuestion,
  getAddedQuestion,
  getAddedQuestionP,
  getRemovedQuestion,
  getRemovedQuestionP,
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

  const question = body.question?.toLowerCase();

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

  // If string matching method not given, default to BM
  const useKMP = body.stringMatchingAlgorithm === "KMP";

  // All logic for producing answers are here
  let answer = "";
  switch (classifyQuestion(question)) {
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
        ? `Pertanyaan ${addedQuestion} sudah ada! Jawaban personal di-update ke ${addedAnswer}`
        : `Pertanyaan ${addedQuestion} telah ditambah dengan jawaban personal-nya.`;

      if (questionExist) {
        await prisma.savedQuestionGlobal.updateMany({
          where: {
            question: { equals: addedQuestion },
          },
          data: {
            answer: addedAnswer,
            time: new Date(),
          },
        });
      } else {
        await prisma.savedQuestionGlobal.create({
          data: {
            answer: addedAnswer,
            question: addedQuestion,
            time: new Date(),
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
          : `Tidak ada pertanyaan ${removedQuestion} di database!`;
      break;
    case "addPersonal":
      const [addedQuestionP, addedAnswerP] = getAddedQuestionP(question);
      let questionPExist = true;
      try {
        await prisma.savedQuestion.findFirstOrThrow({
          where: {
            question: { equals: addedQuestionP },
            userId: { equals: session.user.id },
          },
        });
      } catch (e) {
        questionPExist = false;
      }
      answer = questionPExist
        ? `Pertanyaan ${addedQuestionP} sudah ada! Jawaban personal di-update ke ${addedAnswerP}`
        : `Pertanyaan ${addedQuestionP} telah ditambah dengan jawaban personal-nya.`;

      if (questionPExist) {
        await prisma.savedQuestion.updateMany({
          where: {
            question: { equals: addedQuestionP },
            userId: { equals: session.user.id },
          },
          data: {
            answer: addedAnswerP,
            answerLength: addedAnswerP.length,
            time: new Date(),
            userId: session.user.id,
          },
        });
      } else {
        await prisma.savedQuestion.create({
          data: {
            answer: addedAnswerP,
            answerLength: addedAnswerP.length,
            question: addedQuestionP,
            questionLength: addedQuestionP.length,
            time: new Date(),
            userId: session.user.id,
          },
        });
      }
      break;
    case "removePersonal":
      const removedQuestionP = getRemovedQuestionP(question);
      const deletedP = await prisma.savedQuestion.deleteMany({
        where: {
          question: { equals: removedQuestionP },
          userId: { equals: session.user.id },
        },
      });
      answer =
        deletedP.count > 0
          ? `Pertanyaan ${removedQuestionP} telah dihapus jawaban personal-nya`
          : `Tidak ada pertanyaan ${removedQuestionP} dengan jawaban personal di database!`;
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
