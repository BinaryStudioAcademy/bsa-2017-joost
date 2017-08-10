import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuSettingsComponent } from './menu-settings.component';

describe('MenuSettingsComponent', () => {
  let component: MenuSettingsComponent;
  let fixture: ComponentFixture<MenuSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
