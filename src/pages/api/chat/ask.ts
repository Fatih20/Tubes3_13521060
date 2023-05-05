import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";
import {
  DateExpr,
  MathExpr,
  classifyQuestion,
  getAddedQuestion,
  getRemovedQuestion,
  higherMathExpr,
  produceAnswer,
  produceDate,
  produceMath,
  rmQuestionPattern,
} from "@/algorithms/Classifier";
import { Main } from "@/algorithms/Main";

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

  // If string matching method not given, default to BM
  const useKMP = body.stringMatchingAlgorithm === "KMP";
  const queries = question.split("\n");

  // All logic for producing answers are here
  let answer = "";
  for (const query of queries) {
    const classification = classifyQuestion(query);
    switch (classification) {
      case "undefined": {
        answer += "Perintah tidak dikenali";
        break;
      }
      case "math": {
        answer += produceMath(query);
        break;
      }
      case "date": {
        answer += produceDate(query);
        break;
      }
      case "ask": {
        const savedQuestions = await prisma.savedQuestion.findMany({});
        answer += produceAnswer(query, useKMP, savedQuestions);
        break;
      }
      case "add": {
        const addQuestionStartingPattern =/^(tambah(kan)?[ ]+pertanyaan )+.*/gi;
        const [addedQuestion, addedAnswer] = getAddedQuestion(query);
        if (DateExpr.test(addedQuestion)
        || higherMathExpr.test(addedQuestion)
        || MathExpr.test(addedQuestion)
        || addQuestionStartingPattern.test(addedQuestion)
        || rmQuestionPattern.test(addedQuestion))
        {
          answer += `Pertanyaan ${addedQuestion} tidak bisa ditambahkan karena mengandung pola pertanyaan lain, jangan nambah yang aneh aneh, bodoh.`;
        }
        else{
          const savedQuestions = await prisma.savedQuestion.findMany({});
          // Find saved question with KMP/BM, if there's no matching question, set question exist = true.
  
          // Question yang match, ambil id-nya terus taruh di variabel ini
          let questionID: string | undefined;
          const search = new Main(savedQuestions);
          const data = search.getMatchingQuestion(addedQuestion, useKMP, true);
          if (data.length > 0) {
            questionID = data[0].id;
          }
  
          const questionExist = questionID !== undefined;
          answer += questionExist
            ? `Pertanyaan ${addedQuestion} sudah ada! Jawaban di-update ke ${addedAnswer}`
            : `Pertanyaan ${addedQuestion} telah ditambah dengan jawaban ${addedAnswer}.`;
  
          if (questionExist) {
            await prisma.savedQuestion.update({
              where: {
                id: questionID,
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
        }
        break;
      }
      case "remove": {
        const removedQuestion = getRemovedQuestion(query);
        const savedQuestions = await prisma.savedQuestion.findMany({});

        // Cari pertanyaan yang sama eksak, set questionExist sesuai hasilnya. Kalau ketemu yang eksak simpan id-nya ke variabel di bawah.
        // const deletedQuestionId
        let questionID: string | undefined;
        const search = new Main(savedQuestions);
        const data = search.getMatchingQuestion(removedQuestion, useKMP, true);
        if (data.length > 0) {
          questionID = data[0].id;
        }

        const questionExist = questionID !== undefined;
        if (questionExist) {
          await prisma.savedQuestion.delete({
            where: {
              id: questionID,
            },
          });
          answer += `Pertanyaan ${removedQuestion} telah dihapus`;
        } else {
          answer += `Tidak ada pertanyaan ${removedQuestion} di database!`;
        }
      }
    }
    answer += "\n---\n";
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
