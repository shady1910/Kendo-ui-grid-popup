import { Component, ElementRef, TemplateRef } from '@angular/core';
import { PopupService, PopupRef } from '@progress/kendo-angular-popup';
import { Subscription } from 'rxjs';
import { products } from './products';

@Component({
    selector: 'my-app',
    template: `
        <ng-template #template>
          <div class="content">
            <!-- User-defined content -->
            {{popupDataItem.Category.CategoryName}}
          </div>
        </ng-template>
        <kendo-grid
            [kendoGridBinding]="gridData"
            [height]="410">
            <kendo-grid-column field="ProductName" title="Name" [sticky]="true" [width]="250">
            </kendo-grid-column>
            <kendo-grid-column field="Category.CategoryName" title="Category" [width]="250">
                <ng-template kendoGridCellTemplate let-dataItem>
                    <div class="d-flex"> 
                        <span>{{dataItem.Category.CategoryName}}</span> 
                        <button #anchor (click)="onToggle(dataItem, anchor, template)" class="ms-auto me-1 k-button text-muted" style="font-size: 10px">
                         {{ dataItem === popupDataItem ? 'Hide' : 'Show' }} Description 
                        </button>
                    </div>
                </ng-template>
            </kendo-grid-column>
    
        </kendo-grid>
    `
    ,
  styles: [
    `
      .content {
        padding: 30px;
        color: #787878;
        background-color: #fcf7f8;
        border: 1px solid rgba(0, 0, 0, 0.05);
      }
    `,
  ],
    
})
export class AppComponent {
    public gridData: any[] = products;
    public popupDataItem: any;
    private popupRef: PopupRef;
    private sub: Subscription;

    constructor(private popupService: PopupService) {}

    ngOnDestroy(): void {
      if (this.sub) {
        this.sub.unsubscribe();
      }
    }

    public onToggle(dataItem: any, anchor: ElementRef, template: TemplateRef<any>): void {
      if (this.popupRef && dataItem === this.popupDataItem) {
        this.cleanup();
      } else {
        if (this.popupRef) {
          this.cleanup();
        }
        this.popupDataItem = dataItem;
        this.popupRef = this.popupService.open({
          anchor: anchor,
          content: template,
        });

        this.sub = this.popupRef.popup.instance.anchorViewportLeave.subscribe(() => {
          this.cleanup()
        })
      }
    }

    private cleanup() {
      this.sub.unsubscribe();
      this.popupRef.close();
      this.popupRef = null;
      this.popupDataItem = undefined;
    }
}
