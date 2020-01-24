import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../appMaterial.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { CommonDirectivesModule } from '../../directives/common/common-directives.module';
import { TextLimiterDirective } from './text-limiter/text-limiter.directive';
import { TextLimiterTooltipComponent } from './text-limiter/text-limiter-tooltip/text-limiter-tooltip.component';
import { iXAnimateDirective } from './ix-animate/ix-animate.directive';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    DragDropModule,
    OverlayModule,
    PortalModule,
    FlexLayoutModule,
    TranslateModule,
    CommonDirectivesModule,
  ],
  declarations: [
    TextLimiterDirective,
    TextLimiterTooltipComponent,
    iXAnimateDirective,
  ],
  exports: [ // Modules and Components here
    CommonModule,
    MaterialModule,
    DragDropModule,
    OverlayModule,
    PortalModule,
    FlexLayoutModule,
    TranslateModule,
    CommonDirectivesModule,
    TextLimiterDirective,
    TextLimiterTooltipComponent,
    iXAnimateDirective,
  ],
  entryComponents:[
    TextLimiterTooltipComponent,
  ],
  providers:[
  ]
})
export class CoreDirectives {}
