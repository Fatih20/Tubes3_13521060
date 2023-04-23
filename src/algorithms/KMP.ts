import { Algorithm } from './Algorithm';

class KMP extends Algorithm {

    /**
     *
     * @param target target pattern that will be used to generate border
     * @returns border array
     */
    borderFunction(target: string) : number[] {
        let ret: number[] = [];
        let len = target.length
        let i = 1
        let j = 0

        for (let k = 0; k < len; k++) {
            ret.push(0)
        }

        while (i < len) {
            // console.log(target[i], target[j], i, j, ret)
            if (target[i] == target[j]) {

                ret[i] = j + 1
                i++
                j++
            } else if (j > 0) {
                j = ret[j-1]
            } else {
                ret[i] = 0
                i++
            }
        }
        return ret.splice(0, len-1)
    }

    /**
     *
     * @param target substring from input
     * @param question question to be matched against
     */
    check(target: string, question: string): boolean {
        // KMP Algorithm
        let lenTarget = target.length
        let lenQuestion = question.length

        let border = this.borderFunction(target)

        let i = 0 // question iterator
        let j = 0 // target iterator

        while (i < lenQuestion) {
            if (target[j] == question[i]) {
                if (j == lenTarget -1) {
                    // end of target reached
                    return true
                }
                // Not end of target, increment i and j
                i++
                j++
            } else if (j > 0) {
                // console.log(j, border[j-1])
                // Pergeseran KMP menggunakan Border function
                j = border[j-1]
            } else { i++ }
        }
        return false

    }

}

export { KMP }
