type GetGameInfosResponse = {
    info: {
        participants: Array<Player>
    }
}

type Player = {
    puuid: string,
    kills: number,
    deaths: number,
    assists: number,
    championName: string
}


type GetRankResponse = Array<SummonerRank>


type SummonerRank = {
    queueType: string,
    rank: string,
    tier: string,
    leaguePoints: number
}

type GetSummonerByIdResponse = {
    puuid: string
}