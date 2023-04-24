import { Algorithm } from './Algorithm';

class BM extends Algorithm {
    
    //Hashtable to map characters to their last occurence in the pattern
    array: number[] = [];

    /**
     *
     * @param target substring from input
     * @param question question to be matched against
     */
    check(target: String, question: String): boolean {
        let targetLastIdx = target.length - 1
        let questionLastIdx = question.length - 1

        let idx = targetLastIdx
        let inc = target.length
        
        // fill hashmap array
        for (let i = 0; i < 128; i++) {
            this.array[i] = inc;
        }
        for (let i = 0; i <= idx; i++) {
            //console.log(target.charCodeAt(i))
            this.array[target.charCodeAt(i)] = idx - i;
        }
        //console.log(this.array.slice(60, 128))

        //while length is shorter than question
        while (idx < question.length) {
            let i = idx;
            let j = targetLastIdx;

            //letter matching
            while (j > -1){
                //console.log("Matching: " + question.charAt(i) + " (index " + i + ")" + " and " + target.charAt(j))
                if (question[i] == target[j]){
                    i--;
                    j--;
                }
                else{
                    break
                }
            }
            if (j == -1){
                return true;
            }

            //jump
            if (idx < questionLastIdx){
                inc = this.array[question.charCodeAt(i)] - (targetLastIdx - j)
                inc > 0? idx += inc : idx += this.array[question.charCodeAt(idx+1)] + 1

                /* Note:
                there is a slight modification to the algorithm

                if the shift is negative, it means that the pattern has the character but it is not possible to shift into it
                in the original one it is supposed to shift by just one character to the right
                here, instead we check the next character in the question and shift by the value of the last occurence of that character in the pattern
                this is because it is pointless to shift by one character if the next character is not in the pattern

                this might save some comparison time for a slightly worse, worst case scenario where next character in question is the last character in target
                if this turns out to be worse, change it back to the original one
                change this.array[question.charCodeAt(idx+1)] + 1 to just 1 to do so
                */
            }
            else{
                idx += 1
            }

            //console.log("idx: " + idx)
        }

        return false
    }

}

export { BM }
