import RiotService from "../services/apiRiot"
import Summoner from "../classes/Summoner"
const getSummonerByIdMock = jest.fn(() => {
    return new Promise((resolve) => resolve({ data: { name: "name", puuid: "puuid" } }))
})

jest.mock('../services/apiRiot', () => {
    return jest.fn().mockImplementation(() => {
        return {
            call: jest.fn(() => {
                return new Promise((resolve) => resolve(true))
            }),
            getSummonerById: getSummonerByIdMock
        };
    });
})

describe("Tests for Summoner class", () => {
    describe("loadData function", () => {
        let getLastGameIdMock = jest.fn(() : Promise<boolean> => {
            return new Promise((resolve) => {
                resolve(true)
            })
        })
        let loadRankMock = jest.fn(() : Promise<boolean> => {
            return new Promise((resolve) => {
                resolve(true)
            })
        })

        test("When all is OK, should set name and puuid and return true", async () => {
            // Arrange
            const summoner = new Summoner('a', 'b')
            summoner.getLastGameId = getLastGameIdMock
            summoner.loadRank = loadRankMock
            // Act
            const result = await summoner.loadData()
            // Assert
            expect(result).toBe(true)
            expect(getSummonerByIdMock).toHaveBeenCalled()
            expect(getLastGameIdMock).toHaveBeenCalled()
            expect(loadRankMock).toHaveBeenCalled()
            expect(summoner.getName()).toBe("name")
            expect(summoner.getPuuid()).toBe("puuid")
        })

        test("When getSummonerById failed, should set name and puuid and return false", async () => {
            // Arrange
            const summoner = new Summoner('a', 'b')
            summoner.getLastGameId = () => new Promise((resolve) => resolve(false))
            summoner.loadRank = loadRankMock
            // Act
            const result = await summoner.loadData()
            // Assert
            expect(result).toBe(false)
            expect(getSummonerByIdMock).toHaveBeenCalled()
            expect(getLastGameIdMock).toHaveBeenCalled()
            expect(loadRankMock).toHaveBeenCalled()
            expect(summoner.getName()).toBe("name")
            expect(summoner.getPuuid()).toBe("puuid")
        })

        test("When loadRank failed, should set name and puuid and return false", async () => {
            // Arrange
            const summoner = new Summoner('a', 'b')
            summoner.getLastGameId = getLastGameIdMock
            summoner.loadRank = () => new Promise((resolve) => resolve(false))
            // Act
            const result = await summoner.loadData()
            // Assert
            expect(result).toBe(false)
            expect(getSummonerByIdMock).toHaveBeenCalled()
            expect(getLastGameIdMock).toHaveBeenCalled()
            expect(loadRankMock).toHaveBeenCalled()
            expect(summoner.getName()).toBe("name")
            expect(summoner.getPuuid()).toBe("puuid")
        })
    })
})