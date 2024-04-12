import { EmbedBuilder } from "discord.js";
import RiotService from "../services/apiRiot";
import GameResult from "../types/gameResult";
import Tier from "../types/tier";
import MessageBuilder from "./MessageBuilder";
import { strToTier } from "../utils/utils";
import compare from "./Compare";
import * as console from "node:console";

class Summoner {
  private _id: string;
  private _puuid: string;
  private _name: string;
  private _discordAt: string;
  private _tier: Tier;
  private _rank: string;
  private _lp: number;
  private _lastGameId: string;
  private _riotService: RiotService;

  constructor(id: string, discordAt: string) {
    this._id = id;
    this._puuid = "";
    this._name = "";
    this._discordAt = discordAt;
    this._tier = Tier.UNRANK;
    this._rank = "";
    this._lp = 0;
    this._lastGameId = "";
    this._riotService = new RiotService();
  }

  getDiscordAt(): string {
    return `<@${this._discordAt}>`;
  }

  getName(): string {
    return this._name;
  }

  getPuuid() : string {
    return this._puuid;
  }

  getTier(): Tier {
    return this._tier;
  }

  getRank(): string {
    return this._rank;
  }

  getLp(): number {
    return this._lp;
  }

  getTotalRank(): string {
    return `${this.getDiscordAt()} est **${this._tier} ${this._rank}** ${this._lp} LP`;
  }

  getLastGameId() : string {
    return this._lastGameId
  }

  setId(value: string) {
    this._id = value;
  }

  setPuuid(value: string) {
    this._puuid = value;
  }

  setName(value: string) {
    this._name = value;
  }

  setDiscordAt(value: string) {
    this._discordAt = value;
  }

  setTier(value: Tier) {
    this._tier = value;
  }

  setRank(value: string) {
    this._rank = value;
  }

  setLp(value: number) {
    this._lp = value;
  }

  setLastGameId(value: string) {
    this._lastGameId = value;
  }

  setRiotService(value: RiotService) {
    this._riotService = value;
  }

  async loadData() {
    const data = (await this._riotService.getSummonerById(this._id)).data;
    if (!data) return false;
    this._puuid = data.puuid;
    this._name = data.name;
    if (!(await this.findLastGameId())) return false;
    if (!(await this.loadRank())) return false;
    return true;
  }

  async findLastGameId() {
    const data = (await this._riotService.getLastGameId(this._puuid)).data;
    if (!data) return false;
    this._lastGameId = data[0];
    return true;
  }

  async loadRank() {
    let result = (await this._riotService.getRank(this._id)).data;
    // Get only solo queue rank
    result = result.filter((obj: any) => obj.queueType === 'RANKED_SOLO_5x5');
    const data = result[0];
    console.log(data);
    // Checks if summoner is unranked
    if (!data || data?.queueType !== "RANKED_SOLO_5x5") return false;
    this._tier = strToTier(data.tier);
    this._rank = data.rank;
    this._lp = data.leaguePoints;
    return true;
  }

  /**
   * Main function of this class.
   * It tracks the rank of the summoner, and build the discord message.
   */
  async check(): Promise<EmbedBuilder | boolean> {
    const oldTier = this._tier;
    const oldRank = this._rank;
    const oldLp = this._lp;
    const oldLastGameId = this._lastGameId;
    // Init data of summoner
    if (!(await this.loadData())) return false;
    // Checks if there is a new game
    if (oldLastGameId === this._lastGameId) return false;
    // Compare rank
    const result = compare.compareTotalRank(this, oldTier, oldRank, oldLp);
    // If last game was a remake, ignore it
    if (result.result === GameResult.REMAKE) return false;
    // Get infos from last game
    const { champion, score } = await this.getLastGameInfos(this._lastGameId);
    if (!champion) return false;
    // Build discord message 
    const msgBuilder = new MessageBuilder(this);
    console.log(result)
    console.log(champion + score)
    return msgBuilder.build(result.result, result.type, result.value, champion, score);
  }

  /**
   * Get the score and the champion played by the summoner in a game
   * @param matchId
   * @returns 
   */
  async getLastGameInfos(matchId: string): Promise<{ champion: string; score: string }> {
    const matchInfos: any = await this._riotService.getGameInfos(matchId);
    const players: Array<any> = matchInfos.data.info.participants;
    let score = {
      kills: "",
      deaths: "",
      assists: "",
    };
    let champion = "";

    if (matchInfos) {
      // Find summoner
      players.forEach((player) => {
        // If the player is our summoner
        if (player.puuid === this._puuid) {
          // Get his game infos
          score.kills = player.kills;
          score.deaths = player.deaths;
          score.assists = player.assists;
          champion = player.championName;
        }
      });
    }

    return { champion: champion, score: `${score.kills} / ${score.deaths} / ${score.assists}` };
  }
}



export default Summoner;
