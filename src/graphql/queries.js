/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getGame = `query GetGame($id: ID!) {
  getGame(id: $id) {
    id
    creator
    variant
    started
    white
    black
    history
    fen
    pgn
    turn
    result
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
      creator
      variant
      started
      white
      black
      history
      fen
      pgn
      turn
      result
    }
    nextToken
  }
}
`;
