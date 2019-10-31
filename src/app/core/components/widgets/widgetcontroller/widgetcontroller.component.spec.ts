import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetControllerComponent } from './widgetcontroller.component';

describe('WidgetcontrollerComponent', () => {
  let component: WidgetControllerComponent;
  let fixture: ComponentFixture<WidgetControllerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetControllerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
