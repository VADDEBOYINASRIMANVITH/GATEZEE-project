import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewoutpassesComponent } from './viewoutpasses.component';

describe('ViewoutpassesComponent', () => {
  let component: ViewoutpassesComponent;
  let fixture: ComponentFixture<ViewoutpassesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewoutpassesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewoutpassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
