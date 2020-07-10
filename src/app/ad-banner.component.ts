import {
  Component,
  Input,
  AfterViewInit,
  ViewChildren,
  ComponentFactoryResolver,
  QueryList,
} from '@angular/core';

import { AdDirective } from './ad.directive';
import { AdItem } from './ad-item';
import { AdComponent } from './ad.component';

@Component({
  selector: 'app-ad-banner',
  template: `
    <div class="ad-banner-example">
      <h3>Advertisements</h3>
      <ng-container *ngFor="let ad of ads">
        <ng-template ad-host></ng-template>
      </ng-container>
    </div>
  `,
})
export class AdBannerComponent implements AfterViewInit {
  @Input() ads: AdItem[];
  currentAdIndex = -1;
  @ViewChildren(AdDirective) adHosts: QueryList<AdDirective>;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngAfterViewInit(): void {
    // How to ExpressionChangedAfterItHasBeenCheckedError
    Promise.resolve(null).then(() => this.loadComponent());
  }

  loadComponent() {
    for (let index = 0; index < this.ads.length; index++) {
      const adItem = this.ads[index];
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
        adItem.component
      );

      const viewContainerRef = this.adHosts.toArray()[index].viewContainerRef;
      viewContainerRef.clear();

      const componentRef = viewContainerRef.createComponent(componentFactory);
      (<AdComponent>componentRef.instance).data = adItem.data;
    }
  }
}
