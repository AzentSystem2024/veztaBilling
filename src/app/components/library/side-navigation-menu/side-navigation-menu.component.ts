import { AuthService } from 'src/app/services';
import {
  Component,
  NgModule,
  Output,
  Input,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import {
  DxTreeViewModule,
  DxTreeViewComponent,
  DxTreeViewTypes,
} from 'devextreme-angular/ui/tree-view';
import { DxTabPanelModule } from 'devextreme-angular';
import * as events from 'devextreme/events';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from 'src/app/services/menu.service';
import * as path from 'path';

@Component({
  selector: 'side-navigation-menu',
  templateUrl: './side-navigation-menu.component.html',
  styleUrls: ['./side-navigation-menu.component.scss'],
})
export class SideNavigationMenuComponent
  implements AfterViewInit, OnDestroy, OnInit
{
  @ViewChild(DxTreeViewComponent, { static: true })
  menu!: DxTreeViewComponent;

  @Output() selectedItemChanged =
    new EventEmitter<DxTreeViewTypes.ItemClickEvent>();
  @Output() openMenu = new EventEmitter<any>();

  private _selectedItem!: String;
  private _compactMode = false;
  private _items!: Record<string, unknown>[];
  navigation: any;
  selectedItemKeys: any;
  userType:any
items: any;

  

  // items = [


  //   {
  //     text: 'settings',
  //     icon: 'preferences',
  //     path: '/dashboard',
  //     items: [
  //       {
  //         text: 'Basic Settings',
  //         // path: '/user',
  //       },
  //       {
  //         text: 'User',
  //         path: '/user',
  //       },
        

  //     ]
  //   },

  //   {
  //     text: 'Masters',
  //     icon: 'user',
  //     path: '',
  //     items: [
  //       {
  //         text: 'Hospital',
  //         path: '/hospital',
  //       },
  //        {
  //         text: 'Department',
  //         path: '/department',
  //       },
  //          {
  //         text: 'Item',
  //         path: '/item',
  //       },
  //       {
  //         text:'Insurance',
  //         path:'/insurance',
  //       },
  //       {
  //         text: 'Schema',
  //         path: '/schema',
  //       }
       
  //     ],
  //   },
  //   {
  //     text: 'Invoice',
  //     icon: 'money',
  //     path: '',
  //     items: [
  //       {
  //         text: 'Invoice List',
  //         path: '/invoice',
  //       },
  //       {
  //         text: 'New Invoice',
  //         path: '/invoice-entry',
  //       },
  //     ],
  //   },

  // ];

  @Input()
  set selectedItem(value: String) {
    this._selectedItem = value;
    this.setSelectedItem();
  }

  get selectedItem(): String {
    return this._selectedItem;
  }

  @Input()
  set compactMode(val: boolean) {
    this._compactMode = val;

    if (!this.menu.instance) {
      return;
    }

    if (val) {
      this.menu.instance.collapseAll();
    } else {
      this.menu.instance.expandItem(this._selectedItem);
    }
  }

  constructor(
    private elementRef: ElementRef,
    private AuthService: AuthService,
    private router: Router, private route: ActivatedRoute,
    private menuService: MenuService,
    private cdr: ChangeDetectorRef
  ) {
    this.userType = localStorage.getItem('USER_TYPE');
  }

  ngOnInit(): void {
    const userType = localStorage.getItem('USER_TYPE');
    console.log(userType, 'USERTYPE');
    this.menuService.menuRefresh$.subscribe(() => {
      this.refreshMenu();
    });
    this.refreshMenu();
  
    // Load the navigation data from localStorage
    this.navigation = JSON.parse(localStorage.getItem('sidemenuItems') || '[]');
console.log(this.navigation,"NAVIGATIONNNNNN")
    this.cdr.detectChanges(); // Force UI to update
  }

// refreshMenu() {
//   const userData = JSON.parse(localStorage.getItem('userData') || '{}');
// const menuList = JSON.parse(localStorage.getItem('userMenus') || '[]');
// console.log(menuList,"MENULISTTTTTT")
// const groupedMenus: { [key: string]: any[] } = {};
//   const isAdmin = userData?.USER_TYPE_ID === 1;
//   const canViewInvoice = userData?.VIEW_INVOICE === true;
//   const canAddInvoice = userData?.ADD_INVOICE === true;

//   this.items = [];

//   // Settings (Admin only)
//   if (isAdmin) {
//     this.items.push({
//       text: 'Settings',
//       icon: 'preferences',
//       path: '/dashboard',
//       items: [
//         { text: 'Basic Settings' },
//         { text: 'User', path: '/user' },
        
//       ],
//     });
//   }

//   // Masters (Admin only)
//   if (isAdmin) {
//     this.items.push({
//       text: 'Masters',
//       icon: 'user',
//       path: '',
//       items: [
//         { text: 'Hospital', path: '/hospital' },
//         { text: 'Department', path: '/department' },
//         { text: 'Item', path: '/item' },
//         { text: 'Insurance', path: '/insurance' },
//         { text: 'Schema', path: '/schema' },
//       ],
//     });
//   }

//   // Invoice items (based on permissions or Admin)
//   const invoiceItems = [];
//   if (isAdmin || canViewInvoice) {
//     invoiceItems.push({ text: 'Invoice List', path: '/invoice' });
//   }
//   if (isAdmin || canAddInvoice) {
//     invoiceItems.push({ text: 'New Invoice', path: '/invoice-entry' });
//   }

//   if (invoiceItems.length > 0) {
//     this.items.push({
//       text: 'Invoice',
//       icon: 'money',
//       path: '',
//       items: invoiceItems,
//     });
//   }

//   // Reports (Visible to all, or restrict if needed)
//   this.items.push({
//     text: 'Report',
//     icon: 'fa fa-file-alt',
//     path: '',
//     items: [
//       { text: 'Hospital Wise Summary', path: '/hospitalwise-summary' },
//       { text: 'Date Wise Summary', path: '/datewise-summary' },
//       { text: 'Bill Wise Summary', path: '/billwise-summary' },
//       // { text: 'Staff Wise Summary', path: '/staffwise-summary' },
//       { text: 'Item Wise Summary', path: '/testitemwise-summary' },
//       { text: 'Scheme Wise Summary', path: '/schemewise-summary' },
    
      
//       // { text: 'Scheme Wise Bill Summary', path: '/schemewise-bill-summary' },
//       // { text: 'Patient Wise Summary', path: '/patientwise-summary' },
//     ],
//   });

//   // Optional: Save to localStorage if used elsewhere
//   localStorage.setItem('sidemenuItems', JSON.stringify(this.items));
// }

refreshMenu() {
  const menuList = JSON.parse(localStorage.getItem('userMenus') || '[]');
  const groupedMenus: { [key: string]: any[] } = {};

  this.items = [];

  // Step 1: Group child menus by MAIN_MENU
  for (const menu of menuList) {
    const mainMenu = menu.MAIN_MENU;
    if (!groupedMenus[mainMenu]) {
      groupedMenus[mainMenu] = [];
    }

    groupedMenus[mainMenu].push({
      text: menu.MENU_NAME,
      path: this.getRouteForMenu(menu.MENU_NAME),
    });
  }

  // Step 2: Create sidebar items from groupedMenus
  for (const mainMenu in groupedMenus) {
    this.items.push({
      text: mainMenu,
      icon: this.getIconForMainMenu(mainMenu),
      path: '',
      items: groupedMenus[mainMenu],
    });
  }

  localStorage.setItem('sidemenuItems', JSON.stringify(this.items));
}

getRouteForMenu(menuName: string): string {
  switch (menuName) {
    case 'Basic Settings': return '/dashboard';
    case 'Users': return '/user';
    case 'Hospital': return '/hospital';
    case 'Department': return '/department';
    case 'Item': return '/item';
    case 'Insurance': return '/insurance';
    case 'Schema': return '/schema';
    case 'Invoice List': return '/invoice';
    case 'New Invoice': return '/invoice-entry';
    case 'Hospital Wise Summary': return '/hospitalwise-summary';
    case 'Date Wise Summary': return '/datewise-summary';
    case 'Bill Wise Summary': return '/billwise-summary';
    case 'Item Wise Summary': return '/testitemwise-summary';
    case 'Scheme Wise Summary': return '/schemewise-summary';
    default: return '';
  }
}

getIconForMainMenu(menu: string): string {
  switch (menu.toLowerCase()) {
    case 'settings': return 'preferences';
    case 'masters': return 'user';
    case 'invoice': return 'money';
    case 'report': return 'fa fa-file-alt';
    default: return 'folder';
  }
}



  setSelectedItem() {
    if (!this.menu.instance) {
      return;
    }
    this.menu.instance.selectItem(this.selectedItem);
  }

  onItemClick(event: DxTreeViewTypes.ItemClickEvent) {
    this.selectedItemChanged.emit(event);
    // this.selectedItemKeys =;
  }

  ngAfterViewInit() {
    this.setSelectedItem();
    events.on(this.elementRef.nativeElement, 'dxclick', (e: Event) => {
      this.openMenu.next(e);
    });
  }

  ngOnDestroy() {
    events.off(this.elementRef.nativeElement, 'dxclick');
  }

 
}

@NgModule({
  imports: [DxTreeViewModule, DxTabPanelModule],
  declarations: [SideNavigationMenuComponent],
  exports: [SideNavigationMenuComponent],
})
export class SideNavigationMenuModule {}
