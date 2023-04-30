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

const QuestionPattern = /^/i;
const MathExpr =
  /^\s*(([-+]?([0-9]+\.)?[0-9]+)|(\([-+]?([0-9]+\.)?[0-9]+)\))\s*(([-+*/])\s*(([-+]?([0-9]+\.)?[0-9]+)|(\([-+]?([0-9]+\.)?[0-9]+)\)))*\s*/i;
const higherMathExpr = /^(((.[+*\-/].)*\s*(\(.*\))\s*([+*\-/]\(.*\))*)\s*)/i;
const DateExpr = /(?<=^|\s)[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}(?=\?|\s|$)/i;
const addQuestionPattern =
  /^(tambah(kan)?[ ]+pertanyaan)[ ]+([^\s]+.*)[ ]+(dengan[ ]+jawaban)[ ]+([^\s]+.*)/gi;
const addPQuestionPattern =
  /^((masukkan|tambah(kan)?)[ ]+pertanyaan)[ ]+([^\s]+.*)[ ]+(dengan[ ]+jawaban[ ]+personal)[ ]+([^\s]+.*)/gi;
const rmQuestionPattern = /^(hapus(kan)?[ ]+pertanyaan)[ ]+([^\s]+.*)/gi;
const rmPQuestionPattern =
  /^(hapus(kan)?[ ]+pertanyaan[ ]+personal)[ ]+([^\s]+.*)/gi;

export function getAddedQuestion(addString: string): string[] {
  //I.S. string has been validated to be match the addQuestionPattern regular expression
  //F.S. return array of string, first element is the question, second element is the answer
  addQuestionPattern.lastIndex = 0;
  let question = addQuestionPattern.exec(addString);
  return [question![3], question![5]];
}

export function getAddedQuestionP(addString: string): string[] {
  //basically the personal type from getAddedQuestion
  //I.S. string has been validated to be match the addPQuestionPattern regular expression
  //F.S. return array of string, first element is the question, second element is the answer
  addPQuestionPattern.lastIndex = 0;
  let question = addPQuestionPattern.exec(addString);
  console.log(question);
  return [question![4], question![6]];
}

export function getRemovedQuestion(addString: string): string {
  //I.S. string has been validated to be match the rmQuestionPattern regular expression
  //F.S. return string of the question to be removed
  rmQuestionPattern.lastIndex = 0;
  let question = rmQuestionPattern.exec(addString);
  return question![3];
}

export function getRemovedQuestionP(addString: string): string {
  //I.S. string has been validated to be match the rmQuestionPattern regular expression
  //F.S. return string of the question to be removed
  rmPQuestionPattern.lastIndex = 0;
  let question = rmPQuestionPattern.exec(addString);
  return question![3];
}

// First classification can get undefined, if classified but invalid, there will be a handling routine
// Routine to classify the questions given
/**
 *
 * @param question : the given question from the user input
 * @returns QuestionClassification enumeration
 */
export const classifyQuestion = (
  question: string
): QuestionClassification[] => {
  let ret = [];
  if (DateExpr.test(question)) {
    ret.push("date");
  }

  if (higherMathExpr.test(question) || MathExpr.test(question)) {
    ret.push("math");
  }
  // if (addPQuestionPattern.test(question)) {
  //   return "addPersonal";
  // }
  // if (rmPQuestionPattern.test(question)) {
  //   return "removePersonal";
  // }
  if (addQuestionPattern.test(question)) {
    ret.push("add");
  }
  if (addPQuestionPattern.test(question)) {
    ret.push("addPersonal");
  }
  if (rmQuestionPattern.test(question)) {
    ret.push("remove");
  }
  if (rmPQuestionPattern.test(question)) {
    ret.push("removePersonal");
  }
  if (QuestionPattern.test(question)) {
    ret.push("ask");
  }

  if (ret.length == 0) {
    return ["undefined"];
  }
  return ["undefined"];
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
    return (
      "Hari sama tanggalnya itu " +
      day +
      ", " +
      date +
      " " +
      month +
      ", " +
      year
    );
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

  // If no question was found
  if (searchResult.length == 0) {
    return "Belum ada pertanyaan nih kak, tambahin pertanyaan ke aku yuk";
  }
  // Exact atau 90% match ditemukan
  if (searchResult.length == 1) {
    return searchResult[0].answer;
  }

  //   Pertanyaan didalam database masih kurang dari 3
  if (searchResult.length < 3) {
    return `Pertanyaan yang aku simpan masih kurang dari 3 :( \nYuk tambahin! \nMungkin yang kamu cari: \n${searchResult[0].question}`;
  }
  //   Ditemukan 3 pertanyaan paling mirip
  const processedCandidate = searchResult
    .map(({ question }, index) => {
      return `\n${index + 1}. ${question}`;
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
