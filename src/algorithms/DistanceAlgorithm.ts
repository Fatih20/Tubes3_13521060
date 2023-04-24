
class DistanceAlgorithm{

    /**
     *
     * @param target input substring to be matched against
     * @param question question to be matched against target
     * @returns distance with the scale of 0 - 1 from the target to the question
     */
    getDistance(target: String, question: String): number {
        
        const targetLength = target.length
        const questionLength = question.length

        if(targetLength == 0 || questionLength == 0) return 1
        else{
            //array initialization
            let array: number[][] = []
            for(let i = 0; i <= questionLength; i++){
                //matrix initialization
                array[i] = []
                for(let j = 0; j <= targetLength; j++){
                    //matrix border values initialization
                    if(i == 0) array[i][j] = j
                    else if(j == 0) array[i][j] = i

                    //distance calculation
                    else{
                        if(question[i-1] == target[j-1]) array[i][j] = array[i-1][j-1]
                        else array[i][j] = Math.min(array[i-1][j-1], array[i-1][j], array[i][j-1]) + 1
                    }
                }
            }

            /*
            Within the context of this algorithm,
            the value at the edge of the matrix is the operations needed to convert the target string to the question string
            the operation being either addition, deletion, or substitution
    
            the distance is then calculated by dividing the operations needed by the length of the question string
            as the operations needed is a measure of how different the question string is from the target string
            and a distance of 1 means that the question string is completely different from the target string
            */

            //for(let i = 0; i <= questionLength; i++){
            //    console.log(...array[i])
            //}
            let param = Math.max(questionLength, targetLength)
            console.log((param - array[questionLength][targetLength]) + "/" + param)
            return (param - array[questionLength][targetLength]) / param
        }
        
    }
}

export { DistanceAlgorithm }


//let ds = new DistanceAlgorithm()
//console.log(ds.getDistance("kittennnnnnnnn", "kittennnnnnnn"))