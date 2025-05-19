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

  items = [
    // {
    //   text: 'Dashboard',
    //   icon: 'chart',
    //   path: '/dashboard',
    // },

    {
      text: 'settings',
      icon: 'preferences',
      path: '/dashboard',
      items: [
        {
          text: 'Basic Settings',
          // path: '/user',
        },
        {
          text: 'User',
          path: '/user',
        },

      ]
    },

    {
      text: 'Masters',
      icon: 'user',
      path: '',
      items: [
        {
          text: 'Hospital',
          path: '/hospital',
        },
         {
          text: 'Department',
          path: '/department',
        },
           {
          text: 'Item',
          path: '/item',
        },
        {
          text:'Insurance',
          path:'/insurance',
        },
        {
          text: 'Schema',
          path: '/schema',
        }
       
      ],
    },
    {
      text: 'Invoice',
      icon: 'money',
      path: '',
      items: [
        {
          text: 'Invoice',
          path: '/invoice',
        },
        {
          text: 'Invoice Entry',
          path: '/invoice-entry',
        },
      ],
    },
  ];

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
    // Hide "Reseller" menu if user type is 3
    // if (userType === '3') {
    //   this.items = this.items.map((menu) => ({
    //     ...menu,
    //     items:
    //       menu.items?.filter(
    //         (submenu) => submenu.text !== 'Reseller' && submenu.text !== 'User'
    //       ) || [],
    //   }));
    // } else if (userType === '4') {
    //   this.items = this.items.map((menu) => ({
    //     ...menu,
    //     items:
    //       menu.items?.filter(
    //         (submenu) =>
    //           submenu.text !== 'Customer' &&
    //           submenu.text !== 'Reseller' &&
    //           submenu.text !== 'User' 
    //           // submenu.text !== 'Sales'
    //       ) || [],
    //   }));
    // }
    // Load the navigation data from localStorage
    this.navigation = JSON.parse(localStorage.getItem('sidemenuItems') || '[]');

    this.cdr.detectChanges(); // Force UI to update
  }

  refreshMenu() {
    const userType = localStorage.getItem('USER_TYPE');
    console.log(userType, 'USERTYPE');
  
    // Your existing menu filtering logic...
    
    this.cdr.detectChanges(); // Force UI refresh
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

  // Transform the flat JSON data into a nested structure
  // private transformMenuData(menuItems: any[]): any[] {
  //   const lookup: { [key: string]: any } = {};
  //   const rootMenus: any[] = [];

  //   menuItems.forEach((item) => {
  //     lookup[item.id] = { ...item, items: [] }; // Initialize with items as an empty array

  //     if (item.GroupID === '0') {
  //       rootMenus.push(lookup[item.id]);
  //     } else {
  //       if (lookup[item.GroupID]) {
  //         lookup[item.GroupID].items.push(lookup[item.id]);
  //       }
  //     }
  //   });

  //   return rootMenus;
  // }
}

@NgModule({
  imports: [DxTreeViewModule, DxTabPanelModule],
  declarations: [SideNavigationMenuComponent],
  exports: [SideNavigationMenuComponent],
})
export class SideNavigationMenuModule {}
