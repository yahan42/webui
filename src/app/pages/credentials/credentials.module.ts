import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './credentials.routing';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDividerModule } from "@angular/material/divider";
import { TranslateModule } from '@ngx-translate/core';
import { EntityModule } from '../common/entity/entity.module';

import { MaterialModule } from '../../appMaterial.module';
import { CommonDirectivesModule } from '../../directives/common/common-directives.module';

import { CredentialsComponent } from './credentials.component';
import { BackupCredentialsComponent } from './backup-credentials/backup-credentials.component';
import { SshConnectionsFormComponent } from './backup-credentials/ssh-connections/ssh-connections-form.component';
import { SshKeypairsFormComponent } from './backup-credentials/ssh-keypairs/ssh-keypairs-form.component';
import { CloudCredentialsFormComponent } from './backup-credentials/cloudcredentials/cloudcredentials-form.component';

@NgModule({
  declarations: [ CredentialsComponent, BackupCredentialsComponent, SshConnectionsFormComponent,
    SshKeypairsFormComponent, CloudCredentialsFormComponent ],
  imports: [
    CommonModule,
    MatCardModule,
    FlexLayoutModule,
    MatDividerModule,
    routing,
    MaterialModule,
    CommonDirectivesModule,
    EntityModule,
    TranslateModule
  ]
})
export class CredentialsModule { }
