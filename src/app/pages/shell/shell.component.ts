import { Component, ElementRef, Input, OnChanges, OnDestroy, AfterViewInit, SimpleChange, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { ShellService, WebSocketService } from "../../services/";
import helptext from "./../../helptext/shell/shell";
import { CopyPasteMessageComponent } from "./copy-paste-message.component";
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit'; 
import { AttachAddon } from 'xterm-addon-attach'; 

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.css'],
  providers: [ShellService],
})
export class ShellComponent implements AfterViewInit, OnChanges, OnDestroy {
  // sets the shell prompt
  @Input() prompt = '';
  //xter container
  @ViewChild('terminal', { static: true}) container: ElementRef;
  // xterm variables
  cols: number;
  rows: number;
  rowCount: number;
  private currentRowPosition: number;
  font_size = 14;

  public token: any;

  public xterm: Terminal;
  protected fitAddon: FitAddon;
  protected attachAddon: AttachAddon;

  public resize_terminal = true;
  protected shellSubscription: any;
  public lastWidth: number;
  public lastHeight: number;

  protected ws: WebSocketService;
  protected ss: ShellService;
  protected translate: TranslateService;
  protected dialog: MatDialog;
  public usage_tooltip = helptext.usage_tooltip;

  clearLine = "\u001b[2K\r";
  public shellConnected: boolean = false;

  ngAfterViewInit() {
    this.getAuthToken().subscribe((res) => {
      this.initializeWebShell(res);
      this.shellSubscription = this.ss.shellOutput.subscribe((value) => {
        if (value !== undefined){
        } 
      }); 
    });
  }

  ngOnDestroy() { if (this.ss.connected){
      this.ss.socket.close();
    }
    if(this.shellSubscription){
      this.shellSubscription.unsubscribe();
    }
    this.overflowParent('auto');
  }

  onResize(event) {
    this.setTermDimensions();
    this.fitTerm();
  }

  overflowParent(rule: string){
    let target:HTMLElement = document.querySelector('.rightside-content-hold');
    target.style['overflow-y'] = rule;
  }

  resetDefault() {
    this.font_size = 14;
    this.xterm.setOption('fontSize', this.font_size);
  }

  ngOnChanges(changes: {
    [propKey: string]: SimpleChange
  }){
    const log: string[] = [];
    for (const propName in changes) {
      const changedProp = changes[propName];
      console.log(changedProp);
      // reprint prompt
      if (propName === 'prompt' && this.xterm != null) {
        this.xterm.write(this.clearLine + this.prompt);
      }
    }
  }

  onRightClick(): false {
    this.dialog.open(CopyPasteMessageComponent);
    return false;
  }

  initializeTerminal() {
    console.log("BOOM");
    this.xterm = new Terminal({
      'cursorBlink': true,
      //'tabStopWidth': 8,
      //'focus': true,
      //'cols': this.cols,
      //'rows': this.rows,
      'fontSize': this.font_size,
      //'convertEol': true,
    });

    this.fitAddon = new FitAddon();
    this.attachAddon = new AttachAddon(this.ss.socket);

    this.xterm.loadAddon(this.fitAddon);
    this.xterm.loadAddon(this.attachAddon);

    this.xterm.open(this.container.nativeElement);

    this.fitAddon.fit();
    this.setupListeners();
    this.setTermDimensions();
  }

  setupListeners(){
    this.xterm.onKey((e) =>{
      if(this.currentRowPosition && this.prompt){
        this.currentRowPosition++
      }

      if(e.key == "Enter"){
        //this.resetScrollBottom();
      }

    });
  }

  setTermDimensions(c?: number, r?: number){
    if(this.ss.connectionID){
      console.log([this.ss.connectionID, this.xterm.rows, this.xterm.cols]);
      this.ws.call('core.resize_shell', [this.ss.connectionID, this.xterm.rows, this.xterm.cols]);
    }
  }

  fitTerm(){
    this.fitAddon.fit();
  }

  onFontResize(e){
    this.xterm.setOption('fontSize', this.font_size);
    this.fitTerm();
  }

  initializeWebShell(res: string) {
    this.ss.token = res;
    this.ss.connect();

    this.ss.shellConnected.subscribe((res)=> {
      this.shellConnected = res;
      this.initializeTerminal(); 
    })
  }
  
  getAuthToken() {
    return this.ws.call('auth.generate_token');
  }

  reconnect() {
    this.ss.connect();
  }

  constructor(protected _ws: WebSocketService, protected _ss: ShellService, protected _translate: TranslateService, protected _dialog: MatDialog) {
    this.ws = _ws;
    this.ss = _ss;
    this.translate = _translate;
    this.dialog = _dialog
  }
}
