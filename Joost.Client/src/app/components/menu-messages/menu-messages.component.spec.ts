import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuMessagesComponent } from './menu-messages.component';

describe('MenuMessagesComponent', () => {
  let component: MenuMessagesComponent;
  let fixture: ComponentFixture<MenuMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
