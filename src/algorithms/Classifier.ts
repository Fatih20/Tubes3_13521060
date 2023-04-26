import { evaluateMathExpression } from "./Math";
import { Main } from "./Main";
import { SavedQuestion } from "@prisma/client";

const questionType = [
  "ask",
  "math",
  "date",
  "remove",
  "add",
  "addPersonal",
  "undefined",
] as const;
type QuestionClassification = (typeof questionType)[number];

const QuestionPattern = /^/gi;
const MathExpr =
  /^\s*(([-+]?([0-9]+\.)?[0-9]+)|(\([-+]?([0-9]+\.)?[0-9]+)\))\s*(([-+*/])\s*(([-+]?([0-9]+\.)?[0-9]+)|(\([-+]?([0-9]+\.)?[0-9]+)\)))*\s*/gi;
const higherMathExpr = /^(((.[+*\-/].)*\s*(\(.*\))\s*([+*\-/]\(.*\))*)\s*)/gi;
const DateExpr = /(?<=^|\s)[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}(?=\?|\s|$)/;
const addQuestionPattern = /^(tambahkan[ ]+pertanyaan|tambah[ ]+pertanyaan)[ ]+([^\s]+.*)[ ]+(dengan[ ]+jawaban)[ ]+([^\s]+.*)/gi
const addPQuestionPattern = /^(masukkan[ ]+pertanyaan|tambahkan[ ]+pertanyaan|tambah[ ]+pertanyaan)[ ]+([^\s]+.*)[ ]+(dengan[ ]+jawaban[ ]+personal)[ ]+([^\s]+.*)/gi
const rmQuestionPattern = /^(hapuskan[ ]+pertanyaan|hapus[ ]+pertanyaan)[ ]+([^\s]+.*)/gi

function getAddedQuestion(addString: string): string[] {
  //I.S. string has been validated to be match the addQuestionPattern regular expression
  //F.S. return array of string, first element is the question, second element is the answer
  addQuestionPattern.lastIndex = 0
  let question = addQuestionPattern.exec(addString)
  return [question![2], question![4]]
}

function getAddedQuestionP(addString: string): string[] {
  //basically the personal type from getAddedQuestion
  //I.S. string has been validated to be match the addPQuestionPattern regular expression
  //F.S. return array of string, first element is the question, second element is the answer
  addPQuestionPattern.lastIndex = 0
  let question = addPQuestionPattern.exec(addString)
  return [question![2], question![4]]
}

function getRemovedQuestion(addString: string): String {
  //I.S. string has been validated to be match the rmQuestionPattern regular expression
  //F.S. return string of the question to be removed
  rmQuestionPattern.lastIndex = 0
  let question = rmQuestionPattern.exec(addString)
  return question![2]
}

// First classification can get undefined, if classified but invalid, there will be a handling routine

export const classifyQuestion = (question: string): QuestionClassification => {
  if (DateExpr.test(question)) {
    return "date";
  }

  if (higherMathExpr.test(question) || MathExpr.test(question)) {
    return "math";
  }
  if (addQuestionPattern.test(question)) {
    return "add";
  }
  if (addPQuestionPattern.test(question)) {
    return "addPersonal";
  }
  if (rmQuestionPattern.test(question)) {
    return "remove";
  }
  if (QuestionPattern.test(question)) {
    return "ask";
  }

  return "undefined";
};

export function produceDate(question: string) {
  let date: RegExpMatchArray | null = question.match(DateExpr);
  // console.log(date)
  if (date == null) return "";
  let dateString: string = date[0];
  // console.log(dateString)
  let dateArray = dateString.split("/");
  let formattedDate = [dateArray[2], dateArray[1], dateArray[0]].join("-");
  // console.log(formattedDate);
  if (formattedDate != null) {
    let retdate = new Date(formattedDate);
    let day = convertToDay(retdate.getDay());
    let date = retdate.getDate().toString();
    let month = convertToMonth(retdate.getMonth());
    let year = retdate.getFullYear();
    // console.log(ret);
    return day + ", " + date + " " + month + ", " + year;
  }
  return "Gagal mengevaluasi tanggal";
}

export function produceMath(question: string) {
  //   let p = question.match(higherMathExpr);
  //   console.log(p);
  //   if (p != null) {
  //     let ret = evaluateMathExpression(p[0]);
  //     console.log(ret);
  //     return ret.toString();
  //   }
  //   let q = question.match(MathExpr);
  //   console.log(q);
  //   if (q != null) {
  //     let ret = evaluateMathExpression(q[0]);
  //     console.log(ret);
  //     return ret.toString();
  //   }
  try {
    return evaluateMathExpression(question).toString();
  } catch (e) {
    return "Gagal mengevaluasi ekspresi";
  }
}

export function produceAnswer(
  question: string,
  isKMP: boolean,
  savedQuestion: SavedQuestion[]
): string {
  let main = new Main(savedQuestion);
  const searchResult = main.getMatchingQuestion(question, isKMP);

  // Exact atau 90% match ditemukan
  if (searchResult.length <= 1) {
    return searchResult[0].answer;
  }

  //   Ditemukan 3 pertanyaan paling mirip
  const processedCandidate = searchResult
    .map(({ question }, index) => {
      return `${index + 1}. ${question}`;
    })
    .join("\n");
  return `Pertanyaan tidak ditemukan di database.\n Apakah maksud anda : \n ${processedCandidate}`;
}

function convertToDay(num: number): string {
  switch (num) {
    case 0:
      return "Sunday";
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
    default:
      return "";
  }
}

function convertToMonth(num: number): string {
  switch (num) {
    case 0:
      return "January";
    case 1:
      return "February";
    case 2:
      return "March";
    case 3:
      return "April";
    case 4:
      return "May";
    case 5:
      return "June";
    case 6:
      return "July";
    case 7:
      return "August";
    case 8:
      return "September";
    case 9:
      return "October";
    case 10:
      return "November";
    case 11:
      return "December";
    default:
      return "";
  }
}
