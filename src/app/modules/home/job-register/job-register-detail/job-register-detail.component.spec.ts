import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobRegisterDetailComponent } from './job-register-detail.component';

describe('JobRegisterDetailComponent', () => {
  let component: JobRegisterDetailComponent;
  let fixture: ComponentFixture<JobRegisterDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobRegisterDetailComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobRegisterDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
