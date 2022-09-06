import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangePasswordFinishComponent } from './change-password-finish.component';

describe('ChangePasswordFinishComponent', () => {
  let component: ChangePasswordFinishComponent;
  let fixture: ComponentFixture<ChangePasswordFinishComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangePasswordFinishComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordFinishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
