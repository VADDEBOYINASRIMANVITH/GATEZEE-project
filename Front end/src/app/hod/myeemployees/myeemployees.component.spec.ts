import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyeemployeesComponent } from './myeemployees.component';

describe('MyeemployeesComponent', () => {
  let component: MyeemployeesComponent;
  let fixture: ComponentFixture<MyeemployeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyeemployeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyeemployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
