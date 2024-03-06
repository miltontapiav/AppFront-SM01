import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { TimerService } from 'src/app/services/services/timer.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  Modelo: any = {
    username: '',
  };


  constructor(
    public AuthService: AuthService,
    private timerService: TimerService
  ) { 
    window.addEventListener('popstate', () => {
      this.reloadPage()
    });
  }

  ngOnInit(): void {
    localStorage.removeItem('timerService.remainingTime');
    localStorage.removeItem('token');
  }

  showAlert(inputField): void {
    if (inputField.errors?.pattern) {
        const fieldName = inputField.name === 'Usuario';
        alert(`El nombre de usuario debe ser el RUT de la empresa.`);
    }
  }

  reloadPage(): void {
    location.reload();
  }
}
