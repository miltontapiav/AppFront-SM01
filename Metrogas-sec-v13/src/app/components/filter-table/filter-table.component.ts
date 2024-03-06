import { Component, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { NgForOf, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { DatosCompartidosService } from 'src/app/services/services/datos-compartidos-service.service';
import { TimerService } from 'src/app/services/services/timer.service';
import { Subscription } from 'rxjs';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-filter-table',
  //standalone: true,
  //imports: [ NgIf, NgFor ],
  templateUrl: './filter-table.component.html',
  styleUrls: ['./filter-table.component.scss']
})
export class FilterTableComponent implements OnInit {

  incidentData: any[] = [];
  estadoCumplimiento: string = '';
  fechaInicioCumplimiento: string = '';
  fechaFinalCumplimiento: string = '';
  idReferencia: string = '';
  userLoginOn:boolean=false;

  filteredData: any[] = [];
  idIncidente: number | null = null;
  tiempoTranscurrido: number = 0;
  formattedCountdown: string = '00:00';
  private formattedCountdownSubscription: Subscription;
  tiempoRecibido: number = 0;


  @Output() datosParaDashboardEvent: EventEmitter<any> = new EventEmitter<any>();

  Modelo: any = {
    nroCliente: '',
    estado: ''
  };

  estadoOptions = [
    { value: '00', label: '00.- No Aplica' },
    { value: '01', label: '01.- Cumplida' },
    { value: '02', label: '02.- Pendiente' },
    { value: '03', label: '03.- Cumplimiento Programado' },
    { value: '04', label: '04.- Recurso reposición' },
    { value: '05', label: '05.- No Permite' },
    { value: '06', label: '06.- Trámite judicial' },
    { value: '07', label: '07.- Pendiente y fuera de plazo' },
    { value: '08', label: '08.- Cerrada' },
    { value: '99', label: '99.- Todos los estados' },
    { value: '', label: '02 y 07.- Todo lo pendiente' },
  ];

  constructor(
    private router: Router,
    private datosCompartidosService: DatosCompartidosService,
    private timerService: TimerService,
    private snackBar: MatSnackBar,
    public AuthService: AuthService,
    private cdr: ChangeDetectorRef

  ) {
    this.formattedCountdownSubscription = this.timerService.formattedCountdown$.subscribe(
      (formattedCountdown) => {
        this.formattedCountdown = formattedCountdown;
      }
    );

    window.addEventListener('popstate', () => {
      this.reloadPage()
    });
  }

  ngOnInit(): void {
    this.timerService.setTimer(300);

    this.timerService.countdown$.subscribe(
      (remainingTime) => {
        this.formattedCountdown = this.formatTime(remainingTime);
      }
    );
  }

  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = ('0' + minutes).slice(-2);
    const formattedSeconds = ('0' + remainingSeconds).slice(-2);

    return `${formattedMinutes}:${formattedSeconds}`;
  }

  onChangeEstado(): void {
    console.log('Nuevo valor de Estado Cumplimiento:', this.Modelo.estado);
  }

  enviarDatosAlDashboard(fechaInicio: string, fechaFin: string, nroCliente: string): void {
    if (this.Modelo.estado !== '' || fechaInicio !== '' || fechaFin !== '' || nroCliente !== '') {
      const datosFiltrados = {
        estado:  this.Modelo.estado,
        fechaIni: fechaInicio,
        fechaFin: fechaFin,
        nroCliente: nroCliente,
      };

      this.datosCompartidosService.actualizarDatosFiltrados(datosFiltrados);
      this.router.navigate(['/dashboard']);
    } else {
      const confirmacion = confirm('No ha seleccionado ningún filtro, por defecto se selecciona estados 02 y 07, desea continuar de todos modos?');
      if (confirmacion) {
        this.router.navigate(['/dashboard']);
      } else {
        console.log('Operación cancelada por el usuario.');
      }
    }
  }

  showAlert(inputField): void {
    if (inputField.errors?.pattern) {
        const fieldName = inputField.name === 'nroCliente' ? 'Número de Cliente' : 'Estado Cumplimiento';
        alert(`Ingresa solo valores permitidos para ${fieldName}.`);
    }

    const estadoValue: string = this.Modelo.estado;

    if (estadoValue && !/^(00|01|02|03|04|05|06|07|08|99)$/.test(estadoValue)) {
        alert('Ingresa un valor permitido para Estado Cumplimiento.');
    }
}

  reloadPage(): void {
    location.reload();
  }

  logout(): void {
    this.AuthService.logout();
  }
}
