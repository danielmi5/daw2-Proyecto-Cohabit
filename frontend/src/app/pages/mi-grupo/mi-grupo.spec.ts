import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiGrupo } from './mi-grupo';

describe('MiGrupo', () => {
  let component: MiGrupo;
  let fixture: ComponentFixture<MiGrupo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiGrupo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiGrupo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
