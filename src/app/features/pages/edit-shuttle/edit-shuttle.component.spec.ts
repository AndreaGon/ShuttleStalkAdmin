import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditShuttleComponent } from './edit-shuttle.component';

describe('EditShuttleComponent', () => {
  let component: EditShuttleComponent;
  let fixture: ComponentFixture<EditShuttleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditShuttleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditShuttleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
