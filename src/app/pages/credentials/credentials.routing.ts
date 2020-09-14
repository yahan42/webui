import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CredentialsComponent } from './credentials.component';
import { BackupCredentialsComponent } from './backup-credentials/backup-credentials.component';

export const routes: Routes = [{
  path: '',
  component: BackupCredentialsComponent,
  data: { title: 'Credentials' },
  children: [{
    path: 'backup-credentials',
    component: BackupCredentialsComponent,
    data: { title: ('Backup Credentials'), breadcrumb: ('') },
  }
]
}];
export const routing: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);