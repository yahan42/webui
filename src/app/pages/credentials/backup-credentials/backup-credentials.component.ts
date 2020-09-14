import { Component, OnInit } from '@angular/core';
import { WebSocketService } from 'app/services';

@Component({
  selector: 'app-backup-credentials',
  templateUrl: './backup-credentials.component.html',
  styleUrls: ['./backup-credentials.component.scss']
})
export class BackupCredentialsComponent implements OnInit {
  cloudCreds = [];
  SSHKeypairs = [];
  SSHCreds = [];
  cards: any;

  constructor(private ws: WebSocketService) { }

  ngOnInit(): void {
    this.getCreds();
  }

  getCreds() {
    this.ws.call('cloudsync.credentials.query').subscribe(credentials => {
      credentials.forEach(cred => {
        this.cloudCreds.push(cred);
      })
      this.ws.call('keychaincredential.query').subscribe(credentials=> {
        credentials.forEach(cred => {
          if (cred.type === 'SSH_KEY_PAIR') {
            this.SSHKeypairs.push(cred);
          } else if (cred.type === 'SSH_CREDENTIALS') {
            this.SSHCreds.push(cred);
          }
        })
        this.cards = [
          { name: 'cloudCredentials', flex: 40, label: 'Cloud Credentials',
            dataSource: this.cloudCreds, displayedColumns: ['name', 'provider', 'actions']
          },
          { name: 'sshConnections', flex: 30, label: 'SSH Connections',
            dataSource: this.SSHCreds, displayedColumns: ['name', 'actions']
          },
          { name: 'sshKeypairs', flex: 30, label: 'SSH Keypairs',
            dataSource: this.SSHKeypairs, displayedColumns: ['name', 'actions']
          }
        ];
      })
    })
  }

  doAdd(form: string, item?: string ) {
    console.log(form)
  }

  doDelete(form: string, item?: string ) {
    console.log(form)
  }

}
