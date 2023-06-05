import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterShuttleComponent } from './register-shuttle.component';

describe('RegisterShuttleComponent', () => {
  let component: RegisterShuttleComponent;
  let fixture: ComponentFixture<RegisterShuttleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterShuttleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterShuttleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
