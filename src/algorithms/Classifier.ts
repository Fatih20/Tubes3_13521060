import { evaluateMathExpression, hasHigherPrecedence, applyOperator } from "./Math"

enum Questions {
    askQuestion = 0,
    mathExpr = 1,
    date = 2,
    addQuestion = 3,
    rmQuestion = 4,
    undefined = 5
}

const QuestionPattern = /^/gi
const MathExpr = /^\s*(([-+]?([0-9]+\.)?[0-9]+)|(\([-+]?([0-9]+\.)?[0-9]+)\))\s*(([-+*/])\s*(([-+]?([0-9]+\.)?[0-9]+)|(\([-+]?([0-9]+\.)?[0-9]+)\)))*\s*/gi
const higherMathExpr = /^(((.[+*\-/].)*\s*(\(.*\))\s*([+*\-/]\(.*\))*)\s*)/gi
const DateExpr = /(?<=^|\s)[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}(?=\?|\s|$)/
const addQuestionPattern = /^/gi
const rmQuestionPattern = /^/gi

// First classification can get undefined, if classified but invalid, there will be a handling routine

const classifyQuestion = (question: string): number => {
    if (DateExpr.test(question)) {
        let ret = Questions.date
        return ret
    }
    else if (higherMathExpr.test(question) || MathExpr.test(question)) {
        let ret = Questions.mathExpr
        return ret
    }
    else if (addQuestionPattern.test(question)) {
        let ret = Questions.addQuestion
        return ret
    }
    else if (rmQuestionPattern.test(question)) {

        let ret = Questions.rmQuestion
        return ret
    }
    else if (!QuestionPattern.test(question)) {

        let ret = Questions.askQuestion
        return ret
    }
    else {
        return 5
    }
}

const callQuestion = (question: string): void | string => {
    switch (classifyQuestion(question)) {
        case 0: break;
        case 1: let p = question.match(higherMathExpr);
                console.log(p)
                if (p != null) {
                    let ret = evaluateMathExpression(p[0]);
                    console.log(ret);
                    return ret.toString();
                }
                let q = question.match(MathExpr);
                console.log(q)
                if (q != null) {
                    let ret = evaluateMathExpression(q[0]);
                    console.log(ret);
                    return ret.toString();
                }
                break;
        case 2: let date: RegExpMatchArray | null = question.match(DateExpr);
                // console.log(date)
                if (date == null) return "";
                let dateString: string = date[0]
                // console.log(dateString)
                let dateArray = dateString.split('/')
                let formattedDate = [dateArray[2], dateArray[1], dateArray[0]].join('-');
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

                break;
        case 3: break;
        case 4: break;
        case 5: break;
    }
}

function convertToDay(num: number): string {
    switch (num) {
        case 0: return "Sunday";
        case 1: return "Monday";
        case 2: return "Tuesday";
        case 3: return "Wednesday";
        case 4: return "Thursday";
        case 5: return "Friday";
        case 6: return "Saturday";
        default: return "";
    }
}

function convertToMonth(num: number): string {
    switch (num) {
        case 0: return "January";
        case 1: return "February";
        case 2: return "March";
        case 3: return "April";
        case 4: return "May";
        case 5: return "June";
        case 6: return "July";
        case 7: return "August";
        case 8: return "September";
        case 9: return "October";
        case 10: return "November";
        case 11: return "December";
        default: return "";
    }
}
