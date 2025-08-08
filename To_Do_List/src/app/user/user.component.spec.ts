import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserComponent } from './user.component';

import { By } from '@angular/platform-browser';
import {DUMMY_USERS} from './dummy-users';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserComponent], // standalone component
    }).compileComponents();

    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    component.user = DUMMY_USERS[0];
    component.selected = false;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display the user name and image', () => {
    component.user = DUMMY_USERS[1];
    component.selected = false;
    fixture.detectChanges();

    const imgEl = fixture.debugElement.query(By.css('img')).nativeElement;
    const spanEl = fixture.debugElement.query(By.css('span')).nativeElement;

    expect(imgEl.getAttribute('src')).toContain(component.user.avatar);
    expect(imgEl.getAttribute('alt')).toBe(component.user.name);
    expect(spanEl.textContent).toContain(component.user.name);
  });

  it('should apply "active" class if selected is true', () => {
    component.user = DUMMY_USERS[2];
    component.selected = true;
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.classList).toContain('active');
  });

  it('should emit the user id when clicked', () => {
    component.user = DUMMY_USERS[0];
    component.selected = false;
    spyOn(component.select, 'emit');

    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click');

    expect(component.select.emit).toHaveBeenCalledWith(component.user.id);
  });
});
