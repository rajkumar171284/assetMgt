import { Component, Inject, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../../../services/auth.service';
import { environment } from 'src/environments/environment';
import { XAxisService } from '../../../services/x-axis.service';
@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss']
})
export class AddCompanyComponent implements OnChanges, OnInit {
  roleData = [
    'LEVEL1',
    'ADMIN']
  @Input() tabIndex: any;
  @Input() updateData: any;

  @Output() dialogClose: any = new EventEmitter();
  @ViewChild('UploadFileInput', { static: false }) uploadFileInput: ElementRef | undefined;
  bImg: any;
  newForm: FormGroup;
  public typeName: any = {};
  accessYes = true;
  accessNo = false;
  public imgUrl = environment.imgUrl;
  constructor(public transfer: XAxisService, private dataService: AuthService, private fb: FormBuilder, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.newForm = this.fb.group({
      PID: [''],
      COMPANY_NAME: ['', Validators.required],
      COMPANY_ADDRESS_LINE1: [''],
      COMPANY_ADDRESS_LINE2: ['', Validators.required],
      COMPANY_TYPE: ['', Validators.required],
      STATUS: ['', Validators.required],
      APP_SOLUTION_NAME: ['', Validators.required],
      LOGO: [''],
    })
    // console.log(data)
    if (!data) {
      // add
      const session = this.dataService.getSessionData();
      this.newForm.patchValue({
        COMPANY_TYPE: 'CLIENT',
        STATUS: true
      })

    } else if (data && data.PID) {
      this.bImg = this.imgUrl + data.LOGO;
      this.typeName = data;
      this.newForm.patchValue(data);
      this.newForm.patchValue({
        LOGO: data.LOGO,
        STATUS: data.STATUS ? true : false,

      });


    }
  }
  ngOnInit(): void {
    console.log('typeName', this.typeName.isProfileChange ? this.typeName.isProfileChange : '')
  }

  ngOnChanges(changes: SimpleChanges): void {

  }
  async confirmData() {


    if (this.newForm.valid) {
      const session = await this.dataService.getSessionData();
      this.Values.CREATED_BY = session.PID;
      // this.Values.LOGO = this.selectedLogo && this.selectedLogo.name?this.selectedLogo.name:this.Values.LOGO;
      this.dataService.createCompany(this.Values).subscribe(res => {
        // console.log(res)

        if (res && res.status == 200) {
          if (this.typeName.isProfileChange) {
            console.log('typeName', this.typeName.isProfileChange ? this.typeName.isProfileChange : '')

            // if profile update happend only
            this.transfer.updateCompany(this.Values);
          }

          if (this.selectedLogo) {

            this.uploadLogo();
          } else {
            this.dialogClose.emit(true);
            this.confirmClose();
          }

        } else {
          this.dialogClose.emit(true);
          this.confirmClose();
        }
      })
    }
  }
  get Values() {
    return this.newForm.value;
  }
  confirmClose() {
    this.dialog.closeAll()

  }
  selectedLogo: any;
  onSelectFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.selectedLogo = event.target.files[0];
      const file = event.target.files[0];
      // console.log('dsds')
      if (file) {
        // preview image starts
        const reader = new FileReader();
        reader.onload = (event: any) => { // called once readAsDataURL is completed
          this.bImg = event.target.result.toString();//working
          // update on form
          this.newForm.patchValue({
            LOGO: file.name
          })
        }
        reader.readAsDataURL(file); // read file as data url
      }
    }

  }
  uploadLogo() {
    const formData = new FormData();
    formData.append('logo', this.selectedLogo, this.selectedLogo.name);

    // console.log(this.newForm)
    this.dataService.uploadLogo(formData).subscribe(res => {

      if (res && res.status == 200) {
        // the save comp details
        if (this.typeName.isProfileChange) {
        this.transfer.updateCompany(this.Values);
        }
        // console.log(res)
        this.dialogClose.emit(true);
        this.confirmClose();
      }

    })
  }
  // UploadImages(event: any) {
  //   var file = event.target.files[0];
  //   let reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   var imageSrc;
  //   reader.onload = function () {
  //     // imageSrc = reader.result.toString();
  //   };

  //   var image_data = {
  //     fileToUpload: imageSrc,
  //     attachable_type: "Photo"
  //   };

  //   // this.server.photo_Upload(image_data).subscribe(response => {
  //   //   if (response["success"]) {
  //   //     console.log(response);
  //   //   } else {
  //   //     console.log(response);
  //   //   }
  //   // });
  // }
  enableClick() {
    const btnid = document.getElementById("fileID");
    if (btnid) {
      btnid.click();
    }
  }
}
