import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestoutpassComponent } from './requestoutpass.component';

describe('RequestoutpassComponent', () => {
  let component: RequestoutpassComponent;
  let fixture: ComponentFixture<RequestoutpassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestoutpassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestoutpassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
