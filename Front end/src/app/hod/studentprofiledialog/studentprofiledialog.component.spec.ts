import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentprofiledialogComponent } from './studentprofiledialog.component';

describe('StudentprofiledialogComponent', () => {
  let component: StudentprofiledialogComponent;
  let fixture: ComponentFixture<StudentprofiledialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentprofiledialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentprofiledialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
