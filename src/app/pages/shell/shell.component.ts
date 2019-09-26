import { Component, ElementRef, Input, OnChanges, OnDestroy, AfterViewInit, SimpleChange, ViewChild } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { ShellService, WebSocketService } from "../../services/";
import helptext from "./../../helptext/shell/shell";
import { CopyPasteMessageComponent } from "./copy-paste-message.component";
import { Terminal } from 'xterm';
import { AttachAddon } from 'xterm-addon-attach';
import { FitAddon } from 'xterm-addon-fit';

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
  cols: number = 80;
  rows: number = 25;
  rowCount: number;
  font_size = 14;
  public token: any;
  public xterm: any;
  public fitAddon: FitAddon;
  public resize_terminal = true;
  protected shellSubscription: any;
  public lastWidth: number;
  public lastHeight: number;

  protected ws: WebSocketService;
  protected ss: ShellService;
  protected translate: TranslateService;
  protected snackbar: MatSnackBar;
  public usage_tooltip = helptext.usage_tooltip;

  clearLine = "\u001b[2K\r";
  public shellConnected: boolean = false;

  ngAfterViewInit() {
    this.getAuthToken().subscribe((res) => {
      this.initializeWebShell(res);
      this.shellSubscription = this.ss.shellOutput.subscribe((value) => {
        if (value !== undefined){
          //this.xterm.write(value); 
        } 
      }); 
      this.initializeTerminal(); });
      this.overflowParent('hidden'); 
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
    //this.setTermDimensions();
    //this.xterm.resize(this.rows, this.cols);
  }

  overflowParent(rule: string){
    let target:HTMLElement = document.querySelector('.rightside-content-hold');
    target.style['overflow-y'] = rule;
  }

  resetDefault() {
    this.font_size = 14;
  }

  ngOnChanges(changes: {
    [propKey: string]: SimpleChange
  }){
    /*const log: string[] = [];
    for (const propName in changes) {
      const changedProp = changes[propName];
      console.log(changedProp);
      // reprint prompt
      if (propName === 'prompt' && this.xterm != null) {
        this.xterm.write(this.clearLine + this.prompt);
      }
    }*/
  }

  onRightClick(): false {
    this.snackbar.openFromComponent(CopyPasteMessageComponent);

    return false;
  }

  initializeTerminal() {
    this.setTermDimensions();
    //this.xterm = new (<any>window).Terminal({
    this.xterm = new Terminal({
      'cursorBlink': true,
      'tabStopWidth': 8,
      //'focus': true,
      'cols': this.cols,
      'rows': this.rows,
    });

    this.xterm.open(this.container.nativeElement, true);
    
    // Xterm Addons
    const attachAddon = new AttachAddon(this.ss.socket);
    this.xterm.loadAddon(attachAddon);
    this.fitAddon = new FitAddon();
    this.xterm.loadAddon(this.fitAddon);
    // Make the terminal's size and geometry fit the size of #terminal-container
    this.fitTerm();

    this.xterm._initialized = true;

    this.setupListeners();

    this.forceDimensions();
  }

  setupListeners(){
    /*this.xterm.onKey((e) =>{
      if(e.key == "Enter"){
        console.log(e);
      }
    });*/
  }

  fitTerm(){
    //this.fitAddon.fit();
    //this.setTermDimensions();

    const dimensions = this.getTermDimensions();
    const vp:HTMLElement = document.querySelector('.terminal .xterm-viewport'); 
    const scr:HTMLElement = document.querySelector('.terminal .xterm-screen'); 
    const xtl:HTMLElement = document.querySelector('.terminal canvas.xterm-text-layer'); 
    const xsl:HTMLElement = document.querySelector('.terminal canvas.xterm-selection-layer'); 
    const xll:HTMLElement = document.querySelector('.terminal canvas.xterm-link-layer'); 
    const xcl:HTMLElement = document.querySelector('.terminal canvas.xterm-cursor-layer'); 

    let elements = [vp, scr, xtl, xsl, xll, xcl];

    for(let i = 0; i < elements.length; i++){
      if(i < 2){
        this.fitCanvas(elements[i], dimensions, false);
      } else {
        this.fitCanvas(elements[i], dimensions, true);
      }
    }

    //this.xterm.fit();
    //vp.style.height = dimensions.height.toString() + 'px';
    
    this.setTermDimensions();
    this.fitAddon.fit();
  }

  fitCanvas(el,dimensions, attrs?:boolean){
    el.style.width = dimensions.width.toString() + 'px';
    el.style.height = dimensions.height.toString() + 'px';
    if(attrs){ 
      el.setAttribute('width', dimensions.width);
      el.setAttribute('height', dimensions.height);
    }
    
  }

  /*getRowCount(){
    const rows = document.querySelectorAll('.terminal .xterm-rows > div'); 
    return rows.length;
  }*/

  getTermDimensions(){
    const target:HTMLElement = document.querySelector('.terminal .xterm-text-layer'); 
    return !target ? null : {width: target.offsetWidth, height: target.offsetHeight};
  }

  getCursorDimensions(){
    const target:HTMLElement = document.querySelector('.terminal .xterm-cursor'); 
    return {
      width: target ? target.offsetWidth : this.font_size * 0.45 , 
      height: target ? target.offsetHeight : this.font_size
    };
  }

  getTermParentDimensions(){
    const target:HTMLElement = document.querySelector('#terminal'); 
    return {width: target.offsetWidth, height: target.offsetHeight};
  }

  setTermDimensions(c?: number, r?: number){
    let dimensions = this.getTermDimensions();
    if(!dimensions){ return; }
    if(!c || !r){
      //let dimensions = this.getTermParentDimensions();
      const cursor = this.getCursorDimensions();
      const cols = Math.floor(dimensions.width / (cursor.width));
      const rows = Math.floor((dimensions.height / cursor.height) );
      this.cols = cols;
      this.rows = rows;
    } else {
      this.cols = c;
      this.rows = r;
    }

    //this.cols = 80;

    if(this.xterm){
      //this.xterm.setOption('rows', this.rows);
      //this.xterm.setOption('cols', this.cols);
      this.xterm.resize(this.cols, this.rows);
    }
  }

  forceDimensions(bytes?: boolean){
    console.log(this.xterm);
    console.log('COLS: ' + this.cols + ', ROWS: ' + this.rows);
    this.fitTerm();
    //this.setTermDimensions();
    if(bytes){
      this.ss.configTTY(this.rows, this.cols, this.xterm);
    }
  }

  initializeWebShell(res: string) {
    this.ss.token = res;
    this.ss.connect();

    this.ss.shellConnected.subscribe((res)=> {
      this.shellConnected = res;
    })
  }

  getAuthToken() {
    return this.ws.call('auth.generate_token');
  }

  reconnect() {
    this.ss.connect();
  }

  constructor(protected _ws: WebSocketService, protected _ss: ShellService, protected _translate: TranslateService, protected _snackbar: MatSnackBar) {
    this.ws = _ws;
    this.ss = _ss;
    this.translate = _translate;
    this.snackbar = _snackbar
  }
}
