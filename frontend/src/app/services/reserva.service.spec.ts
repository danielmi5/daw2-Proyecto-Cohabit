import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ReservaService } from './reserva.service';
import { ReservaResponse, ReservaRequest } from '../models';

describe('ReservaService', () => {
  let service: ReservaService;
  let httpMock: HttpTestingController;

  const mockReserva: ReservaResponse = {
    id: 1,
    recursoId: 1,
    miembroGrupoId: 1,
    fecha: '2026-01-27',
    horaInicio: '10:00:00',
    horaFin: '12:00:00',
    estado: 'CONFIRMADA',
    notas: 'Test reserva',
    numPersonas: 2
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ReservaService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ReservaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get reserva by id', (done) => {
    service.get(1).subscribe(reserva => {
      expect(reserva).toEqual(mockReserva);
      expect(reserva.estado).toBe('CONFIRMADA');
      done();
    });

    const req = httpMock.expectOne('/api/reservas/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockReserva);
  });

  it('should create reserva', (done) => {
    const nuevaReserva: ReservaRequest = {
      recursoId: 1,
      miembroGrupoId: 1,
      fecha: '2026-01-27',
      horaInicio: '10:00:00',
      horaFin: '12:00:00',
      estado: 'PENDIENTE',
      notas: 'Nueva reserva',
      numPersonas: 2
    };

    service.create(nuevaReserva).subscribe(reserva => {
      expect(reserva.notas).toBe('Nueva reserva');
      done();
    });

    const req = httpMock.expectOne('/api/reservas');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(nuevaReserva);
    req.flush({ ...mockReserva, ...nuevaReserva });
  });

  it('should update reserva', (done) => {
    const updateData = { notas: 'Notas actualizadas' };

    service.update(1, updateData).subscribe(reserva => {
      expect(reserva.notas).toBe('Notas actualizadas');
      done();
    });

    const req = httpMock.expectOne('/api/reservas/1');
    expect(req.request.method).toBe('PUT');
    req.flush({ ...mockReserva, ...updateData });
  });

  it('should delete reserva', (done) => {
    service.delete(1).subscribe(() => {
      done();
    });

    const req = httpMock.expectOne('/api/reservas/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should get all reservas with pagination', (done) => {
    const mockResponse = {
      content: [mockReserva],
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
      request.url === '/api/reservas' && 
      request.params.get('page') === '0'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should filter by estado', (done) => {
    const mockResponse = {
      content: [mockReserva],
      totalElements: 1,
      totalPages: 1,
      number: 0,
      size: 10
    };

    service.getAll(0, 10, { estado: 'CONFIRMADA' }).subscribe(response => {
      expect(response.items.length).toBe(1);
      done();
    });

    const req = httpMock.expectOne(request => 
      request.url === '/api/reservas' && 
      request.params.get('estado') === 'CONFIRMADA'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
