import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalModifiRowComponent } from './modal-modifi-row.component';

describe('ModalModifiRowComponent', () => {
  let component: ModalModifiRowComponent;
  let fixture: ComponentFixture<ModalModifiRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalModifiRowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalModifiRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
