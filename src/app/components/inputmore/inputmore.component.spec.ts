import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputmoreComponent } from './inputmore.component';

describe('InputmoreComponent', () => {
  let component: InputmoreComponent;
  let fixture: ComponentFixture<InputmoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputmoreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputmoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
