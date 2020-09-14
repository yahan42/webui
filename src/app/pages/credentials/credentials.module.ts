import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './credentials.routing';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDividerModule } from "@angular/material/divider";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUploaderModule } from 'ngx-uploader';

import { EntityModule } from '../common/entity/entity.module';

import { MaterialModule } from '../../appMaterial.module';
import { MarkdownModule } from 'ngx-markdown';
import { CommonDirectivesModule } from '../../directives/common/common-directives.module';

import { CredentialsComponent } from './credentials.component';
import { BackupCredentialsComponent } from './backup-credentials/backup-credentials.component';

@NgModule({
  declarations: [ CredentialsComponent, BackupCredentialsComponent ],
  imports: [
    CommonModule,
    MatCardModule,
    FlexLayoutModule,
    MatDividerModule,
    routing,
    MaterialModule,
    CommonDirectivesModule,
    EntityModule
  ]
})
export class CredentialsModule { }
