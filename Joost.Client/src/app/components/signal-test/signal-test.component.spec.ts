import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignalTestComponent } from './signal-test.component';

describe('SignalTestComponent', () => {
  let component: SignalTestComponent;
  let fixture: ComponentFixture<SignalTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignalTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignalTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
