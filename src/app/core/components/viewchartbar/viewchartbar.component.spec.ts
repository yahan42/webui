import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewChartBarComponent } from './viewchartbar.component';

describe('ViewchartgaugeComponent', () => {
  let component: ViewChartBarComponent;
  let fixture: ComponentFixture<ViewChartBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewChartBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewChartBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
