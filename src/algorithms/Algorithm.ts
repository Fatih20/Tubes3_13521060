// Placeholder for parent algorithm class
abstract class Algorithm {
    targetString: string;
    substring: string;

    constructor(targetString: string, substring: string) {
        this.targetString = targetString;
        this.substring = substring;
    }

    abstract check(): boolean;

}
