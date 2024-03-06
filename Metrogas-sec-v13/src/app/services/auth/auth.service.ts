import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError, BehaviorSubject} from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { catchError, map } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private loginSource = new BehaviorSubject<boolean>(false);
  login$ = this.loginSource.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  login(username: string, password: string): void{

    const onlyNumbersPattern = /^[0-9]+$/;

    if (!onlyNumbersPattern.test(username)) {
      alert('El nombre de usuario o la contraseña deben ser los correctos');
      return;
    }


    const body = `rut=${username}&p=${password}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    this.http.post(`${environment.apiUrllocal}/api/login`,body , { headers: headers }).subscribe(
      (response: any) => {
        if (response) {
          const token = response.token;
          
          localStorage.setItem('token', token);
          //this.loginSource.next(true);
          this.router.navigate(['/filter-table']);
        } else {
          this.mostrarVentanaEmergente('Error en credenciales');          
        }
        /*
        switch (response.codigo) {
          case 200:
            this.mostrarVentanaEmergente('Rut no encontrado');
            break;
          case 201:
            this.mostrarVentanaEmergente('Parámetros erróneos');
            break;
          case 101:
            this.mostrarVentanaEmergente('Error interno (App)');
            break;
          case 100:
            this.mostrarVentanaEmergente('Error interno (BD)');
            break;
          case 0:
            const token = response.token;
            localStorage.setItem('token', token);
            this.loginSource.next(true);
            this.router.navigate(['/filter-table']);
            break;
        
          default:
            break;
        }
        */
      },
      (error) => {
        this.mostrarVentanaEmergente('Error en la solicitud de Login, Ingrese las credenciales necesarias');
        console.error('Error en la solicitud HTTP:', error);
      }
    );
  }

  private mostrarVentanaEmergente(mensaje: string): void {
    const config: MatSnackBarConfig = {
      duration: 5000, // Duración en milisegundos (opcional)
      horizontalPosition: 'center', // Posición horizontal ('start', 'center', 'end')
      verticalPosition: 'top', // Posición vertical ('top', 'bottom')
    };

    this.snackBar.open(mensaje, 'Cerrar', config);
  }

  logout(): void {
    this.router.navigate(['/login']);
    location.reload();
    localStorage.removeItem('timerService.remainingTime');
  }
}
