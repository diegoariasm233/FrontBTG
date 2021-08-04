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

  displayedColumns: string[] = ['no_radicado', 'tipo_solicitud','text', 'date' , 'optionver', 'optionregistry'];
  registrarSol: Boolean;
  asuntDef: Boolean;
  openRespAdmin: Boolean;
  opensolList: Boolean;
  createReclamos: Boolean;
  createAsu: Boolean;
  messageFromHTTP;
  resultStatus;
  identificacion;
  myForm: FormGroup;
  myFormAsu: FormGroup;
  myFormReclamo: FormGroup;
  resultCom: Boolean;
  Asunto;
  respSol;
  listAsuntos;
  listSolicitudes;
  date;
  noRadicadoassoc;
  constructor(private http: HttpClient, public datepipe: DatePipe, private formBuilder: FormBuilder, private router: Router) { }

  buildForm() {
    this.myForm = this.formBuilder.group({
      tipo_solicitud: [null, [Validators.required]],
      text: [null, [Validators.required]]
    });
    this.myFormAsu = this.formBuilder.group({
      asunto: [null, [Validators.required]]
    });
  }

  get asunto() { return this.myFormAsu.get('asunto'); }
  getErrorAsunto() {
    return this.asunto.hasError('required') ? 'Este campo es requerido' : '';
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
    this.createReclamos = false;
    this.opensolList = false;
    this.createAsu =false;
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
  createAsunto(){
    this.asuntDef = false;
    this.registrarSol= false;
    this.resultCom = false;
    this.createAsu = true;
  }
  onSubmitReclamo(event){
    event.preventDefault();
    if (this.myForm.valid) {
      this.sendData(true);
    }
  }
  onSubmit(event) {
    event.preventDefault();
    if (this.myForm.valid) {
      this.sendData(false);
    }
  }
  cancelAsun(){
    this.createAsu = false;
  }
  onSubmitAsun(event){
    event.preventDefault();
    if (this.myFormAsu.valid) {
      let obj = {
        identificacion : this.identificacion,
        asunto: this.myFormAsu.value.asunto
      }
      this.http.post('http://'+GlobalConstants.backend_server_address+'/Ticket/',obj, {
        headers: new HttpHeaders({
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        }),
        responseType: 'text' as 'json'
      }).subscribe(response => {
       
        this.initData();
        this.cancelAsun();
      }, err => { 
        console.log(err);
      });
    }
  }
  closeCreateReclamos(){
    this.opensolList = true;
    this.createReclamos = false;
    this.fechdataList();
  }
  createReclamo(elementId){
    this.createReclamos = true;
    this.date = this.datepipe.transform(Date.now(), 'yyyy-MM-dd hh:mm:ss');
    this.opensolList = false;
    this.noRadicadoassoc = elementId;
  }
  registryValidation(calf){
    let variable  = "NO_SATIFACCION";
    if(calf){
      variable = "SATIFACCION";
    }
    this.respSol.satifaccion = variable;
    this.http.post('http://'+GlobalConstants.backend_server_address+'/Admin/Update', this.respSol, {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      }),
      responseType: 'text' as 'json'
    }).subscribe(response => {
      this.messageFromHTTP = JSON.parse(response.toString());
      console.log(this.messageFromHTTP);
        this.resultCom = true;
        this.openRespAdmin = false;
        this.messageFromHTTP = this.respSol.idresponseadmin;
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
  sendData(value): void{
    let obj =  this.myForm.value;
    obj.date = this.date
    obj.ticketId = this.Asunto.ticket
    if(value){
      obj.no_radicado_assoc = this.noRadicadoassoc;
    }
    this.http.post('http://'+GlobalConstants.backend_server_address+'/Solicitudes/', obj, {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      }),
      responseType: 'text' as 'json'
    }).subscribe(response => {
      this.messageFromHTTP = JSON.parse(response.toString());
      console.log(this.messageFromHTTP);
      if(this.messageFromHTTP.no_radicado != null){
        this.registrarSol= false;
        this.resultCom = true;
        this.createReclamos = false;
        this.resultStatus = "EXITOSO";
        this.myForm.reset();
      }else{
        if(value){
          alert("Por favor si no existe respuesta de la Administracion, Espere 5 dias para poder enviar su Reclamo")
        }
      }
      
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
