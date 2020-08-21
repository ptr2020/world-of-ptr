import { Messages } from "world-core";

export class ScoreboardShowMessage implements Messages.Message {
    type: string;
    clientId?: string;

    constructor() {
        this.type = "scoreboard.show";
    }
}

export class PlayerScore {
    name: string;
    score: number;

    constructor(name: string, score: number) {
        this.name = name;
        this.score = score;
    }
}

export class ScoreboardDataMessage implements Messages.Message {
    type: string;
    scores: PlayerScore[];

    constructor(scores: PlayerScore[]) {
        this.type = "scoreboard.data";
        this.scores = scores;
    }
}
