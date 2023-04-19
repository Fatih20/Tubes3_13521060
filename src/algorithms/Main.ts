import { PrioQueue } from "./PrioQueue"


class Main {
    ListQuestion: String[]
    KMPAlgorithm: Algorithm
    BMAlgorithm: Algorithm
    DistanceAlgorithm: DistanceAlgorithm

    constructor(ListQuestion: String[], KMPAlgorithm: Algorithm, BMAlgorithm: Algorithm, distanceAlgorithm: DistanceAlgorithm) {
        this.ListQuestion = ListQuestion
        this.KMPAlgorithm = KMPAlgorithm
        this.BMAlgorithm = BMAlgorithm
        this.DistanceAlgorithm = distanceAlgorithm
    }

    /**
     *
     * @param subtring The string to check (from input)
     * @param flag (on : KMP, off : BM)
     */
    getMatchingQuestion(substring: String, flag: boolean): String[] {
        // Iterate over all the questions in the list
        // Return the first matching question if KMP/BM return true

        let Questions: PrioQueue = new PrioQueue();

        this.ListQuestion.forEach(element => {
            let exactMatchExist = false;
            if (flag) { exactMatchExist = this.KMPAlgorithm.check(substring, element); }
            else { exactMatchExist = this.BMAlgorithm.check(substring, element);}
            if (exactMatchExist) { return [element]; }
            else {
                // Get question match percentage
                let matchPercent = this.DistanceAlgorithm.getDistance(substring, element);
                Questions.enqueue(matchPercent, element);
            }
        });

        // Get first element, if > 90% then return

        let elmt = Questions.dequeue()
        if (elmt != undefined && elmt[0] > 0.9) {
            return [elmt[1]]
        } else if (elmt != undefined) {
            return [elmt[1], Questions.queue[0][1] == undefined? "": Questions.queue[0][1], Questions.queue[1][1] == undefined? "": Questions.queue[1][1]]
        }

        return [""]

    }


}
