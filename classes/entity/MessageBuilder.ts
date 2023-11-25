import { EmbedBuilder } from "discord.js";
import GameResult from "../types/gameResult";
import Summoner from "./Summoner";
import Tier from "../types/tier";

export default class MessageBuilder {
  private summoner: Summoner;
  private embedBuilder: EmbedBuilder = new EmbedBuilder();

  constructor(summoner: Summoner) {
    this.summoner = summoner;
  }

  build(gameResult: GameResult, type: string, value: any): EmbedBuilder | boolean {
    if (gameResult === GameResult.REMAKE) return false;
    this.embedBuilder.setTitle(gameResult);
    switch (type.toUpperCase()) {
      case "LP": {
        return this.buildLp(gameResult, value);
      }

      case "RANK": {
        return this.buildRank(gameResult, value);
      }

      case "TIER": {
        return this.buildTier(gameResult, value);
      }

      default: {
        return false;
      }
    }
  }

  buildLp(gameResult: GameResult, value: number): EmbedBuilder {
    if (gameResult === GameResult.DEFEAT) {
      this.embedBuilder.setDescription(`${this.summoner.getName()} a perdu -${value} LP`).setColor("Red");
    } else if (gameResult === GameResult.VICTORY) {
      this.embedBuilder.addFields({ name: ' ', value: `**+ ${value} LP**` }).setColor("Green");
    }
    this.embedBuilder.setDescription(this.summoner.getTotalRank() );
    return this.embedBuilder;
  }

  buildRank(gameResult: GameResult, value: string): EmbedBuilder {
    if (gameResult === GameResult.DEFEAT) {
      this.embedBuilder.setDescription(`${this.summoner.getName()} est descendu **${this.summoner.getTier()} ${value}**`).setColor("DarkRed");
    } else if (gameResult === GameResult.VICTORY) {
      this.embedBuilder.setDescription(`${this.summoner.getName()} est monté **${this.summoner.getTier()} ${value}**`).setColor("DarkGreen");
    }
    return this.embedBuilder;
  }

  buildTier(gameResult: GameResult, value: Tier): EmbedBuilder {
    if (gameResult === GameResult.DEFEAT) {
      this.embedBuilder.setDescription(`${this.summoner.getName()} est descendu **${value}**`).setColor("NotQuiteBlack");
    } else if (gameResult === GameResult.VICTORY) {
      this.embedBuilder.setDescription(`${this.summoner.getName()} est monté **${value}**`).setColor("Gold");
    }
    return this.embedBuilder;
  }
}
