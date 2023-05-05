import { PrioQueue } from "./PrioQueue";
import { Algorithm } from "./Algorithm";
import { KMP } from "./KMP";
import { BM } from "./BM";
import { DistanceAlgorithm } from "./DistanceAlgorithm";
import { SavedQuestion } from ".prisma/client";

class Main {
  ListQuestion: SavedQuestion[];
  KMPAlgorithm: Algorithm = new KMP();
  BMAlgorithm: Algorithm = new BM();
  DistanceAlgorithm: DistanceAlgorithm = new DistanceAlgorithm();

  constructor(ListQuestion: SavedQuestion[]) {
    this.ListQuestion = ListQuestion;
  }

  /**
   *
   * @param subtring The string to check (from input)
   * @param algoType (on : KMP, off : BM)
   * @param exact (on: only exact match, off: return the closest match)
   */
  getMatchingQuestion(substring: string, algoType: boolean, exact: boolean): SavedQuestion[] {
    // Iterate over all the questions in the list
    // Return the first matching question if KMP/BM return true
    let Questions: PrioQueue = new PrioQueue();

    let exactMatchExist;
    if(exact){
      for (const element of this.ListQuestion) {
        exactMatchExist = algoType
          ? this.KMPAlgorithm.check(substring, element.question)
          : this.BMAlgorithm.check(substring, element.question);
        if (exactMatchExist && substring.length == element.question.length) {
          return [element];
        } 
      }
    }
    
    
    
    let exactFound = false;
    for (const element of this.ListQuestion) {
      let exactMatchExist = algoType
        ? this.KMPAlgorithm.check(substring, element.question)
        : this.BMAlgorithm.check(substring, element.question);
      if (exactMatchExist) {
        Questions.enqueue(Math.abs(substring.length - element.question.length), element);
        exactFound = true;
      }
      if (exactFound){
        for(let i = 0; i < Questions.queue.length; i++){
          console.log(Questions.queue[i][1].question);
        }
        return [Questions.queue[0][1]];
      }
      else {
        // Get question match percentage
        let matchPercent = this.DistanceAlgorithm.getDistance(
          substring,
          element.question
        );
        Questions.enqueue(matchPercent, element);
      }
    }

    // this.ListQuestion.forEach((element) => {
    //   console.log("Pertanyaan di database", element.question);
    // });


    // Get first element, if > 90% then return

    if(!exact){
      let elmt = Questions.dequeue();
      if (elmt !== undefined && elmt[0] > 0.9) {
        return [elmt[1]];
      } else if (elmt !== undefined) {
        return [
          elmt[1],
          Questions.queue[0][1] ?? elmt[1],
          Questions.queue[1][1] ?? elmt[1]
        ];
      }
    }

    return [];
  }
}

export { Main };
