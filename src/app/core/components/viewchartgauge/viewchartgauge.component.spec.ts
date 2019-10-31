import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewChartGaugeComponent } from './viewchartgauge.component';

describe('ViewchartgaugeComponent', () => {
  let component: ViewChartGaugeComponent;
  let fixture: ComponentFixture<ViewChartGaugeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewChartGaugeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewChartGaugeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
