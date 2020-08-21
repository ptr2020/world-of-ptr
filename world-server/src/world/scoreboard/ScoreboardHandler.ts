import { Messages, Router } from "world-core";
import { Player } from "../player";
import { SendMessage } from "../../network";
import { ScoreboardDataMessage, PlayerScore as PlayerPoint, PlayerScore } from "./ScoreboardMessages";

export class ScoreboardHandler implements Messages.MsgHandler {
    private players: Player[];

    constructor(players: Player[]) {
        this.players = players;
    }

    public getTypes(): string[] {
        return ['scoreboard.show'];
    }

    public validate(msg: Messages.Message): boolean {
        return true;
    }

    public handle(msg: Messages.Message): void {
        const sortedPlayers = this.players.sort((a: Player, b: Player) => {
            return a.score > b.score ? 1 : -1;
        });

        var playerScores: PlayerScore[] = [];
        for (var i = 0; i < Math.min(sortedPlayers.length, 10); i++) {
            const playerScore = new PlayerScore(sortedPlayers[i].name, sortedPlayers[i].score);
            playerScores.push(playerScore);
        }

        const scoreboardDataMsg = new ScoreboardDataMessage(playerScores);
        Router.emit(new SendMessage(<string>msg.clientId, scoreboardDataMsg));
    }
}
