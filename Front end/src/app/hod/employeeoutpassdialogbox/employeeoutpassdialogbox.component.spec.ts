import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeoutpassdialogboxComponent } from './employeeoutpassdialogbox.component';

describe('EmployeeoutpassdialogboxComponent', () => {
  let component: EmployeeoutpassdialogboxComponent;
  let fixture: ComponentFixture<EmployeeoutpassdialogboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeoutpassdialogboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeoutpassdialogboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
