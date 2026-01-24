import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { GrupoService } from './grupo.service';
import { GrupoResponse, GrupoRequest } from '../models';

describe('GrupoService', () => {
  let service: GrupoService;
  let httpMock: HttpTestingController;

  const mockGrupo: GrupoResponse = {
    id: 1,
    nombre: 'Grupo Test',
    descripcion: 'Descripción test',
    codigoInvitacion: 'ABC123',
    creadorId: 1,
    fechaCreacion: new Date().toISOString()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GrupoService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(GrupoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get grupo by id', (done) => {
    service.get(1).subscribe(grupo => {
      expect(grupo).toEqual(mockGrupo);
      expect(grupo.id).toBe(1);
      done();
    });

    const req = httpMock.expectOne('/api/grupos/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockGrupo);
  });

  it('should get all grupos with pagination', (done) => {
    const mockResponse = {
      content: [mockGrupo],
      totalElements: 1,
      totalPages: 1,
      number: 0,
      size: 10
    };

    service.getAll(0, 10).subscribe(response => {
      expect(response.items.length).toBe(1);
      expect(response.total).toBe(1);
      expect(response.items[0]).toEqual(mockGrupo);
      done();
    });

    const req = httpMock.expectOne(request => 
      request.url === '/api/grupos' && 
      request.params.get('page') === '0' &&
      request.params.get('size') === '10'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should create grupo', (done) => {
    const nuevoGrupo: GrupoRequest = {
      nombre: 'Nuevo Grupo',
      descripcion: 'Nueva descripción',
      creadorId: 1
    };

    service.create(nuevoGrupo).subscribe(grupo => {
      expect(grupo.nombre).toBe('Nuevo Grupo');
      done();
    });

    const req = httpMock.expectOne('/api/grupos');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(nuevoGrupo);
    req.flush({ ...mockGrupo, ...nuevoGrupo });
  });

  it('should update grupo', (done) => {
    const updateData = { nombre: 'Grupo Actualizado' };

    service.update(1, updateData).subscribe(grupo => {
      expect(grupo.nombre).toBe('Grupo Actualizado');
      done();
    });

    const req = httpMock.expectOne('/api/grupos/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateData);
    req.flush({ ...mockGrupo, ...updateData });
  });

  it('should delete grupo', (done) => {
    service.delete(1).subscribe(() => {
      done();
    });

    const req = httpMock.expectOne('/api/grupos/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should get recursos of grupo', (done) => {
    const mockRecursos = [
      { id: 1, nombre: 'Cocina', grupoId: 1 },
      { id: 2, nombre: 'Lavadora', grupoId: 1 }
    ];

    service.getRecursos(1).subscribe(recursos => {
      expect(recursos.length).toBe(2);
      expect(recursos[0].nombre).toBe('Cocina');
      done();
    });

    const req = httpMock.expectOne('/api/grupos/1/recursos');
    expect(req.request.method).toBe('GET');
    req.flush(mockRecursos);
  });

  it('should handle error on get', (done) => {
    service.get(999).subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        expect(error).toBeTruthy();
        done();
      }
    });

    const req = httpMock.expectOne('/api/grupos/999');
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });
});
