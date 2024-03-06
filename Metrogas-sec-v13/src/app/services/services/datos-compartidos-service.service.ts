import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DatosCompartidosService {
  private datosFiltradosSource = new BehaviorSubject<any>(null);
  datosFiltrados$ = this.datosFiltradosSource.asObservable();

  private selectedIncidentSource = new BehaviorSubject<any>(null);
  selectedIncidentSource$ = this.selectedIncidentSource.asObservable();

  actualizarDatosFiltrados(datos: any): void {
    this.datosFiltradosSource.next(datos);
  }

  changeIncident(incident: any): void {
    this.selectedIncidentSource.next(incident);
  }
}
