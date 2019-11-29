/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getRecipe = `query GetRecipe($id: ID!) {
  getRecipe(id: $id) {
    id
    title
    category
    owner
    createdAt
  }
}
`;
export const listRecipes = `query ListRecipes(
  $filter: ModelRecipeFilterInput
  $limit: Int
  $nextToken: String
) {
  listRecipes(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      title
      category
      owner
      createdAt
    }
    nextToken
  }
}
`;
