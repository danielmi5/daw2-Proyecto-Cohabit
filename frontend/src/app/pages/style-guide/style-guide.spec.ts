import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StyleGuidePage } from './style-guide';

describe('StyleGuidePage', () => {
  let component: StyleGuidePage;
  let fixture: ComponentFixture<StyleGuidePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StyleGuidePage]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StyleGuidePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
