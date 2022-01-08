import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QrcodedialogboxComponent } from './qrcodedialogbox.component';

describe('QrcodedialogboxComponent', () => {
  let component: QrcodedialogboxComponent;
  let fixture: ComponentFixture<QrcodedialogboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrcodedialogboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrcodedialogboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
