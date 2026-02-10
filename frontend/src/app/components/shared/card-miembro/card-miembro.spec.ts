import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardMiembro } from './card-miembro';

describe('CardMiembro', () => {
  let component: CardMiembro;
  let fixture: ComponentFixture<CardMiembro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardMiembro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardMiembro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
