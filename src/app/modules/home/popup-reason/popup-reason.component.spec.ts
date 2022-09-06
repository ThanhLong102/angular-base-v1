import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PopupReasonComponent } from './popup-reason.component';

describe('PopupReasonComponent', () => {
  let component: PopupReasonComponent;
  let fixture: ComponentFixture<PopupReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupReasonComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
