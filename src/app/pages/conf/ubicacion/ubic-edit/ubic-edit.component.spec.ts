import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbicEditComponent } from './ubic-edit.component';

describe('UbicEditComponent', () => {
  let component: UbicEditComponent;
  let fixture: ComponentFixture<UbicEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UbicEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UbicEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
