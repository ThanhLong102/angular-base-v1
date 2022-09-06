import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListJobRegisterComponent } from './list-job-register.component';

describe('ListJobRegisterComponent', () => {
  let component: ListJobRegisterComponent;
  let fixture: ComponentFixture<ListJobRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListJobRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListJobRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
