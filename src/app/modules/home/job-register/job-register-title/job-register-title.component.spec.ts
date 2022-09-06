import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobRegisterTitleComponent } from './job-register-title.component';

describe('JobRegisterTitleComponent', () => {
  let component: JobRegisterTitleComponent;
  let fixture: ComponentFixture<JobRegisterTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobRegisterTitleComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobRegisterTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
