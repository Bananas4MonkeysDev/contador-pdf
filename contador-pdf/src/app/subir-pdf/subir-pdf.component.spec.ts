import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubirPdfComponent } from './subir-pdf.component';

describe('SubirPdfComponent', () => {
  let component: SubirPdfComponent;
  let fixture: ComponentFixture<SubirPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubirPdfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubirPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
