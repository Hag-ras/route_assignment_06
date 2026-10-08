import { db } from '../connection.db.js'

export const bookModel = db.createCollection('books', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title'],
      properties: {
        title: {
          bsonType: 'string',
          minLength: 1,
        },
        author: {
          bsonType: ['string', 'null'],
        },
        year: {
          bsonType: ['int', 'null'],
        },
        genres: {
          bsonType: ['array', 'null'],
          items: {
            bsonType: 'string',
          },
        },
      },
    },
  },
})

export const getBooksCollection = () => db.collection('books')