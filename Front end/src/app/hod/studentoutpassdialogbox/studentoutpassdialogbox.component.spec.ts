import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentoutpassdialogboxComponent } from './studentoutpassdialogbox.component';

describe('StudentoutpassdialogboxComponent', () => {
  let component: StudentoutpassdialogboxComponent;
  let fixture: ComponentFixture<StudentoutpassdialogboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentoutpassdialogboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentoutpassdialogboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
