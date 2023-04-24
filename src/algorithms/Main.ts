import { PrioQueue } from "./PrioQueue";
import { Algorithm } from "./Algorithm";
import { KMP } from "./KMP";
import { BM } from "./BM";
import { DistanceAlgorithm } from "./DistanceAlgorithm";

class Main {
  ListQuestion: string[];
  KMPAlgorithm: Algorithm = new KMP();
  BMAlgorithm: Algorithm = new BM();
  DistanceAlgorithm: DistanceAlgorithm = new DistanceAlgorithm();

  constructor(ListQuestion: string[]) {
    this.ListQuestion = ListQuestion;
  }

  /**
   *
   * @param subtring The string to check (from input)
   * @param flag (on : KMP, off : BM)
   */
  getMatchingQuestion(substring: string, flag: boolean): string[] {
    // Iterate over all the questions in the list
    // Return the first matching question if KMP/BM return true
    let retval: string[] = [""];
    let Questions: PrioQueue = new PrioQueue();

    this.ListQuestion.forEach((element) => {
      let exactMatchExist = flag
        ? this.KMPAlgorithm.check(substring, element)
        : this.BMAlgorithm.check(substring, element);
      if (exactMatchExist) {
        return [element];
      } else {
        // Get question match percentage
        let matchPercent = this.DistanceAlgorithm.getDistance(
          substring,
          element
        );
        Questions.enqueue(matchPercent, element);
      }
    });

    // Get first element, if > 90% then return

    let elmt = Questions.dequeue();
    if (elmt != undefined && elmt[0] > 0.9) {
      retval = [elmt[1]];
      return [elmt[1]];
    } else if (elmt != undefined) {
      retval = [
        elmt[1],
        Questions.queue[0][1] == undefined ? "" : Questions.queue[0][1],
        Questions.queue[1][1] == undefined ? "" : Questions.queue[1][1],
      ];
      return [
        elmt[1],
        Questions.queue[0][1] == undefined ? "" : Questions.queue[0][1],
        Questions.queue[1][1] == undefined ? "" : Questions.queue[1][1],
      ];
    }

    return retval;
  }
}

export { Main };
