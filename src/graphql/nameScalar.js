import { GraphQLScalarType, Kind } from 'graphql';

export const Name = new GraphQLScalarType({
  name: 'Name',
  description: 'Typ reprezentujący imię, które musi mieć od 3 do 40 znaków.',
  parseValue(value) {
    if (typeof value !== 'string' || value.length < 3 || value.length > 40) {
      throw new Error('Imię musi mieć od 3 do 40 znaków');
    }
    return value;
  },
  serialize(value) {
    if (typeof value !== 'string' || value.length < 3 || value.length > 40) {
      throw new Error('Imię musi mieć od 3 do 40 znaków');
    }
    return value;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      if (ast.value.length < 3 || ast.value.length > 40) {
        throw new Error('Imię musi mieć od 3 do 40 znaków');
      }
      return ast.value;
    }
    throw new Error('Imię musi mieć od 3 do 40 znaków');
  },
});
