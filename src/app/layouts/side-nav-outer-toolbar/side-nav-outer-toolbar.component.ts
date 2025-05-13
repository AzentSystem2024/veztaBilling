import {
  Component,
  OnInit,
  OnDestroy,
  NgModule,
  Input,
  ViewChild,
} from '@angular/core';
import { DxTreeViewTypes } from 'devextreme-angular/ui/tree-view';
import { DxDrawerModule, DxDrawerTypes } from 'devextreme-angular/ui/drawer';
import { DxScrollViewComponent } from 'devextreme-angular/ui/scroll-view';
import { CommonModule } from '@angular/common';

import { Router, RouterModule, NavigationEnd, Event } from '@angular/router';
import { ScreenService, AppInfoService, DataService } from '../../services';
import {
  SideNavigationMenuModule,
  AppHeaderModule,
  AppFooterModule,
} from '../../components';
import {
  DxButtonModule,
  DxSortableModule,
  DxTabPanelModule,
  DxListModule,
  DxTemplateModule,
} from 'devextreme-angular';
import { Subscription } from 'rxjs';
import { DxSortableTypes } from 'devextreme-angular/ui/sortable';
import { CustomReuseStrategy } from 'src/app/custom-reuse-strategy';

@Component({
  selector: 'app-side-nav-outer-toolbar',
  templateUrl: './side-nav-outer-toolbar.component.html',
  styleUrls: ['./side-nav-outer-toolbar.component.scss'],
  providers: [DataService, CustomReuseStrategy],
})
export class SideNavOuterToolbarComponent implements OnInit, OnDestroy {
  @ViewChild(DxScrollViewComponent, { static: true })
  scrollView!: DxScrollViewComponent;

  @Input()
  title!: string;

  selectedRoute = '';

  menuOpened!: boolean;

  temporaryMenuOpened = false;

  menuMode: DxDrawerTypes.OpenedStateMode = 'shrink';

  menuRevealMode: DxDrawerTypes.RevealMode = 'expand';

  minMenuSize = 0;

  shaderEnabled = false;

  routerSubscription: Subscription;

  screenSubscription: Subscription;
  tabs: any[] = [];
  selectedIndex = 0;
  constructor(
    private screen: ScreenService,
    private router: Router,
    public appInfo: AppInfoService,
    private dataService: DataService,
    private customReuseStrategy: CustomReuseStrategy
  ) {
    // this.routerSubscription = this.router.events.subscribe((event: Event) => {
    //   if (event instanceof NavigationEnd) {
    //     this.selectedRoute = event.urlAfterRedirects.split('?')[0];
    //   }
    // });
    // inactiveservice.startTheInactiveService();
  }

  ngOnInit() {
    let path = 'dashboard';
    let title = 'Dashboard';
    this.tabs.push({
      title: title,
      path: path,
    });
    this.selectedIndex = this.tabs.findIndex((tab) => tab.path === path);
    this.router.navigate([path]);

    this.menuOpened = this.screen.sizes['screen-large'];
    this.screenSubscription = this.screen.changed.subscribe(() =>
      this.updateDrawer()
    );
    this.updateDrawer();
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
    this.screenSubscription.unsubscribe();
  }

  updateDrawer() {
    const isXSmall = this.screen.sizes['screen-x-small'];
    const isLarge = this.screen.sizes['screen-large'];

    this.menuMode = isLarge ? 'shrink' : 'overlap';
    this.menuRevealMode = isXSmall ? 'slide' : 'expand';
    this.minMenuSize = isXSmall ? 0 : 48;
    this.shaderEnabled = !isLarge;
  }

  get hideMenuAfterNavigation() {
    return this.menuMode === 'overlap' || this.temporaryMenuOpened;
  }

  get showMenuAfterClick() {
    return !this.menuOpened;
  }

  //===================================================================
  navigationChanged(event: DxTreeViewTypes.ItemClickEvent) {
    const path = (event.itemData as any).path;
    const pointerEvent = event.event;

    if (path && this.menuOpened) {
      // this.dataService
      //   .set_pageLoading_And_Closing_Log(0, path)
      //   .subscribe((response: any) => {});
      const tabExists = this.tabs.some((tab) => tab.path === path);
      if (!tabExists) {
        this.tabs.push({
          title: event.itemData.text,
          path: path,
        });
        this.selectedIndex = this.tabs.findIndex((tab) => tab.path === path);
        this.router.navigate([path]);
      } else {
        this.selectedIndex = this.tabs.findIndex((tab) => tab.path === path);
        this.router.navigate([path]);
      }
      if (this.menuOpened) {
        pointerEvent?.preventDefault();
      }
      if (this.hideMenuAfterNavigation) {
        this.menuOpened = false;
        pointerEvent?.stopPropagation();
      }
    } else {
      pointerEvent?.preventDefault();
    }
  }

  navigationClick() {
    // this.menuOpened = !this.menuOpened;
    if (this.showMenuAfterClick) {
      this.temporaryMenuOpened = true;
      this.menuOpened = true;
    }
  }
  TabItemClick(tab: any) {
    const path = tab.path;
    this.selectedIndex = this.tabs.findIndex((tab) => tab.path === path);
    this.router.navigate([path]);
  }

  disableButton() {
    return false;
  }

  onTabDragStart(e: DxSortableTypes.DragStartEvent) {
    e.itemData = e.fromData[e.fromIndex];
  }

  onTabDrop(event) {}

  showCloseButton() {
    return true;
  }

  closeButtonHandler(tab: any) {
    console.log('tabs are =>', tab);
    const index = this.tabs.indexOf(tab);
    if (index > -1) {
      this.tabs.splice(index, 1);
      this.customReuseStrategy.removeStoredComponent(tab.path);
      // this.dataService
      //   .set_pageLoading_And_Closing_Log(10, tab.path)
      //   .subscribe((response: any) => {});
      if (this.selectedIndex >= this.tabs.length) {
        this.selectedIndex = this.tabs.length - 1;
      }
    }
    if (this.selectedIndex >= 0) {
      const selectedTab = this.tabs[this.selectedIndex];
      let path = selectedTab.path;
      this.router.navigate([path]);
    } else {
    }
  }
}

@NgModule({
  imports: [
    RouterModule,
    SideNavigationMenuModule,
    DxDrawerModule,
    AppHeaderModule,
    CommonModule,
    AppFooterModule,
    DxButtonModule,
    DxSortableModule,
    DxTabPanelModule,
    DxListModule,
    DxTemplateModule,
  ],
  exports: [SideNavOuterToolbarComponent],
  declarations: [SideNavOuterToolbarComponent],
})
export class SideNavOuterToolbarModule {}
