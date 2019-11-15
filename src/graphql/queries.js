/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getGame = `query GetGame($id: ID!) {
  getGame(id: $id) {
    id
    gameRoomID
    creator {
      id
      username
      points
      skillLevel
      rank
    }
    creatorOrientation
    time
    variant
  }
}
`;
export const listGames = `query ListGames(
  $filter: ModelGameFilterInput
  $limit: Int
  $nextToken: String
) {
  listGames(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      gameRoomID
      creator {
        id
        username
        points
        skillLevel
        rank
      }
      creatorOrientation
      time
      variant
    }
    nextToken
  }
}
`;
export const getGameRoom = `query GetGameRoom($id: ID!) {
  getGameRoom(id: $id) {
    id
    opponent {
      id
      username
      points
      skillLevel
      rank
    }
    creatorOrientation
    time
    variant
    fen
  }
}
`;
export const listGameRooms = `query ListGameRooms(
  $filter: ModelGameRoomFilterInput
  $limit: Int
  $nextToken: String
) {
  listGameRooms(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      opponent {
        id
        username
        points
        skillLevel
        rank
      }
      creatorOrientation
      time
      variant
      fen
    }
    nextToken
  }
}
`;