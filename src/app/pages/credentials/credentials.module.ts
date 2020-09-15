import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './credentials.routing';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDividerModule } from "@angular/material/divider";
import { TranslateModule } from '@ngx-translate/core';
import { EntityModule } from '../common/entity/entity.module';
import { QRCodeModule } from 'angular2-qrcode';
import { NgxDualListboxModule } from '../../components/common/dual-list/dual-list.module';

import { MaterialModule } from '../../appMaterial.module';
import { CommonDirectivesModule } from '../../directives/common/common-directives.module';

import { CredentialsComponent } from './credentials.component';
import { BackupCredentialsComponent } from './backup-credentials/backup-credentials.component';
import { SshConnectionsFormComponent } from './backup-credentials/ssh-connections/ssh-connections-form.component';
import { SshKeypairsFormComponent } from './backup-credentials/ssh-keypairs/ssh-keypairs-form.component';
import { CloudCredentialsFormComponent } from './backup-credentials/cloudcredentials/cloudcredentials-form.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserFormComponent } from './users/user-form/user-form.component';
import { ChangePasswordComponent } from './users/change-password/change-password.component';
import { MembersComponent } from './groups/members/members.component';
import { GroupFormComponent } from './groups/group-form/group-form.component';
import { GroupListComponent } from './groups/group-list/group-list.component';
import { TwoFactorComponent } from './two-factor/two-factor.component';
import { QRDialog } from './two-factor/two-factor.component';
import { DirServTempComponent } from './dir-serv-temp/dir-serv-temp.component';


@NgModule({
  declarations: [ CredentialsComponent, BackupCredentialsComponent, SshConnectionsFormComponent,
    SshKeypairsFormComponent, CloudCredentialsFormComponent, UserFormComponent, UserListComponent,
    ChangePasswordComponent, GroupFormComponent, GroupListComponent, MembersComponent,
    TwoFactorComponent, QRDialog, DirServTempComponent],
  imports: [
    CommonModule,
    MatCardModule,
    FlexLayoutModule,
    MatDividerModule,
    routing,
    MaterialModule,
    CommonDirectivesModule,
    EntityModule,
    TranslateModule,
    QRCodeModule,
    NgxDualListboxModule
  ],
  entryComponents: [QRDialog],

})
export class CredentialsModule { }
