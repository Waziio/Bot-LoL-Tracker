import RiotService from "../services/apiRiot"
import Summoner from "../classes/Summoner"
import Tier from "../types/tier"
import compare from '../classes/Compare'
import GameResult from "../types/gameResult"

const getSummonerByIdMock = jest.fn(() => {
    return new Promise((resolve) => resolve({ data: { name: "name", puuid: "puuid" } }))
})

const getLastGameIdMock = jest.fn(() => {
    return new Promise((resolve) => resolve({ data: ["lastGameId"] }))
})

const getRankMock = jest.fn(() => {
    return new Promise((resolve) => resolve({
        data: [
            { queueType: "RANKED_FLEX_5x5", tier: "GOLD", rank: "I", leaguePoints: 12 },
            { queueType: "RANKED_SOLO_5x5", tier: "SILVER", rank: "II", leaguePoints: 43 },
        ]
    }))
})

jest.mock('../services/apiRiot', () => {
    return jest.fn().mockImplementation(() => {
        return {
            call: jest.fn(() => {
                return new Promise((resolve) => resolve(true))
            }),
            getSummonerById: getSummonerByIdMock,
            getLastGameId: getLastGameIdMock,
            getRank: getRankMock
        };
    });
})

let compareTotalRankMock = jest.fn(() => {
    return { result: GameResult.VICTORY, type: 'TIER', value: Tier.SILVER }
})

jest.mock('../classes/Compare');
compare.compareTotalRank = compareTotalRankMock

describe("Tests for Summoner class", () => {
    describe("loadData function", () => {
        let findLastGameIdMock = jest.fn((): Promise<boolean> => {
            return new Promise((resolve) => {
                resolve(true)
            })
        })
        let loadRankMock = jest.fn((): Promise<boolean> => {
            return new Promise((resolve) => {
                resolve(true)
            })
        })

        test("When all is OK, should set name and puuid and return true", async () => {
            // Arrange
            const summoner = new Summoner('a', 'b')
            summoner.findLastGameId = findLastGameIdMock
            summoner.loadRank = loadRankMock
            // Act
            const result = await summoner.loadData()
            // Assert
            expect(result).toBe(true)
            expect(getSummonerByIdMock).toHaveBeenCalled()
            expect(findLastGameIdMock).toHaveBeenCalled()
            expect(loadRankMock).toHaveBeenCalled()
            expect(summoner.getName()).toBe("name")
            expect(summoner.getPuuid()).toBe("puuid")
        })

        test("When getSummonerById failed, should set name and puuid and return false", async () => {
            // Arrange
            const summoner = new Summoner('a', 'b')
            summoner.findLastGameId = () => new Promise((resolve) => resolve(false))
            summoner.loadRank = loadRankMock
            // Act
            const result = await summoner.loadData()
            // Assert
            expect(result).toBe(false)
            expect(getSummonerByIdMock).toHaveBeenCalled()
            expect(loadRankMock).toHaveBeenCalled()
            expect(summoner.getName()).toBe("name")
            expect(summoner.getPuuid()).toBe("puuid")
        })

        test("When loadRank failed, should set name and puuid and return false", async () => {
            // Arrange
            const summoner = new Summoner('a', 'b')
            summoner.findLastGameId = findLastGameIdMock
            summoner.loadRank = () => new Promise((resolve) => resolve(false))
            // Act
            const result = await summoner.loadData()
            // Assert
            expect(result).toBe(false)
            expect(getSummonerByIdMock).toHaveBeenCalled()
            expect(findLastGameIdMock).toHaveBeenCalled()
            expect(summoner.getName()).toBe("name")
            expect(summoner.getPuuid()).toBe("puuid")
        })
    })

    describe("findLastGameId function", () => {
        test("When called and all is OK, should set lastGameId and return true", async () => {
            // Arrange
            const summoner = new Summoner('a', 'b')
            // Act
            const result = await summoner.findLastGameId()
            // Assert
            expect(result).toBe(true)
            expect(getSummonerByIdMock).toHaveBeenCalled()
            expect(summoner.getLastGameId()).toBe("lastGameId")
        })
    })

    describe("loadRank function", () => {
        test("When called and all is OK, should set tier, rank, lp and return true", async () => {
            // Arrange
            const summoner = new Summoner('a', 'b')
            // Act
            const result = await summoner.loadRank()
            // Assert
            expect(result).toBe(true)
            expect(getRankMock).toHaveBeenCalled()
            expect(summoner.getTier()).toBe(Tier.SILVER)
            expect(summoner.getRank()).toBe("II")
            expect(summoner.getLp()).toBe(43)
        })
    })

    describe.skip("check function", () => {
        let summoner : Summoner
        beforeAll(() => {
            summoner = new Summoner('a', 'b')
            summoner.setTier(Tier.BRONZE)
            summoner.setRank('I')
            summoner.setLp(95)
        })
        test("When called and all is OK,", async () => {
            // Arrange
            const checkLoadDataMock = jest.fn(() : Promise<boolean> => {
                return new Promise((resolve) => {
                    summoner.setPuuid('a')
                    summoner.setLastGameId('a')
                    summoner.setTier(Tier.SILVER)
                    summoner.setRank('IV')
                    summoner.setLp(15)
                    resolve(true)
                })
            })
            const checkGetLastGameInfos = jest.fn(() : Promise<{ champion: string; score: string }> => {
                return new Promise((resolve) => {
                    resolve({ champion: 'Sett', score: '12/4/8' })
                })
            })
            summoner.loadData = checkLoadDataMock
            summoner.getLastGameInfos = checkGetLastGameInfos
            // Act
            console.log(compare)
            const result = await summoner.check()
            // Assert
            expect(result).toBe(true)
            expect(checkLoadDataMock).toHaveBeenCalled()
            expect(compareTotalRankMock).toHaveBeenCalledWith(summoner, Tier.BRONZE, 'I', 95)
            expect(checkGetLastGameInfos).toHaveBeenCalledWith(summoner.getLastGameId())
            console.log(result)
        })
    })
})



