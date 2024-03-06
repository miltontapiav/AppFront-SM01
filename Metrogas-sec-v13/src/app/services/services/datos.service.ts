import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError, BehaviorSubject, Subject} from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class DatosService {
  private incidentDataSubject: Subject<any> = new Subject<any>();
  incidentData$ = this.incidentDataSubject.asObservable();

  constructor(
    private http: HttpClient    
  ) { }

  getIncidentData(): Observable<any> {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No se encontró un token en el almacenamiento local');
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: token,
    });

    this.http.get(`${environment.apiUrllocal}/api/dashboard`, { headers }).subscribe(
      (response: any) => {

        this.incidentDataSubject.next(response.responseData.instrucciones);

      },
      (error) => {
        console.error('Error en la solicitud del dashboard:', error);
      }
    );
  }

  updateIncidentData(updatedData: any): Observable<any> {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No se encontró un token en el almacenamiento local');
      return new Observable(); // Puedes manejar esto de acuerdo a tus necesidades
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Cambia el tipo de contenido a JSON
      Authorization: token,
    });

    return this.http.put(`${environment.apiUrllocal}/api/modal`, updatedData, { headers });

  }
  
}
