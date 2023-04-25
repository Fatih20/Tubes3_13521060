import { evaluateMathExpression } from "./Math";
import { Main } from "./Main";
import { SavedQuestion } from "@prisma/client";

const questionType = [
  "ask",
  "math",
  "date",
  "remove",
  "add",
  "undefined",
] as const;
type QuestionClassification = (typeof questionType)[number];

const QuestionPattern = /^/gi;
const MathExpr =
  /^\s*(([-+]?([0-9]+\.)?[0-9]+)|(\([-+]?([0-9]+\.)?[0-9]+)\))\s*(([-+*/])\s*(([-+]?([0-9]+\.)?[0-9]+)|(\([-+]?([0-9]+\.)?[0-9]+)\)))*\s*/;
const higherMathExpr = /^(((.[+*\-/].)*\s*(\(.*\))\s*([+*\-/]\(.*\))*)\s*)/;
const DateExpr = /(?<=^|\s)[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}(?=\?|\s|$)/;
const addQuestionPattern =
  /^(tambahkan[ ]+pertanyaan|tambah[ ]+pertanyaan)[ ]+([^\s]+.*)[ ]+(dengan[ ]+jawaban)[ ]+([^\s]+.*)/gi;
const rmQuestionPattern =
  /^(hapuskan[ ]+pertanyaan|hapus[ ]+pertanyaan)[ ]+([^\s]+.*)/gi;

export function getAddedQuestion(addString: string): string[] {
  //I.S. string has been validated to be match the addQuestionPattern regular expression
  //F.S. return array of string, first element is the question, second element is the answer
  addQuestionPattern.lastIndex = 0;
  let question = addQuestionPattern.exec(addString);
  return [question![2], question![4]];
}

export function getRemovedQuestion(addString: string): string {
  //I.S. string has been validated to be match the rmQuestionPattern regular expression
  //F.S. return string of the question to be removed
  rmQuestionPattern.lastIndex = 0;
  let question = rmQuestionPattern.exec(addString);
  return question![2];
}

// First classification can get undefined, if classified but invalid, there will be a handling routine
// Routine to classify the questions given
/**
 *
 * @param question : the given question from the user input
 * @returns QuestionClassification enumeration
 */
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
  if (rmQuestionPattern.test(question)) {
    return "remove";
  }
  if (QuestionPattern.test(question)) {
    return "ask";
  }

  return "undefined";
};

// Routine to handle date output
/**
 *
 * @param question : the given question from the user input
 * @returns String answer to the question
 */
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
  return "Yah gak tau itu tanggal apa :(";
}

// Routine to handle math expression input
/**
 *
 * @param question : the given question from the user input
 * @returns String answer to the question
 */
export function produceMath(question: string) {
  try {
    let ret = evaluateMathExpression(question);
    if (isNaN(ret)) {
      return "Ketik ekspresi matematika nya yang bener dong";
    } else {
      return "Udah aku itungin nih, hasilnya " + ret.toString();
    }
  } catch (e) {
    return "Ketik ekspresi matematika nya yang bener dong";
  }
}

// Routine to get the answer based on the classification of the question
/**
 *
 * @param question : the given question from the user input
 * @param isKMP : Flag to determine whether the algorithm is KMP or BM
 * @param savedQuestion : array of question from the database
 * @returns String answer to the question
 */
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
  return `Aku tidak menemukan pertanyaan kamu di database.\n Apa maksud kamu : \n ${processedCandidate}`;
}

// Converter enumeration to day
/**
 *
 * @param num : enumeration number of the day
 * @returns String of the day
 */
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

// Converter enumeration to month
/**
 *
 * @param num : enumeration value of the month
 * @returns String of the month
 */
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
