import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobPublicListComponent } from './job-public-list.component';

describe('JobPublicListComponent', () => {
  let component: JobPublicListComponent;
  let fixture: ComponentFixture<JobPublicListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobPublicListComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobPublicListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
