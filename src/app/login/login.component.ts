import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  myForm: FormGroup;
  
  constructor(private formBuilder: FormBuilder, private router: Router) { }


  ngOnInit() {  
    this.buildForm();
  }

  buildForm() {
    this.myForm = this.formBuilder.group({
      identificacion: [null, [Validators.required]]
    });
  }
  get Identificacion() { return this.myForm.get('identificacion'); }
  getErrorIdentificacion() {
    return this.Identificacion.hasError('required') ? 'Este campo es requerido' : '';
  }
  onSubmit(event) {
    event.preventDefault();
    if (this.myForm.valid) {
      this.login();
    }
  }

  login() : void {
    localStorage.setItem('identificacion', this.myForm.value.identificacion);
    this.router.navigate(['/RQSystem']);
  }
}

