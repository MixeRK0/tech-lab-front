import {Component, DoCheck, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

export interface TabsetConfig {
  tabs: TabConfig[],
}

export interface TabConfig {
  id: string,
  title: string,
  navigation: {
    url: Array<any>,
    extras?: any,
  }
}

@Component({
  selector: 'cui-tabset',
  templateUrl: './cui-tabset.component.html',
  styleUrls: [
    '../../css/cui-tabset.component.css'
  ],
})
export class CuiTabsetComponent implements DoCheck {
  @Input() public config: TabsetConfig;

  public currentActiveTabId: any;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ResolveActiveTab() {
    this.currentActiveTabId = this.route.firstChild.snapshot.url[0].path;
  }

  ResolveTabStyle(tab: TabConfig) {
    return tab.id === this.currentActiveTabId ? 'nav-link active' : 'nav-link';
  }

  ClickTab(tab: TabConfig) {
    this.currentActiveTabId = tab.id;
    tab.navigation.extras
      ? this.router.navigate(tab.navigation.url, tab.navigation.extras)
      : this.router.navigate(tab.navigation.url);
  }

  ngDoCheck(): void {
    this.ResolveActiveTab();
  }
}
