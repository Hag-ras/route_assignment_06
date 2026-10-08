import { Router } from 'express'
import { successResponse } from '../../common/utils/succuess.response.js'
import {
  aggregateBooksAfterYear,
  aggregateBooksProjection,
  aggregateJoinBooksAndLogs,
  aggregateUnwindGenres,
  createAuthorsCollection,
  createBooksCollection,
  createCappedLogsCollection,
  createTitleIndex,
  deleteBooksBeforeYear,
  findBookByTitle,
  findBooksByGenre,
  findBooksByYearRange,
  findBooksWithoutGenres,
  findIntegerYearBooks,
  insertBook,
  insertBooksBatch,
  insertLog,
  patchBookByTitle,
  skipLimitBooks,
} from './books.service.js'

const router = Router()

router.post('/collection/books', async (req, res, next) => {
  try {
    const result = await createBooksCollection()
    return successResponse({ res, status: 201, message: 'books collection created', data: result })
  } catch (error) {
    next(error)
  }
})

router.post('/collection/authors', async (req, res, next) => {
  try {
    const authorDoc = req.body && Object.keys(req.body).length ? req.body : { name: 'Author1', nationality: 'British' }
    const result = await createAuthorsCollection(authorDoc)
    return successResponse({ res, status: 201, message: 'author inserted into implicit collection', data: result })
  } catch (error) {
    next(error)
  }
})

router.post('/collection/logs/capped', async (req, res, next) => {
  try {
    const result = await createCappedLogsCollection()
    return successResponse({ res, status: 201, message: 'capped logs collection created', data: result })
  } catch (error) {
    next(error)
  }
})

router.post('/collection/books/index', async (req, res, next) => {
  try {
    const result = await createTitleIndex()
    return successResponse({ res, status: 201, message: 'title index created', data: result })
  } catch (error) {
    next(error)
  }
})

router.post('/books', async (req, res, next) => {
  try {
    const payload = req.body && Object.keys(req.body).length ? req.body : {
      title: 'Book One',
      author: 'Jane Austen',
      year: 1813,
      genres: ['Romance', 'Classic'],
    }
    const result = await insertBook(payload)
    return successResponse({ res, status: 201, message: 'Book inserted', data: result })
  } catch (error) {
    next(error)
  }
})

router.post('/books/batch', async (req, res, next) => {
  try {
    const payload = req.body && Array.isArray(req.body) && req.body.length ? req.body : [
      { title: 'Future', author: 'George Orwell', year: 2020, genres: ['Science Fiction'] },
      { title: 'Brave New World', author: 'Aldous Huxley', year: 2006, genres: ['Dystopian', 'Science Fiction'] },
      { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', year: 1925, genres: ['Classic', 'Drama'] },
    ]
    const result = await insertBooksBatch(payload)
    return successResponse({ res, status: 201, message: 'Books inserted', data: result })
  } catch (error) {
    next(error)
  }
})

router.post('/logs', async (req, res, next) => {
  try {
    const payload = req.body && Object.keys(req.body).length ? req.body : {
      action: 'created',
      bookTitle: 'Future',
      createdAt: new Date(),
    }
    const result = await insertLog(payload)
    return successResponse({ res, status: 201, message: 'Log inserted', data: result })
  } catch (error) {
    next(error)
  }
})

router.patch('/books/:title', async (req, res, next) => {
  try {
    const title = req.params.title
    const year = Number(req.body?.year ?? 2022)
    const result = await patchBookByTitle(title, year)
    return successResponse({ res, message: 'Book updated', data: result })
  } catch (error) {
    next(error)
  }
})

router.get('/books/title', async (req, res, next) => {
  try {
    const { title } = req.query
    const result = await findBookByTitle(title)
    return successResponse({ res, data: result })
  } catch (error) {
    next(error)
  }
})

router.get('/books/year', async (req, res, next) => {
  try {
    const { from, to } = req.query
    const result = await findBooksByYearRange(from, to)
    return successResponse({ res, data: result })
  } catch (error) {
    next(error)
  }
})

router.get('/books/genre', async (req, res, next) => {
  try {
    const { genre } = req.query
    const result = await findBooksByGenre(genre)
    return successResponse({ res, data: result })
  } catch (error) {
    next(error)
  }
})

router.get('/books/skip-limit', async (req, res, next) => {
  try {
    const result = await skipLimitBooks()
    return successResponse({ res, data: result })
  } catch (error) {
    next(error)
  }
})

router.get('/books/year-integer', async (req, res, next) => {
  try {
    const result = await findIntegerYearBooks()
    return successResponse({ res, data: result })
  } catch (error) {
    next(error)
  }
})

router.get('/books/exclude-genres', async (req, res, next) => {
  try {
    const result = await findBooksWithoutGenres(['Horror', 'Science Fiction'])
    return successResponse({ res, data: result })
  } catch (error) {
    next(error)
  }
})

router.delete('/books/before-year', async (req, res, next) => {
  try {
    const { year } = req.query
    const result = await deleteBooksBeforeYear(year)
    return successResponse({ res, message: 'Books deleted before selected year', data: result })
  } catch (error) {
    next(error)
  }
})

router.get('/books/aggregate1', async (req, res, next) => {
  try {
    const result = await aggregateBooksAfterYear()
    return successResponse({ res, data: result })
  } catch (error) {
    next(error)
  }
})

router.get('/books/aggregate2', async (req, res, next) => {
  try {
    const result = await aggregateBooksProjection()
    return successResponse({ res, data: result })
  } catch (error) {
    next(error)
  }
})

router.get('/books/aggregate3', async (req, res, next) => {
  try {
    const result = await aggregateUnwindGenres()
    return successResponse({ res, data: result })
  } catch (error) {
    next(error)
  }
})

router.get('/books/aggregate4', async (req, res, next) => {
  try {
    const result = await aggregateJoinBooksAndLogs()
    return successResponse({ res, data: result })
  } catch (error) {
    next(error)
  }
})

export default router
