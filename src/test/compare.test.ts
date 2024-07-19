import compare from '../classes/Compare';
import Summoner from "../classes/Summoner";
import GameResult from "../types/gameResult";
import Tier from "../types/tier";

// Initialize a Summoner instance
let summoner: Summoner;

describe('Unit tests for Compare module', () => {

    beforeAll(() => {
        summoner = new Summoner('TestSummoner', '123', 'test#1234');
    });

    describe('compareTotalRank', () => {
        beforeEach(() => {
            // Reset summoner properties before each test
            summoner.setTier(Tier.GOLD);
            summoner.setRank('II');
            summoner.setLp(30);
        });

        test('should return VICTORY with LP increase', () => {
            // Arrange
            summoner.setLp(50);  // New LP value
            const currentTier = Tier.GOLD;
            const currentRank = 'II';
            const currentLp = 30;

            // Act
            const result = compare.compareTotalRank(summoner, currentTier, currentRank, currentLp);

            // Assert
            expect(result).toEqual({result: GameResult.VICTORY, type: 'LP', value: 20});
        });

        test('should return DEFEAT with LP decrease', () => {
            // Arrange
            summoner.setLp(10);  // New LP value
            const currentTier = Tier.GOLD;
            const currentRank = 'II';
            const currentLp = 30;

            // Act
            const result = compare.compareTotalRank(summoner, currentTier, currentRank, currentLp);

            // Assert
            expect(result).toEqual({result: GameResult.DEFEAT, type: 'LP', value: 20});
        });

        test('should return DEFEAT with LP at 0', () => {
            // Arrange
            summoner.setLp(0);  // New LP value
            const currentTier = Tier.GOLD;
            const currentRank = 'II';
            const currentLp = 0;

            // Act
            const result = compare.compareTotalRank(summoner, currentTier, currentRank, currentLp);

            // Assert
            expect(result).toEqual({result: GameResult.DEFEAT, type: 'LP', value: 0});
        });

        test('should return REMAKE for a game remake', () => {
            // Arrange
            summoner.setLp(30);  // No change in LP
            const currentTier = Tier.GOLD;
            const currentRank = 'II';
            const currentLp = 30;

            // Act
            const result = compare.compareTotalRank(summoner, currentTier, currentRank, currentLp);

            // Assert
            expect(result).toEqual({result: GameResult.REMAKE, type: '', value: 0});
        });

        test('should return DEFEAT with rank downgrade', () => {
            // Arrange
            summoner.setRank('III');  // New rank value
            const currentTier = Tier.GOLD;
            const currentRank = 'II';
            const currentLp = 30;

            // Act
            const result = compare.compareTotalRank(summoner, currentTier, currentRank, currentLp);

            // Assert
            expect(result).toEqual({result: GameResult.DEFEAT, type: 'RANK', value: 'III'});
        });

        test('should return VICTORY with rank upgrade', () => {
            // Arrange
            summoner.setRank('I');  // New rank value
            const currentTier = Tier.GOLD;
            const currentRank = 'II';
            const currentLp = 30;

            // Act
            const result = compare.compareTotalRank(summoner, currentTier, currentRank, currentLp);

            // Assert
            expect(result).toEqual({result: GameResult.VICTORY, type: 'RANK', value: 'I'});
        });

        test('should return DEFEAT with tier downgrade', () => {
            // Arrange
            summoner.setTier(Tier.SILVER);  // New tier value
            const currentTier = Tier.GOLD;
            const currentRank = 'II';
            const currentLp = 30;

            // Act
            const result = compare.compareTotalRank(summoner, currentTier, currentRank, currentLp);

            // Assert
            expect(result).toEqual({result: GameResult.DEFEAT, type: 'TIER', value: Tier.SILVER});
        });

        test('should return VICTORY with tier upgrade', () => {
            // Arrange
            summoner.setTier(Tier.PLATINUM);  // New tier value
            const currentTier = Tier.GOLD;
            const currentRank = 'II';
            const currentLp = 30;

            // Act
            const result = compare.compareTotalRank(summoner, currentTier, currentRank, currentLp);

            // Assert
            expect(result).toEqual({result: GameResult.VICTORY, type: 'TIER', value: Tier.PLATINUM});
        });
    });

    describe('compareTier', () => {
        test('should return "upgrade" when new tier is higher', () => {
            // Arrange
            const currentTier = Tier.GOLD;
            const newTier = Tier.PLATINUM;

            // Act
            const result = compare.compareTier(currentTier, newTier);

            // Assert
            expect(result).toBe('upgrade');
        });

        test('should return "downgrade" when new tier is lower', () => {
            // Arrange
            const currentTier = Tier.PLATINUM;
            const newTier = Tier.GOLD;

            // Act
            const result = compare.compareTier(currentTier, newTier);

            // Assert
            expect(result).toBe('downgrade');
        });

        test('should return "same" when tiers are equal', () => {
            // Arrange
            const currentTier = Tier.GOLD;
            const newTier = Tier.GOLD;

            // Act
            const result = compare.compareTier(currentTier, newTier);

            // Assert
            expect(result).toBe('same');
        });
    });

    describe('compareRank', () => {
        test('should return "upgrade" when new rank is higher', () => {
            // Arrange
            const currentRank = 'III';
            const newRank = 'II';

            // Act
            const result = compare.compareRank(currentRank, newRank);

            // Assert
            expect(result).toBe('upgrade');
        });

        test('should return "downgrade" when new rank is lower', () => {
            // Arrange
            const currentRank = 'II';
            const newRank = 'III';

            // Act
            const result = compare.compareRank(currentRank, newRank);

            // Assert
            expect(result).toBe('downgrade');
        });

        test('should return "same" when ranks are equal', () => {
            // Arrange
            const currentRank = 'II';
            const newRank = 'II';

            // Act
            const result = compare.compareRank(currentRank, newRank);

            // Assert
            expect(result).toBe('same');
        });
    });
})

