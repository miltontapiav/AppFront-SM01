import { TestBed } from '@angular/core/testing';

import { DatosCompartidosService } from './datos-compartidos-service.service';

describe('DatosCompartidosServiceService', () => {
  let service: DatosCompartidosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatosCompartidosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
