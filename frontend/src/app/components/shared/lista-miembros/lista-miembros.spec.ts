import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaMiembros } from './lista-miembros';

describe('ListaMiembros', () => {
  let component: ListaMiembros;
  let fixture: ComponentFixture<ListaMiembros>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaMiembros]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaMiembros);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
