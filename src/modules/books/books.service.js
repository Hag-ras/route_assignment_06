import { db } from '../../DB/connection.db.js'

export const getBooksCollection = () => db.collection('books')
export const getAuthorsCollection = () => db.collection('authors')
export const getLogsCollection = () => db.collection('logs')

export const createBooksCollection = async () => {
  const existing = await db.listCollections({ name: 'books' }, { nameOnly: true }).toArray()
  if (existing.some((collection) => collection.name === 'books')) {
    return { created: false, message: 'books collection already exists' }
  }

  await db.createCollection('books', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['title'],
        properties: {
          title: {
            bsonType: 'string',
            minLength: 1,
          },
          author: { bsonType: ['string', 'null'] },
          year: { bsonType: ['int', 'null'] },
          genres: {
            bsonType: ['array', 'null'],
            items: { bsonType: 'string' },
          },
        },
      },
    },
  })

  return { created: true, message: 'books collection created' }
}

export const createAuthorsCollection = async (authorDoc) => {
  return getAuthorsCollection().insertOne(authorDoc)
}

export const createCappedLogsCollection = async () => {
  const existing = await db.listCollections({ name: 'logs' }, { nameOnly: true }).toArray()
  if (existing.some((collection) => collection.name === 'logs')) {
    return { created: false, message: 'logs collection already exists' }
  }

  await db.createCollection('logs', { capped: true, size: 1048576 })
  return { created: true, message: 'logs collection created' }
}

export const createTitleIndex = async () => getBooksCollection().createIndex({ title: 1 })
export const insertBook = async (book) => getBooksCollection().insertOne(book)
export const insertBooksBatch = async (books) => getBooksCollection().insertMany(books)
export const insertLog = async (log) => getLogsCollection().insertOne(log)
export const patchBookByTitle = async (title, year) =>
  getBooksCollection().updateOne({ title }, { $set: { year } })
export const findBookByTitle = async (title) => getBooksCollection().findOne({ title })
export const findBooksByYearRange = async (from, to) =>
  getBooksCollection().find({ year: { $gte: Number(from), $lte: Number(to) } }).toArray()
export const findBooksByGenre = async (genre) => getBooksCollection().find({ genres: genre }).toArray()
export const skipLimitBooks = async () =>
  getBooksCollection().find({}).sort({ year: -1 }).skip(2).limit(3).toArray()
export const findIntegerYearBooks = async () => getBooksCollection().find({ year: { $type: 'int' } }).toArray()
export const findBooksWithoutGenres = async (excludedGenres) =>
  getBooksCollection().find({ $nor: [{ genres: { $in: excludedGenres } }] }).toArray()
export const deleteBooksBeforeYear = async (year) =>
  getBooksCollection().deleteMany({ year: { $lt: Number(year) } })
export const aggregateBooksAfterYear = async () =>
  getBooksCollection().aggregate([{ $match: { year: { $gt: 2000 } } }, { $sort: { year: -1 } }]).toArray()
export const aggregateBooksProjection = async () =>
  getBooksCollection()
    .aggregate([
      { $match: { year: { $gt: 2000 } } },
      { $project: { _id: 0, title: 1, author: 1, year: 1 } },
    ])
    .toArray()
export const aggregateUnwindGenres = async () =>
  getBooksCollection().aggregate([{ $unwind: '$genres' }]).toArray()
export const aggregateJoinBooksAndLogs = async () =>
  getBooksCollection()
    .aggregate([
      {
        $lookup: {
          from: 'logs',
          localField: 'title',
          foreignField: 'bookTitle',
          as: 'book_details',
        },
      },
      { $match: { book_details: { $ne: [] } } },
    ])
    .toArray()
