import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutpassdialogboxComponent } from './outpassdialogbox.component';

describe('OutpassdialogboxComponent', () => {
  let component: OutpassdialogboxComponent;
  let fixture: ComponentFixture<OutpassdialogboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutpassdialogboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutpassdialogboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
