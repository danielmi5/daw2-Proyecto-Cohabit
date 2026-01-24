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

    expect(service.notificaciones().length).toBe(1);
    expect(service.notificaciones()[0].type).toBe('exito');
    expect(service.notificaciones()[0].mensaje).toBe('Test success');
  });

  it('should add error notification', () => {
    service.error('Test error');

    expect(service.notificaciones().length).toBe(1);
    expect(service.notificaciones()[0].type).toBe('error');
    expect(service.notificaciones()[0].mensaje).toBe('Test error');
  });

  it('should add warning notification', () => {
    service.warning('Test warning');

    expect(service.notificaciones().length).toBe(1);
    expect(service.notificaciones()[0].type).toBe('warning');
  });

  it('should add info notification', () => {
    service.info('Test info');

    expect(service.notificaciones().length).toBe(1);
    expect(service.notificaciones()[0].type).toBe('info');
  });

  it('should remove notification', () => {
    service.success('Test');
    const id = service.notificaciones()[0].id;

    service.eliminar(id);

    expect(service.notificaciones().length).toBe(0);
  });

  it('should not add duplicate notifications', () => {
    service.success('Test');
    service.success('Test');

    expect(service.notificaciones().length).toBe(1);
  });

  it('should replace notification of same type with different message', () => {
    service.success('First message');
    service.success('Second message');

    expect(service.notificaciones().length).toBe(1);
    expect(service.notificaciones()[0].mensaje).toBe('Second message');
  });
});

