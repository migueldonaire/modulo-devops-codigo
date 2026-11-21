import { BadRequestException, NotFoundException } from '@nestjs/common';
import { BooksService } from './books.service';

// Tests unitarios: el servicio solo, sin servidor ni peticiones HTTP
describe('BooksService', () => {
  let service: BooksService;

  beforeEach(() => {
    service = new BooksService(); // uno nuevo en cada test: datos de partida limpios
  });

  it('findAll filtra por autor sin mirar mayúsculas', () => {
    const books = service.findAll('GARCÍA');
    expect(books).toHaveLength(2);
  });

  it('findOne lanza un 404 si el libro no existe', () => {
    expect(() => service.findOne(999)).toThrow(NotFoundException);
  });

  it('create añade el libro con un id nuevo', () => {
    const book = service.create({
      title: 'Momo',
      author: 'Michael Ende',
      pages: 256,
    });
    expect(book.id).toBe(4);
    expect(service.findAll()).toContainEqual(book);
  });

  it('update sin campos lanza un 400', () => {
    expect(() => service.update(1, {})).toThrow(BadRequestException);
  });
});
