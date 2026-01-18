import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuscadorFiltros } from './buscador-filtros';

describe('BuscadorFiltros', () => {
  let component: BuscadorFiltros;
  let fixture: ComponentFixture<BuscadorFiltros>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscadorFiltros]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscadorFiltros);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
