import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewstudentoutpassesComponent } from './viewstudentoutpasses.component';

describe('ViewstudentoutpassesComponent', () => {
  let component: ViewstudentoutpassesComponent;
  let fixture: ComponentFixture<ViewstudentoutpassesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewstudentoutpassesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewstudentoutpassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
