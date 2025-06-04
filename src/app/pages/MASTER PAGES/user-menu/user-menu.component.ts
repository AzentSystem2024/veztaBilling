import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DxButtonModule, DxCheckBoxModule, DxDataGridModule, DxDropDownButtonModule, DxFormModule, DxLookupModule, DxPopupModule, DxRadioGroupModule, DxSelectBoxModule, DxTabPanelModule, DxTabsModule, DxTemplateModule, DxTextBoxModule, DxTreeViewModule, DxValidatorModule } from 'devextreme-angular';
import { FormPopupModule } from 'src/app/components';
import { UserListModule } from "../userFiles/user-list/user-list.component";
import { EditingStartEvent, RowRemovedEvent, SelectionChangedEvent } from 'devextreme/ui/data_grid';
import { ItemClickEvent } from 'devextreme/ui/tabs';
import { DxoFormModule } from 'devextreme-angular/ui/nested';



@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent {
popup_width: any;
addData() {

}

onAddPopupClose() {

}
addPopup: boolean;
getStatusFlagClass(arg0: any): string|string[]|Set<string>|{ [klass: string]: any; } {
throw new Error('Method not implemented.');
}
openPopup() {
  this.addPopup = true;
}
dataSource:["Ho User","Central User"];
showFilterRow: any;
currentFilter: any;
deleteData($event: RowRemovedEvent) {

}
onEditingStart($event: EditingStartEvent) {

}
onTabClick($event: ItemClickEvent) {

}
onSelectionChanged($event: SelectionChangedEvent) {
throw new Error('Method not implemented.');
}

  width: any = '100%';
  rtlEnabled: boolean = false;
  scrollByContent: boolean = true;
  showNavButtons: boolean = true;
  orientations: any = 'horizontal';
  stylingMode: any = 'primary';
  iconPosition: any = 'left';
  selectedTabData: any[] = [];
  selectedRows: { [key: number]: any[] } = {};
  selectedTab: number = 0;
  allSelectedRows: any[] = [];
  MenuDatasource: any;
  UserLevelValue: any = '';
  isErrorVisible: boolean = false;
  UserListdataSource: any;
  userRoles: any;
  CopiedUserLevelValue: any;
}


@NgModule({
  imports: [
    CommonModule,
    DxTabPanelModule,
    DxCheckBoxModule,
    DxSelectBoxModule,
    DxTemplateModule,
    DxTabsModule,
    DxTextBoxModule,
    DxButtonModule,
    DxDataGridModule,
    DxTreeViewModule,
    DxValidatorModule,
    DxPopupModule,
    DxFormModule,
    FormPopupModule,
],
  providers: [],
  declarations: [UserMenuComponent],
  exports: [UserMenuComponent],
})
export class UserMenuModule {}
