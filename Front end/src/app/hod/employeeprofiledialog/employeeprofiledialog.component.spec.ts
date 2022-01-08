import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeprofiledialogComponent } from './employeeprofiledialog.component';

describe('EmployeeprofiledialogComponent', () => {
  let component: EmployeeprofiledialogComponent;
  let fixture: ComponentFixture<EmployeeprofiledialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeprofiledialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeprofiledialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
