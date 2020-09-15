import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CredentialsComponent } from './credentials.component';
import { BackupCredentialsComponent } from './backup-credentials/backup-credentials.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { GroupListComponent } from './groups/group-list/group-list.component';
import { ChangePasswordComponent } from './users/change-password/change-password.component';
import { MembersComponent } from './groups/members/members.component';
import { TwoFactorComponent } from '../credentials/two-factor/two-factor.component';
import { DirServTempComponent } from './dir-serv-temp/dir-serv-temp.component';

export const routes: Routes = [{
  path: '',
  data: { title: 'Credentials' },
  children: [{
    path: 'users',
    data: { title: 'Users', breadcrumb: 'Users', icon: 'group' },
    children: [{
        path: '',
        component: UserListComponent,
        data: { title: 'Users', breadcrumb: 'Users' },
      }, {
        path: 'change-password',
        component: ChangePasswordComponent,
        data: { title: 'Change Password', breadcrumb: 'Change Password' },
      }]
  }, {
    path: 'groups',
    data: { title: 'Groups', breadcrumb: 'Groups', icon: 'group_work' },
    children: [{
        path: '',
        component: GroupListComponent,
        data: { title: 'Groups', breadcrumb: 'Groups' },
      }, {
        path: 'members/:pk',
        component: MembersComponent,
        data: {title: 'Update Members', breadcrumb: 'Members'}
      }]
  }, {
    path: 'two-factor',
    component: TwoFactorComponent,
    data: { title: ('Two-Factor Auth'), breadcrumb: ('Two-Factor Auth') },
  },

  // Temporary component
  {
    path: 'directory-services',
    component: DirServTempComponent,
    data: { title: ('Directory Services') },
  },
  {
    path: 'temp-misc',
    component: CredentialsComponent,
    data: { title: ('Credentials') }
  },
  {
    path: 'backup-credentials',
    component: BackupCredentialsComponent
  }
]
}];

export const routing: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);