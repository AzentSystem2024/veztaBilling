import { Component, NgModule } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DxButtonModule, DxCheckBoxModule, DxDataGridModule, DxFormModule, DxPopupModule } from 'devextreme-angular';
import { DxoToolbarModule } from 'devextreme-angular/ui/nested';
import { EditingStartEvent } from 'devextreme/ui/data_grid';
import { DataService } from 'src/app/services';

@Component({
  selector: 'app-schema',
  templateUrl: './schema.component.html',
  styleUrls: ['./schema.component.scss']
})
export class SchemaComponent { 

  dataSource: any = [{
    Id: 1,
    SCHEMA: "Schema 1",
    PERCENTAGE : 10,
  }];

  PopupWidth = 400;
  addPopup: boolean = false;
  editPopup: boolean = false;
  formsource: any;
  editSchemaData: any;
  schemaValue: any;
Schema_Value: any;
Percentage_Value:any;


  constructor(private fb:FormBuilder ,private dataservice: DataService) {
   this.formsource=this.fb.group({
    Id: [null],
    Schema:["",[Validators.required]],
  
  
   })
  }

onExporting(event: any) {

}
  

openPopup(){
  this.addPopup = true;
  this.formsource.reset();
}


  closePop(){
    this.addPopup=false;
  this.editPopup=false;
this.formsource.reset()
  this.formsource.reset({
    
  });
  console.log(this.formsource,'reset');
  
  }
onEditingStart(event: any) {
  event.cancel=true;
    this.editSchemaData=event.data;
    this.editPopup=true;

}
 deleteData(event: any) {

 }

 addData(){

 }

 editData(){

 }

}


@NgModule({
  imports: [
    DxDataGridModule, DxButtonModule, DxPopupModule, DxFormModule, DxCheckBoxModule, DxoToolbarModule, ReactiveFormsModule,
],
  providers: [],
  exports: [SchemaComponent],
  declarations: [SchemaComponent],
})
export class SchemaModule {}