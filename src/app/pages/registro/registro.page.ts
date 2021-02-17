import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { User } from 'src/app/model/User';
import { ApiUserService } from 'src/app/services/api-user.service';
import jsSHA from 'jssha';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  public tasks: FormGroup;

  passwordTypeInput = 'password';

  constructor(private formBuilder: FormBuilder, 
    private userService:ApiUserService, 
    private modalController:ModalController) { 

    this.tasks = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('[^0-9]+')]],
      surnames: ['', [Validators.required, Validators.pattern('[^0-9]+')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'), Validators.minLength(6)]]
    })

  }

  ngOnInit() {
  }

  togglePasswordMode() {
    this.passwordTypeInput = this.passwordTypeInput === 'text' ? 'password' : 'text';
  }

  public register(){
    let name = this.tasks.get("name").value;
    let surnames = this.tasks.get("surnames").value;
    let email = this.tasks.get("email").value;
    let password = this.tasks.get("password").value;

    let shaObj = new jsSHA("SHA-256", "TEXT");
    shaObj.update(password);
    let hash = shaObj.getHash("HEX");

    let u:User = {
      name: name,
      surnames: surnames,
      email: email,
      password: hash,
      shipping: 0,
      call: 0
    }

    this.userService.createUser(u);

    this.modalController.dismiss();
  }

  public backButton(){
    this.modalController.dismiss();
  }

}
