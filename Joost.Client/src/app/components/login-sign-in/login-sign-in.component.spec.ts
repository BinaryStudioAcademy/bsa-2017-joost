import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginSignInComponent } from './login-sign-in.component';

describe('LoginSignInComponent', () => {
  let component: LoginSignInComponent;
  let fixture: ComponentFixture<LoginSignInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginSignInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginSignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
