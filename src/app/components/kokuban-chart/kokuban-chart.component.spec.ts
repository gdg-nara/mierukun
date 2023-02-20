import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KokubanChartComponent } from './kokuban-chart.component';

describe('KokubanChartComponent', () => {
  let component: KokubanChartComponent;
  let fixture: ComponentFixture<KokubanChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KokubanChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KokubanChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
