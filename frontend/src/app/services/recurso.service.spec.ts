import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { RecursoService } from './recurso.service';
import { RecursoResponse, RecursoRequest } from '../models';

describe('RecursoService', () => {
  let service: RecursoService;
  let httpMock: HttpTestingController;

  const mockRecurso: RecursoResponse = {
    id: 1,
    nombre: 'Cocina',
    descripcion: 'Cocina compartida',
    grupoId: 1,
    capacidad: 4,
    tipo: 'ESPACIO',
    estadoActual: 'DISPONIBLE',
    creadorId: 1
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RecursoService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(RecursoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get recurso by id', (done) => {
    service.get(1).subscribe(recurso => {
      expect(recurso).toEqual(mockRecurso);
      expect(recurso.nombre).toBe('Cocina');
      done();
    });

    const req = httpMock.expectOne('/api/recursos/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockRecurso);
  });

  it('should create recurso', (done) => {
    const nuevoRecurso: RecursoRequest = {
      nombre: 'Lavadora',
      descripcion: 'Lavadora compartida',
      grupoId: 1,
      capacidad: 1,
      tipo: 'OBJETO',
      estadoActual: 'DISPONIBLE',
      creadorId: 1
    };

    service.create(nuevoRecurso).subscribe(recurso => {
      expect(recurso.nombre).toBe('Lavadora');
      done();
    });

    const req = httpMock.expectOne('/api/recursos');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(nuevoRecurso);
    req.flush({ ...mockRecurso, ...nuevoRecurso });
  });

  it('should update recurso', (done) => {
    const updateData = { descripcion: 'Nueva descripción' };

    service.update(1, updateData).subscribe(recurso => {
      expect(recurso.descripcion).toBe('Nueva descripción');
      done();
    });

    const req = httpMock.expectOne('/api/recursos/1');
    expect(req.request.method).toBe('PUT');
    req.flush({ ...mockRecurso, ...updateData });
  });

  it('should delete recurso', (done) => {
    service.delete(1).subscribe(() => {
      done();
    });

    const req = httpMock.expectOne('/api/recursos/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should get all recursos with pagination', (done) => {
    const mockResponse = {
      content: [mockRecurso],
      totalElements: 1,
      totalPages: 1,
      number: 0,
      size: 10
    };

    service.getAll(0, 10).subscribe(response => {
      expect(response.items.length).toBe(1);
      expect(response.total).toBe(1);
      done();
    });

    const req = httpMock.expectOne(request => 
      request.url === '/api/recursos' && 
      request.params.get('page') === '0'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should filter by grupoId', (done) => {
    const mockResponse = {
      content: [mockRecurso],
      totalElements: 1,
      totalPages: 1,
      number: 0,
      size: 10
    };

    service.getAll(0, 10, { grupoId: 1 }).subscribe(response => {
      expect(response.items.length).toBe(1);
      done();
    });

    const req = httpMock.expectOne(request => 
      request.url === '/api/recursos' && 
      request.params.get('grupoId') === '1'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
