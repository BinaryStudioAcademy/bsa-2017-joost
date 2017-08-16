import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEditingComponent } from './user-editing.component';

describe('UserEditingComponent', () => {
  let component: UserEditingComponent;
  let fixture: ComponentFixture<UserEditingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserEditingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserEditingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
