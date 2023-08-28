import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShuttleInformationComponent } from './shuttle-information.component';

describe('ShuttleInformationComponent', () => {
  let component: ShuttleInformationComponent;
  let fixture: ComponentFixture<ShuttleInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShuttleInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShuttleInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
