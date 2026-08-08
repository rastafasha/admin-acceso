import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbicListComponent } from './ubic-list.component';

describe('UbicListComponent', () => {
  let component: UbicListComponent;
  let fixture: ComponentFixture<UbicListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UbicListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UbicListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
