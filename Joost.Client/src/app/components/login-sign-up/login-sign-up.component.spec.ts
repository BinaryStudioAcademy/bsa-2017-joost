import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginSignUpComponent } from './login-sign-up.component';

describe('LoginSignUpComponent', () => {
  let component: LoginSignUpComponent;
  let fixture: ComponentFixture<LoginSignUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginSignUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginSignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
