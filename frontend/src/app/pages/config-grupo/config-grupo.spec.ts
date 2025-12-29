import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigGrupo } from './config-grupo';

describe('ConfigGrupo', () => {
  let component: ConfigGrupo;
  let fixture: ComponentFixture<ConfigGrupo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigGrupo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigGrupo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
