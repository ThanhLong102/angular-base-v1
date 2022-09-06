import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobRegisterListComponent } from './job-register-list.component';

describe('JobRegisterListComponent', () => {
  let component: JobRegisterListComponent;
  let fixture: ComponentFixture<JobRegisterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobRegisterListComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobRegisterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
