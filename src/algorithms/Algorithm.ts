// Placeholder for parent algorithm class
abstract class Algorithm {

    /**
     *
     * @param target substring from input
     * @param question question to be matched against
     */
    abstract check(target: string, question: string): boolean;
    // Target is the substring, question is the subject to be matched
}

export { Algorithm }
