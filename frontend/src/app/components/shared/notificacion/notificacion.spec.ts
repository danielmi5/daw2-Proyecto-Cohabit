import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Notificacion } from './notificacion';
import { NotificacionService } from '../../../services/notificacion.service';

describe('Notificacion', () => {
  let component: Notificacion;
  let fixture: ComponentFixture<Notificacion>;
  let notificacionService: NotificacionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Notificacion],
      providers: [provideAnimations()]
    }).compileComponents();

    fixture = TestBed.createComponent(Notificacion);
    component = fixture.componentInstance;
    notificacionService = TestBed.inject(NotificacionService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display notification', () => {
    notificacionService.success('Test message');
    fixture.detectChanges();

    expect(notificacionService.notifications().length).toBe(1);
    expect(notificacionService.notifications()[0].message).toBe('Test message');
  });
});
