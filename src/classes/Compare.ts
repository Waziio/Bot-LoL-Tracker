import GameResult from "../types/gameResult";
import Tier from "../types/tier";
import Summoner from "./Summoner";


export function compareTotalRank(summoner: Summoner, currentTier: Tier, currentRank: string, currentLp: number): CompareResult {
    // Same tier
    if (compareTier(currentTier, summoner.getTier()) === "same") {
        // Same rank
        if (compareRank(currentRank, summoner.getRank()) === "same") {
            // Win lp
            if (summoner.getLp() > currentLp) {
                return { result: GameResult.VICTORY, type: "LP", value: summoner.getLp() - currentLp }
            }
            // Loss lp
            if (summoner.getLp() < currentLp) {
                return { result: GameResult.DEFEAT, type: "LP", value: currentLp - summoner.getLp() }
            }
            // Loss at 0lp
            if (summoner.getLp() == 0 && currentLp == 0) {
                return { result: GameResult.DEFEAT, type: "LP", value: 0 }
            }
            // Game remake
            return { result: GameResult.REMAKE, type: "", value: 0 };

        } else if (compareRank(currentRank, summoner.getRank()) === "downgrade") {
            // Loss rank
            return { result: GameResult.DEFEAT, type: "RANK", value: summoner.getRank() };
        } else {
            // Win rank
            return { result: GameResult.VICTORY, type: "RANK", value: summoner.getRank() };
        }
    } else if (compareTier(currentTier, summoner.getTier()) === "downgrade") {
        // Loss tier
        return { result: GameResult.DEFEAT, type: "TIER", value: summoner.getTier() };
    } else if (compareTier(currentTier, summoner.getTier()) === "upgrade") {
        // Win tier
        return { result: GameResult.VICTORY, type: "TIER", value: summoner.getTier() };
    } else {
        // error
        return { result: GameResult.REMAKE, type: "", value: 0 }
    }
}

function compareTier(currentTier: Tier, newTier: Tier) {
    const order = ["IRON", "BRONZE", "SILVER", "GOLD", "PLATINUM", "EMERALD", "DIAMOND", "MASTER", "GRANDMASTER", "CHALLENGER"];
    if (order.indexOf(currentTier) < order.indexOf(newTier)) return "upgrade";
    if (order.indexOf(currentTier) > order.indexOf(newTier)) return "downgrade";
    if (order.indexOf(currentTier) === order.indexOf(newTier)) return "same";
}

function compareRank(currentRank: string, newRank: string) {
    const order = ["IV", "III", "II", "I"];
    if (order.indexOf(currentRank) < order.indexOf(newRank)) return "upgrade";
    if (order.indexOf(currentRank) > order.indexOf(newRank)) return "downgrade";
    if (order.indexOf(currentRank) === order.indexOf(newRank)) return "same";
}



type CompareResult = {
    result: GameResult;
    type: string;
    value: Tier | string | number;
};