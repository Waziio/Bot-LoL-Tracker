import { EmbedBuilder } from "discord.js";
import RiotService from "../services/apiRiot";
import GameResult from "../types/gameResult";
import Tier from "../types/tier";
import MessageBuilder from "./MessageBuilder";
import { strToTier } from "../utils/utils";
import { compareTotalRank } from "./Compare";

class Summoner {
  private id: string;
  private puuid: string;
  private name: string;
  private discordAt: string;
  private tier: Tier;
  private rank: string;
  private lp: number;
  private lastGameId: string;
  private riotService: RiotService;

  constructor(id: string, discordAt: string) {
    this.id = id;
    this.puuid = "";
    this.name = "";
    this.discordAt = discordAt;
    this.tier = Tier.UNRANK;
    this.rank = "";
    this.lp = 0;
    this.lastGameId = "";
    this.riotService = new RiotService();
  }

  getDiscordAt(): string {
    return `<@${this.discordAt}>`;
  }

  getName(): string {
    return this.name;
  }

  getPuuid() : string {
    return this.puuid;
  }

  getTier(): Tier {
    return this.tier;
  }

  getRank(): string {
    return this.rank;
  }

  getLp(): number {
    return this.lp;
  }

  getTotalRank(): string {
    return `${this.getDiscordAt()} est **${this.tier} ${this.rank}** ${this.lp} LP`;
  }

  getLastGameId() : string {
    return this.lastGameId
  }

  getData() {
    return {
      name: this.name,
      tier: this.tier,
      rank: this.rank,
      lp: this.lp,
    };
  }

  async loadData() {
    const data = (await this.riotService.getSummonerById(this.id)).data;
    if (!data) return false;
    this.puuid = data.puuid;
    this.name = data.name;
    if (!(await this.findLastGameId())) return false;
    if (!(await this.loadRank())) return false;
    return true;
  }

  async findLastGameId() {
    const data = (await this.riotService.getLastGameId(this.puuid)).data;
    if (!data) return false;
    this.lastGameId = data[0];
    return true;
  }

  async loadRank() {
    let result = (await this.riotService.getRank(this.id)).data;
    // Get only solo queue rank
    result = result.filter((obj: any) => obj.queueType === 'RANKED_SOLO_5x5');
    const data = result[0];
    console.log(data);
    // Checks if summoner is unranked
    if (!data || data?.queueType !== "RANKED_SOLO_5x5") return false;
    this.tier = strToTier(data.tier);
    this.rank = data.rank;
    this.lp = data.leaguePoints;
    return true;
  }

  /**
   * Main function of this class.
   * It tracks the rank of the summoner, and build the discord message.
   */
  async check(): Promise<EmbedBuilder | boolean> {
    const oldTier = this.tier;
    const oldRank = this.rank;
    const oldLp = this.lp;
    const oldLastGameId = this.lastGameId;
    // Init data of summoner
    if (!(await this.loadData())) return false;
    // Checks if there is a new game
    if (oldLastGameId === this.lastGameId) return false;
    // Compare rank
    const msgBuilder = new MessageBuilder(this);
    const result = compareTotalRank(this, oldTier, oldRank, oldLp);
    // If last game was a remake, ignore it
    if (result.result === GameResult.REMAKE) return false;
    // Get infos from last game
    const { champion, score } = await this.getLastGameInfos(this.lastGameId);
    if (!champion) return false;
    // Build discord message 
    return msgBuilder.build(result.result, result.type, result.value, this.name, champion, score);
  }

  /**
   * Get the score and the champion played by the summoner in a game
   * @param matchId
   * @returns 
   */
  async getLastGameInfos(matchId: string): Promise<{ champion: string; score: string }> {
    const matchInfos: any = await this.riotService.getGameInfos(matchId);
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
        if (player.puuid === this.puuid) {
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
