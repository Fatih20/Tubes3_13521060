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
    case "undefined": {
      answer = "Perintah tidak dikenali";
      break;
    }
    case "math": {
      answer = produceMath(question);
      break;
    }
    case "date": {
      answer = produceDate(question);
      break;
    }
    case "ask": {
      const savedQuestions = await prisma.savedQuestion.findMany({});
      answer = produceAnswer(question, useKMP, savedQuestions);
      break;
    }
    case "add": {
      const [addedQuestion, addedAnswer] = getAddedQuestion(question);
      let questionExist = true;
      const savedQuestions = await prisma.savedQuestion.findMany({});
      // Find saved question with KMP/BM, if there's no matching question, set question exist = true.

      // Question yang match, ambil id-nya terus taruh di variabel ini
      // const questionID

      answer = questionExist
        ? `Pertanyaan ${addedQuestion} sudah ada! Jawaban di-update ke ${addedAnswer}`
        : `Pertanyaan ${addedQuestion} telah ditambah dengan jawaban ${
            /*Jawaban taruh sini*/ ""
          }.`;

      if (questionExist) {
        await prisma.savedQuestion.update({
          where: {
            // id : questionID
          },
          data: {
            answer: addedAnswer,
            time: new Date(),
          },
        });
      } else {
        await prisma.savedQuestion.create({
          data: {
            answer: addedAnswer,
            question: addedQuestion,
            time: new Date(),
          },
        });
      }
      break;
    }
    case "remove": {
      const removedQuestion = getRemovedQuestion(question);
      const questionExist = true;
      // Cari pertanyaan yang sama eksak, set questionExist sesuai hasilnya. Kalau ketemu yang eksak simpan id-nya ke variabel di bawah.
      // const deletedQuestionId

      if (questionExist) {
        const deleted = await prisma.savedQuestion.delete({
          where: {
            // id : deletedQuestionId
          },
        });
        answer = `Pertanyaan ${removedQuestion} telah dihapus`;
      } else {
        answer = `Tidak ada pertanyaan ${removedQuestion} di database!`;
      }
    }
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
