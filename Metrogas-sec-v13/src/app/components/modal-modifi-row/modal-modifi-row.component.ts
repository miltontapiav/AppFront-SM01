import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { DatosCompartidosService } from 'src/app/services/services/datos-compartidos-service.service';
import { DatosService } from 'src/app/services/services/datos.service';
import { TimerService } from 'src/app/services/services/timer.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { saveAs } from 'file-saver';
import { AuthService } from 'src/app/services/auth/auth.service';


@Component({
  selector: 'app-modal-modifi-row',
  templateUrl: './modal-modifi-row.component.html',
  styleUrls: ['./modal-modifi-row.component.scss']
})
export class ModalModifiRowComponent implements OnInit {

  incident: any[] = [];
  isLargeModal: boolean = false;
  idIncidenteHeader: string = '';
  formIncident: FormGroup;
  formattedCountdown: string;
  tiempoRecibido: number = 0;
  private closeModalSubscription: Subscription;

  incidentHeaders: string[] = [
    'ID Incidente', 'ID Referencia', 'ID Caso Times', 'ID Empresa',
    'ID Reclamo Empresa', 'Nro Cliente', 'codigo Estado DX *', 'Fecha hora registro',
    'Fecha Recurso Reposicion', 'Fecha Cumplimiento', 'Tipo Cumplimiento DX *',
    'Monto re-facturado', 'Mensaje DX *',
    'Nro Documento *', 'Tipo Documento *', 'Fecha Documento', 'Monto Documento',
  ];
  
  incidentKeys: string[] = [
    'idIncidente', 'idReferencia', 'idCasoTimes', 'idEmpresa',
    'idReclamoEmpresa', 'nroCliente', 'codigoEstadoDX', 'fechaHoraRegistro',
    'fechaRecursoReposicion', 'fechaCumplimiento', 'tipoCumplimientoDX', 
    'montoRefacturado', 'mensajeDX',
    'nroDocumento', 'tipoDocumento', 'fechaDocumento', 'montoDocumento',
  ];

  Modelo: any = {
    nroCliente: '',
    estado: '',
    tipoCumplimiento: '',
    tipoDocu: ''
  };

  codigoEstadoOptions = [
    { value: '00', label: '00.- No Aplica' },
    { value: '01', label: '01.- Cumplida' },
    { value: '02', label: '02.- Pendiente' },
    { value: '03', label: '03.- Cumplimiento Programado' },
    { value: '04', label: '04.- Recurso reposición' },
    { value: '05', label: '05.- No Permite' },
    { value: '06', label: '06.- Trámite judicial' },
    { value: '07', label: '07.- Pendiente y fuera de plazo' },
    { value: '08', label: '08.- Cerrada' },
  ];

  tipoCumplimientoOptions = [
    { value: '00', label: '00.- No Aplica' },
    { value: '01', label: '01.- Refacturación(reliquidación)' },
    { value: '02', label: '02.- Normalisación' },
    { value: '03', label: '03.- Inspección' },
    { value: '04', label: '04.- Verificación' },
    { value: '05', label: '05.- Otros' },
  ];

  tipoDocuOptions = [
    { value: '00', label: '00.- No Aplica' },
    { value: '01', label: '01.- Nota de crédito' },
    { value: '02', label: '02.- Boleta' },
    { value: '03', label: '03.- Factura' },
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModalModifiRowComponent>,
    private datosCompartidosService: DatosCompartidosService,
    private datosService: DatosService,
    private timerService: TimerService,
    private snackBar: MatSnackBar,
    private router: Router,
    public AuthService: AuthService,


    ) {
    this.formIncident = this.fb.group({
      idIncidente: [''],
      idReferencia: [''],
      idCasoTimes: [''],
      idEmpresa: [''],
      idReclamoEmpresa: ['', Validators.compose([Validators.required, Validators.maxLength(20)])], // 1
      nroCliente: ['', Validators.compose([Validators.required, Validators.maxLength(12), Validators.pattern(/^\d{1,12}$/)])], // 2
      codigoEstadoDX: ['', Validators.compose([Validators.required, Validators.pattern(/^\d{2}$/)])], // 3
      fechaHoraRegistro: ['', Validators.required], // 4
      fechaRecursoReposicion: [''], // 5
      fechaCumplimiento: [''], // 6
      tipoCumplimientoDX: ['', Validators.compose([Validators.required, Validators.pattern(/^\d{1,2}(\.\d{2})?$/)])], // 7
      montoRefacturado: ['', Validators.compose([Validators.pattern(/^\d+(\.\d{1,2})?$/)])], // 11
      mensajeDX: ['', Validators.required], // 12
      documentos: this.fb.array([
        this.fb.group({
          nroDocumento: ['', Validators.compose([Validators.required, Validators.pattern(/^\d{10}$/)])], // 8
          tipoDocumento: ['', Validators.compose([Validators.required, Validators.pattern(/^\d{2}$/)])], // 10
          fechaDocumento: [''],
          montoDocumento: ['', Validators.compose([Validators.pattern(/^\d+(\.\d{1,2})?$/)])], // 9
        })
      ])
    });
  }


  ngOnInit(): void {
    this.timerService.countdown$.subscribe((remainingTime) => {
      this.tiempoRecibido = remainingTime;
      if (remainingTime <= 1) {
        this.mostrarVentanaEmergente('Sesión terminada, volviendo al login');
        this.dialogRef.close();
        this.router.navigate(['/login']);
      }
    });

    this.timerService.countdown$.subscribe((tiempo) => {
      this.tiempoRecibido = tiempo;
    });

    this.timerService.formattedCountdown$.subscribe(
      (formattedCountdown) => {
        this.formattedCountdown = formattedCountdown;
      }
    );

    this.incidentKeys.forEach((key) => {
      if (key === 'urlPDF' || key === 'urlXML') {
        return;
      }

      const control = this.isDateField(key)
        ? new FormControl(new Date(this.incident[key]))
        : new FormControl(this.incident[key]);

      this.formIncident.addControl(key, control);
    });

    this.datosCompartidosService.selectedIncidentSource$.subscribe((datos) => {
      this.incident = datos
      this.idIncidenteHeader = datos.idIncidente;

      this.initializeFormControls();
    
    });
  }

  getOptionsByKey(key: string): any[] {
    switch (key) {
      case 'codigoEstadoDX':
        return this.codigoEstadoOptions;
      case 'tipoCumplimientoDX':
        return this.tipoCumplimientoOptions;
      case 'tipoDocumento':
        return this.tipoDocuOptions;
      default:
        return [];
    }
  }

  getSelectedOptionValue(key: string): any {
    const control = this.formIncident.get(key);
    if (control && control.value) {
      return control.value;
    }
    return null;
  }

  isComboBoxField(key: string): boolean {
    return key === 'codigoEstadoDX' || key === 'tipoCumplimientoDX' || key === 'tipoDocumento';
  }
  

  getPattern(key: string): RegExp | null {
    switch (key) {
      case 'codigoEstadoDX':
        return /^\d{2}$/; // 3
      case 'nroCliente':
        return /^\d{1,12}$/; // 2
      case 'tipoCumplimientoDX':
        return /^\d{1,2}(\.\d{2})?$/; // 7
      case 'montoRefacturado':
        return /^\d+(\.\d{1,2})?$/; // 11
      case 'nroDocumento':
        return /^\d{1,10}$/; // 8
      case 'tipoDocumento':
        return /^\d{1,2}$/; // 10
      case 'idReclamoEmpresa':
        return /^\d{1,20}$/; // 1
      default:
        return null;
    }
  }

  isRequiredField(key: string): boolean {
    return this.formIncident.get(key)?.hasError('required') || false;
  }
  
  camposObligatoriosCompletados(): boolean {
    const codigoEstadoDX = this.formIncident.get('codigoEstadoDX').value;
    const tipoCumplimientoDX = this.formIncident.get('tipoCumplimientoDX').value;
    const mensajeDX = this.formIncident.get('mensajeDX').value;
    const nroDocumento = this.formIncident.get('nroDocumento').value;
    const tipoDocumento = this.formIncident.get('tipoDocumento').value;
    
    const camposCompletos = codigoEstadoDX && tipoCumplimientoDX && mensajeDX && nroDocumento && tipoDocumento;  
    return camposCompletos;
  }

  isReadOnly(key: string): boolean {
    const readOnlyFields = ['idIncidente', 'idReferencia', 'idCasoTimes', 'idEmpresa', 'fechaHoraRegistro' ];
    return readOnlyFields.includes(key);
  }

  isDateField(key: string): boolean {
    return key === 'fechaCumplimiento' || key === 'fechaRecursoReposicion' || key === 'fechaDocumento';
  }
  
  private initializeFormControls(): void {
    Object.keys(this.formIncident.controls).forEach((control) => {
      this.formIncident.removeControl(control);
    });

    this.incidentKeys.forEach((key) => {
      if (key === 'urlPDF' || key === 'urlXML') {
        return;
      }

      this.formIncident.addControl(key, this.fb.control(this.incident[key]));
    });
  }

  private updateFechaHoraRegistro(): void {
    const currentDate = new Date();
    const formattedDate = this.formatDate(currentDate);
    this.formIncident.get('fechaHoraRegistro')?.setValue(formattedDate);
  }

  private formatDate(date: Date): string {
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }


  guardarCambios(row: any): void {
    this.updateFechaHoraRegistro();

    const updatedData = this.formIncident.value;
  
    const fechaRecursoReposicionDate = new Date(updatedData.fechaRecursoReposicion);
    const fechaCumplimientoDate = new Date(updatedData.fechaCumplimiento);
    const fechaDocumentoDate = new Date(updatedData.fechaDocumento);

    const opcionesFormato: Intl.DateTimeFormatOptions = {
      timeZone: 'America/Santiago',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    };

    fechaRecursoReposicionDate.setDate(fechaRecursoReposicionDate.getDate() + 1);
    fechaCumplimientoDate.setDate(fechaCumplimientoDate.getDate() + 1);
    fechaDocumentoDate.setDate(fechaDocumentoDate.getDate() + 1);

    const fechaFormateadafechaRecursoReposicionDate = fechaRecursoReposicionDate.toLocaleDateString('es-CL', opcionesFormato).replace(/-/g, '/');
    const fechaFormateadafechaCumplimientoDate = fechaCumplimientoDate.toLocaleDateString('es-CL', opcionesFormato).replace(/-/g, '/');
    const fechaFormateadafechaDocumentoDate = fechaDocumentoDate.toLocaleDateString('es-CL', opcionesFormato).replace(/-/g, '/');
    
    const formattedData = {
      idIncidente: updatedData.idIncidente || 0,
      idReferencia: updatedData.idReferencia || "",
      idCasoTimes: updatedData.idCasoTimes || 0,
      idEmpresa: updatedData.idEmpresa || 0,
      idReclamoEmpresa: updatedData.idReclamoEmpresa || "",
      nroCliente: updatedData.nroCliente || "",
      codigoEstadoDX: this.getSelectedOptionValue('codigoEstadoDX') || "",
      fechaHoraRegistro: updatedData.fechaHoraRegistro || "",
      fechaRecursoReposicion: fechaFormateadafechaRecursoReposicionDate || '',
      fechaCumplimiento: fechaFormateadafechaCumplimientoDate || '',
      tipoCumplimientoDX: this.getSelectedOptionValue('tipoCumplimientoDX') || "",
      montoRefacturado: updatedData.montoRefacturado || 0.0,
      mensajeDX: updatedData.mensajeDX || "",
      documentos:[ {
        nroDocumento: updatedData.nroDocumento || "",
        tipoDocumento:  this.getSelectedOptionValue('tipoDocumento') || "",
        fechaDocumento: fechaFormateadafechaDocumentoDate || '',
        montoDocumento: updatedData.montoDocumento || 0.0,
      }]
    };

    this.datosService.updateIncidentData(formattedData).subscribe(
      (response) => {
          const codigoMensajeMap = {
            400: 'ID incidente no válido',
            401: 'Caso Times no válido',
            402: 'Información de Empresa no concuerda con la del token',
            403: 'Token inválido, vuelva al login',
            404: 'Fecha de cumplimiento o programada con formato erróneo',
            405: 'Fecha de registro con formato erróneo',
            406: 'Fecha recurso de reposición con formato erróneo',
            407: 'Tipo de cumplimiento no válido o vacío',
            408: 'ID de Referencia SEC no válido',
            409: 'Fecha de cumplimiento o programada no informada',
            410: 'Fecha de registro no informada',
            411: 'Número de documento no informado',
            412: 'Tipo de documento no informado',
            413: 'Fecha de documento con formato erróneo',
            414: 'Monto de documento no informado',
            415: 'No existe una instrucción pendiente asociada',
            416: 'Error de envío, verifique los valores nuevamente',
            101: 'Error interno (App)',
            100: 'Error interno (BD)',
            0: 'Datos actualizados con éxito',
          };
        
          const codigo = response.responseData.codigo;
          const mensaje = codigoMensajeMap[codigo] || 'Error no manejado';
        
          this.mostrarVentanaEmergente(mensaje);
        
          if (codigo === 402 || codigo === 403) {
            this.router.navigate(['/login']);
          }

          if (codigo === 0) {
            const textoExportado = this.exportarAFormatoTxt(formattedData);
            const blob = new Blob([textoExportado], { type: 'text/plain;charset=utf-8' });
            saveAs(blob, 'datos_exportados.txt');
          }
        
          this.dialogRef.close(response);

      },
      (error) => {
        console.error('Error al actualizar datos:', error);
        this.mostrarVentanaEmergente('Error al actualizar datos');
      }
    );
  }

  exportarAFormatoTxt(formattedData: any): string {
    const textoExportado = `
      ID Incidente: ${formattedData.idIncidente}
      ID Referencia: ${formattedData.idReferencia}
      ID Caso Times: ${formattedData.idCasoTimes}
      ID Empresa: ${formattedData.idEmpresa}
      ID Reclamo Empresa: ${formattedData.idReclamoEmpresa}
      Nro Cliente: ${formattedData.nroCliente}
      Código Estado DX: ${formattedData.codigoEstadoDX}
      Fecha y Hora de Registro: ${formattedData.fechaHoraRegistro}
      Fecha Recurso Reposición: ${formattedData.fechaRecursoReposicion}
      Fecha Cumplimiento: ${formattedData.fechaCumplimiento}
      Tipo Cumplimiento DX: ${formattedData.tipoCumplimientoDX}
      Monto Refacturado: ${formattedData.montoRefacturado}
      Mensaje DX: ${formattedData.mensajeDX}
      Nro Documento: ${formattedData.documentos[0].nroDocumento}
      Tipo Documento: ${formattedData.documentos[0].tipoDocumento}
      Fecha Documento: ${formattedData.documentos[0].fechaDocumento}
      Monto Documento: ${formattedData.documentos[0].montoDocumento}
    `;
  
    return textoExportado;
  }

  private mostrarVentanaEmergente(mensaje: string): void {
    const config: MatSnackBarConfig = {
      duration: 4000, // Duración en milisegundos (opcional)
      horizontalPosition: 'center', // Posición horizontal ('start', 'center', 'end')
      verticalPosition: 'top', // Posición vertical ('top', 'bottom')
    };

    this.snackBar.open(mensaje, 'Cerrar', config);
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  logout(): void {
    this.AuthService.logout();
    localStorage.removeItem('timerService.remainingTime');
  }
}

