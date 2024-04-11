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

        test("OK", async () => {
            // Arrange
            const summoner = new Summoner('a', 'b')
            summoner.getLastGameId = getLastGameIdMock
            summoner.loadRank = loadRankMock
            // Act
            const result = await summoner.loadData()
            // Assert
            expect(result).toBe(true)
            expect(getLastGameIdMock).toHaveBeenCalled()
            expect(loadRankMock).toHaveBeenCalled()
        })
    })
})