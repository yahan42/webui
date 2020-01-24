import { Directive, Input, AfterViewInit, OnDestroy, ElementRef, Renderer2, OnChanges, SimpleChanges, HostListener, EventEmitter } from '@angular/core';
import { AnimationBuilder } from '@angular/animations';
import { DragDropModule, DragDrop, DragRef, DropListRef, CdkDragDrop, CdkDragEnter } from '@angular/cdk/drag-drop';
import { iXAnimateDirective, AnimationState, TweenConfig, KeyframesConfig } from 'app/core/directives/ix-animate/ix-animate.directive';
import { styler } from 'popmotion';
import { CoreEvent } from 'app/core/services/core.service';

export interface Location {
  x: number;
  y: number;
}

export interface DragTarget {
  element: any;
  displayIndex: number;
  cdkDragRef: DragRef;
}

interface DropZoneConfig {
  disabled: boolean;
  //data?: T;
  sortingDisabled: boolean;
  autoScrollDisabled: boolean;
  //dropped: EventEmitter<CdkDragDrop<T, any>>;
  //entered: EventEmitter<CdkDragEnter<T>>;
  //connectedTo: (CdkDropList | string)[] | CdkDropList | string;
}

@Directive({
  selector: '[ix-dnd]'
})
export class iXDndDirective extends iXAnimateDirective implements AfterViewInit, OnChanges, OnDestroy {

  @Input('childSelector') childSelector: string; // CSS Selector
  @Input('sortOrder') sortOrder: string[]; // numbers as strings to avoid 0 interpreted as false

  protected layout: Location[];
  
  protected dropZone: DropListRef;
  //public dropZoneConfig: DropZoneConfig;
  protected displayList: DragTarget[] = [];
  //protected enterPredicate: (drag: CdkDrag, drop: CdkDropList) => boolean = () => true;

  /*
  protected windowWidth;
  protected mouseListener;
  protected dragTarget: DragTarget;
  protected dragImage: any;
  protected placeholder: any;
  */

  constructor(protected renderer:Renderer2, protected el:ElementRef, protected builder:AnimationBuilder, protected cdk:DragDrop) { 
    super(renderer, el, builder)
  }

  ngAfterViewInit(){
    this.target = this.engine == 'popmotion' ? styler(this.el.nativeElement) : this.el.nativeElement; 

    setTimeout(() => {
      this.mapLayout();
      console.log(this.el);

      // DropZone setup
      /*this.dropZoneConfig = {
        autoScrollDisabled:false,
        disabled: false,
        //data: T;
        sortingDisabled: false,
        autoScrollDisabled: false,
        dropped: new EventEmitter<CdkDragDrop<T, any>>(),
        entered: new EventEmitter<CdkDragEnter<T>>(),
        //connectedTo: (CdkDropList | string)[] | CdkDropList | string; // For dropping in another container
      }*/

      // Create the DropZone
      this.dropZone = this.cdk.createDropList(this.el);
      //this.dropZone.data = this.dropZoneConfig;
      /*this.dropZone.enterPredicate = (drag: DragRef<CdkDrag>, drop: DropListRef<CdkDropList>) => {
        return this.enterPredicate(drag.data, drop.data);
      };*/

      //DropZone Subscriptions
      this.dropZone.dropped.subscribe(e => {this.onDrop(e)})
      this.dropZone.entered.subscribe(e => {this.onDrop(e)})
      this.dropZone.exited.subscribe(e => {this.onDrop(e)})
      this.dropZone.beforeStarted.subscribe(e => {this.onDrop(e)})
      this.dropZone.sorted.subscribe(e => {this.onDrop(e)})
      console.log(this.dropZone);

      for(let i = 0; i < this.el.nativeElement.children.length; i++){
        const child = this.el.nativeElement.children[i];
        this.addListeners(child, i);
      }
    }, 1500 )

  }

  ngOnDestroy(){
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes.animateState && !changes.animateState.firstChange){
      this.animateStateChanged(changes.animateState.currentValue);
    }

    if(changes.sortOrder && !changes.sortOrder.firstChange){
      this.mapLayout();
      setTimeout(() => {
        this.updateChildren();
      }, 50);
    }
  }

  onEnter(e){
    console.log(e);
  }

  onDrop(e){
    console.log(e);
  }

  /*onDrag(e, el, displayIndex){

    //if(e.type == 'drop' || e.type == 'dragend')console.log(e.type);

    switch(e.type){
    case 'dragstart':
      this.dragTarget = this.displayList[displayIndex];
      this.placeholder = el.cloneNode(true);
      this.placeholder.style.position = "fixed"; 

      this.renderer.appendChild(el.parentNode, this.placeholder);
      this.renderer.appendChild(el.parentNode, this.dragImage);
      e.dataTransfer.setDragImage(this.dragImage, 0, 0);
      break;
    case 'dragend':
      e.preventDefault();
      this.renderer.removeChild(el.parentNode, this.placeholder);
      this.renderer.removeChild(el.parentNode, this.dragImage);
      break;
    case 'dragover':
      e.preventDefault();
      break;
    case 'dragenter':
      e.preventDefault();
      break;
    case 'dragleave':
      e.preventDefault();
      break;
    case 'drag':
      e.preventDefault();
      //this.followCursor( this.placeholder, {x: e.x, y: e.y} )
      console.log(e.type);
      break;
    case 'drop': 
      this.renderer.removeChild(el.parentNode, this.placeholder);
      this.renderer.removeChild(el.parentNode, this.dragImage);
      e.preventDefault();
      break;
    }

  }*/

  updateChildren(duration: number = 150){
    
    let children = this.el.nativeElement.children;

    if(this.sortOrder && this.sortOrder.length == children.length){

      for(let i = 0; i < children.length; i++){
        const child = children[i];
        const position = parseInt(this.sortOrder[i]);
        
        const nextIndex = position == children.length ? 0 : position;
  
        const start = {
          x: this.layout[i].x,
          y: this.layout[i].y
        }

        const end = {
          x: this.layout[nextIndex].x,
          y: this.layout[nextIndex].y
        }

        const location = { x: end.x - start.x, y: end.y - start.y }

        this.moveChild(child, location, duration);

      }
    
    } 

  }

  moveChild(child: any, location: Location, duration: number = 150, onComplete?:any){
    const options = {
      //to: { transform: 'translate(' + location.x + 'px, ' + location.y + 'px)'},
      to: { transform: 'translate3d(' + location.x + 'px, ' + location.y + 'px, 0px)'},
      duration: duration
    }

    const target = this.engine == 'popmotion' ? styler(child) : child;
    this.tween(options, target);

    if(onComplete){
      setTimeout(() => { onComplete() } , duration);
    }
  }

  followCursor(child: any, location: Location){
    child.left = location.x.toString() + 'px';
    child.top = location.y.toString() + 'px';
  }

  translateCursor(cursor:Location, layoutIndex): Location {
    // get distance between cursor and element location
    const html = this.layout[layoutIndex];
    return { x: cursor.x - html.x, y: cursor.y - html.y}
  }

  mapLayout(){
      let children = this.el.nativeElement.children;
      let layout: Location[] = [];

      for(let i = 0; i < children.length; i++){
        const child = children[i];
        layout.push({x: child.offsetLeft, y: child.offsetTop})
      }

      this.layout = layout;
    
  }

  addListeners(el, index){

    const dragTarget = {
      element: el,
      displayIndex: index,
      cdkDragRef: this.cdk.createDrag(el),
    }

    //dragTarget.cdkDragRef._dropContainer = this.dropZone;

    this.displayList[index] = dragTarget;

    this.renderer.listen(el, 'click', (e) => { 
      //console.log(this.displayList[index]);
      /*if(dragTarget.cdkDragRef._hasStartedDragging){
        console.log('DRAGGING!');
      }*/
    });

    // Listen for drag events via cdk
    dragTarget.cdkDragRef.started.subscribe((e) => { this.onDragEvent({name:'Started', data: dragTarget});});
    dragTarget.cdkDragRef.released.subscribe((e) => { this.onDragEvent({name:'Released', data: dragTarget});});
    dragTarget.cdkDragRef.ended.subscribe((e) => { this.onDragEvent({name:'Ended', data: dragTarget});});
    /*dragTarget.cdkDragRef.moved.subscribe((e) => { this.onDragEvent({name:'Moved', data: dragTarget});});
    dragTarget.cdkDragRef.exited.subscribe((e) => { this.onDragEvent({name:'Exited', data: dragTarget});});
    */
    dragTarget.cdkDragRef.entered.subscribe((e) => { this.onDragEvent({name:'Entered', data: dragTarget});});
    dragTarget.cdkDragRef.dropped.subscribe((e) => { this.onDragEvent({name:'Dropped', data: dragTarget});});

  }

  onDragEvent(e:CoreEvent){

    //let el = e.data.source._rootElement;
    let el = e.data.element;
    if(e.name == 'Dropped'){
      console.log(e);
    }

    switch(e.name){
      case 'Ended':
      case 'Released':
        //console.log(e.name);
        el.style['box-shadow'] = '';
        el.style['z-index'] = 1;
        el.style['transform'] = '';
        //this.moveChild(el,this.layout[e.data.displayIndex], e.data.cdkDragRef.reset());
        e.data.cdkDragRef.reset();
        break;
      case 'Started':
        el.style['box-shadow'] = `0 10px 10px rgba(0,0,0,0.5)`;
        el.style['z-index'] = 100;
        el.style['transform'] = 'scale(1.05)';
        break;
    }
  }


}
