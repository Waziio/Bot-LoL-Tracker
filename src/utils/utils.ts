import Tier from "../types/tier";

export function strToTier(tier: string): Tier {
    switch (tier.toUpperCase()) {
      case "IRON": {
        return Tier.IRON;
      }

      case "BRONZE": {
        return Tier.BRONZE;
      }

      case "SILVER": {
        return Tier.SILVER;
      }

      case "GOLD": {
        return Tier.GOLD;
      }

      case "PLATINUM": {
        return Tier.PLATINUM;
      }

      case "EMERALD": {
        return Tier.EMERALD;
      }

      case "DIAMOND": {
        return Tier.DIAMOND;
      }

      case "MASTER": {
        return Tier.MASTER;
      }

      case "GRANDMASTER": {
        return Tier.GRANDMASTER;
      }

      case "CHALLENGER": {
        return Tier.CHALLENGER;
      }

      default: {
        return Tier.UNRANK;
      }
    }
  }