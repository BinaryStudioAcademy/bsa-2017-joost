import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAddContactComponent } from './user-add-contact.component';

describe('UserAddContactComponent', () => {
  let component: UserAddContactComponent;
  let fixture: ComponentFixture<UserAddContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAddContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAddContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
