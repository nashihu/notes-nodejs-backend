const { nanoid } = require('nanoid');
const { books } = require('./data');
const { httpError, bsValidator } = require('./utils');

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    insertedAt,
    finished,
    updatedAt,
  };

  let error = bsValidator(newBook, {
    name: 'Gagal menambahkan buku. Mohon isi nama buku',
  })

  if (readPage > pageCount) {
    error = 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
  }

  if (error !== null) {
    return httpError(h, error)
  }

  // console.log(newBook);

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  console.log(books)
  let { reading, finished, name } = request.query
  reading = reading === '1'
  finished = finished === '1';
  if (name === undefined) {
    name = ''
  }
  name = name.toLowerCase()
  const condition = (e) => e.reading === reading && e.finished === finished
    && e.name.toLowerCase().includes(name)
  const output = books.filter(condition)
  console.log(h.Toolkit)
  return {
    status: 'success',
    data: {
      books: output.map((e) => ({
        id: e.id,
        name: e.name,
        publisher: e.publisher,
      })),
    },
  };
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const book = books.filter((n) => n.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  let error = bsValidator(request.payload, {
    name: 'Gagal memperbarui buku. Mohon isi nama buku',
  })

  if (readPage > pageCount) {
    error = 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
  }

  if (error != null) {
    return httpError(h, error)
  }

  const index = books.findIndex((b) => b.id === id);

  if (index !== -1) {
    const updatedBook = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    }
    books[index] = updatedBook;
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
}

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((b) => b.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
