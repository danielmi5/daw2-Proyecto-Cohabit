import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Grupo } from './grupo';

describe('Grupo', () => {
  let component: Grupo;
  let fixture: ComponentFixture<Grupo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Grupo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Grupo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
