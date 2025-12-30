import { TestBed } from '@angular/core/testing';
import { NotificacionService } from './notificacion.service';

describe('NotificacionService', () => {
  let service: NotificacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add success notification', () => {
    service.success('Test success');

    expect(service.notifications().length).toBe(1);
    expect(service.notifications()[0].type).toBe('exito');
    expect(service.notifications()[0].message).toBe('Test success');
  });

  it('should remove notification', () => {
    service.success('Test');
    const id = service.notifications()[0].id;

    service.remove(id);

    expect(service.notifications().length).toBe(0);
  });
});
