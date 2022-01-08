import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewemployeeoutpassesComponent } from './viewemployeeoutpasses.component';

describe('ViewemployeeoutpassesComponent', () => {
  let component: ViewemployeeoutpassesComponent;
  let fixture: ComponentFixture<ViewemployeeoutpassesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewemployeeoutpassesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewemployeeoutpassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
