import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuUsersComponent } from './menu-users.component';

describe('MenuUsersComponent', () => {
  let component: MenuUsersComponent;
  let fixture: ComponentFixture<MenuUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
