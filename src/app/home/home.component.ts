import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import{ GlobalConstants } from '../global-constants';
import { DatePipe } from '@angular/common'
import {Router} from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  displayedColumns: string[] = ['no_radicado', 'tipo_solicitud', 'date' , 'optionver', 'optionregistry'];
  registrarSol: Boolean;
  asuntDef: Boolean;
  openRespAdmin: Boolean;
  opensolList: Boolean;
  messageFromHTTP;
  resultStatus;
  identificacion;
  myForm: FormGroup;
  resultCom: Boolean;
  Asunto;
  respSol;
  listAsuntos;
  listSolicitudes;
  date;
  constructor(private http: HttpClient, public datepipe: DatePipe, private formBuilder: FormBuilder, private router: Router) { }

  buildForm() {
    this.myForm = this.formBuilder.group({
      tipo_solicitud: [null, [Validators.required]],
      text: [null, [Validators.required]]
    });
  }

  get Text() { return this.myForm.get('text'); }
  getErrorText() {
    return this.Text.hasError('required') ? 'Este campo es requerido' : '';
  }

  ngOnInit(): void {
    this.buildForm();
    this.identificacion = localStorage.getItem('identificacion');
    this.registrarSol= false;
    this.resultCom = false;
    this.asuntDef = false;
    this.opensolList = false;
    this.initData();
  }
  confirmSolList(): void{
    this.opensolList = true;
    this.fechdataList();
    this.openRespAdmin = false;
  }
  volverSolList(): void{
    this.opensolList = false;
    this.asuntDef = true;
  }
  confirmSol(): void{
    this.registrarSol= true;
    this.resultCom = false;
    this.opensolList = false;
    this.date = this.datepipe.transform(Date.now(), 'yyyy-MM-dd hh:mm:ss');
  }
  cancelSol(): void{
    this.opensolList = false;
    this.registrarSol= false;
    this.resultCom = false;
  }
  onSubmit(event) {
    event.preventDefault();
    if (this.myForm.valid) {
      this.sendData();
    }
  }
  registryValidation(calf){
    calf = "NO_SATIFACCION";
    if(calf){
      calf = "SATIFACCION";
    }
    this.respSol.satifaccion = calf;
    this.http.put('http://'+GlobalConstants.backend_server_address+'/Admin/', this.respSol, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'text' as 'json'
    }).subscribe(response => {
      this.messageFromHTTP = JSON.parse(response.toString());
      console.log(this.messageFromHTTP);
      this.resultCom = true;
      this.openRespAdmin = false;
      this.messageFromHTTP = this.respSol.id_response_admin;
      this.resultStatus = "EXITOSO";
    }, err => {
      this.resultCom = true;
      this.openRespAdmin = false;
      this.resultStatus = "FALLIDO";
      this.messageFromHTTP.no_radicado = null;
      console.log(err);
    });
  }
  verResp(object): void {
    if(object != null){
      this.respSol = object;
      this.openRespAdmin = true;
      this.opensolList= false;
    }else{
      alert("No tiene respuesta administrativa");
    }
  }
  sendData(): void{
    let obj =  this.myForm.value;
    obj.date = this.date
    obj.ticketId = this.Asunto.ticket
    this.http.post('http://'+GlobalConstants.backend_server_address+'/Solicitudes/', obj, {
      headers: new HttpHeaders({
        "Access-Control-Allow-Origin": "*",
        'Content-Type': 'application/json',
      }),
      responseType: 'text' as 'json'
    }).subscribe(response => {
      this.messageFromHTTP = JSON.parse(response.toString());
      console.log(this.messageFromHTTP);
      this.registrarSol= false;
      this.resultCom = true;
      this.resultStatus = "EXITOSO";
    }, err => {
      this.resultCom = true;
      this.resultStatus = "FALLIDO";
      this.messageFromHTTP.no_radicado = null;
      console.log(err);
    });
  }
  volverList(): void{
    this.asuntDef = false;
    this.registrarSol= false;
    this.resultCom = false;
    this.initData();
  }
  selectAsunto(Object){
    this.Asunto = Object;
    console.log(this.Asunto);
    this.asuntDef = true;
    this.resultCom = false;
    this.registrarSol= false;
  }
  fechdataList(): void{
    let url = 'http://'+GlobalConstants.backend_server_address+'/Solicitudes/'+this.Asunto.ticket+'/';
    this.http.get(url,{
      responseType: 'text' as 'json'
    }).subscribe(response => {
      this.listSolicitudes = JSON.parse(response.toString());
    }, err => {
      console.log(err);
    });
  }
  initData(): void{
    let url = 'http://'+GlobalConstants.backend_server_address+'/Ticket/'+this.identificacion+'/';
    this.http.get(url,{
      responseType: 'text' as 'json'
    }).subscribe(response => {
      this.listAsuntos = JSON.parse(response.toString());
    }, err => {
      console.log(err);
    });
  }
}
