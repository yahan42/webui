import { Directive, Input, AfterViewInit, OnDestroy, ElementRef, Renderer2, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { AnimationBuilder } from '@angular/animations';
import { iXAnimateDirective, AnimationState, TweenConfig, KeyframesConfig } from 'app/core/directives/ix-animate/ix-animate.directive';
import { styler } from 'popmotion';

export interface Location {
  x: number;
  y: number;
}

export interface DragTarget {
  element: any;
  startLocation?: Location;
  currentLocation?: Location;
  displayIndex: number;
  dragListener?: any;
  dropListener?: any;
  dragStartListener: any;
  dragEndListener?: any; 
  dragOverListener?: any; 
  dragEnterListener?: any; 
  dragLeaveListener?: any; 
}

@Directive({
  selector: '[ix-dnd]'
})
export class iXDndDirective extends iXAnimateDirective implements AfterViewInit, OnChanges, OnDestroy {

  @Input('childSelector') childSelector: string; // CSS Selector
  @Input('sortOrder') sortOrder: string[]; // numbers as strings to avoid 0 interpreted as false

  protected layout: Location[];
  protected windowWidth;
  protected mouseListener;
  protected displayList: DragTarget[] = [];
  protected dragTarget: DragTarget;
  protected dragImage: any;
  protected placeholder: any;

  constructor(protected renderer:Renderer2, protected el:ElementRef, protected builder:AnimationBuilder) { 
    super(renderer, el, builder)
  }

  ngAfterViewInit(){
    this.target = this.engine == 'popmotion' ? styler(this.el.nativeElement) : this.el.nativeElement; 

    setTimeout(() => {
      this.mapLayout();
      console.log(this.el);
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

  onDrag(e, el, displayIndex){

    if(e.type == 'drop' || e.type == 'dragend')console.log(e.type);

    switch(e.type){
    case 'dragstart':
      this.dragTarget = this.displayList[displayIndex];
      this.placeholder = el.cloneNode(true);
      this.placeholder.style.position = "fixed"; /*this.placeholder.style.top = "500px"; this.placeholder.style.left = "500px";*/

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
      this.followCursor( this.placeholder, {x: e.x, y: e.y} )
      break;
    case 'drop': 
      this.renderer.removeChild(el.parentNode, this.placeholder);
      this.renderer.removeChild(el.parentNode, this.dragImage);
      e.preventDefault();
      break;
    }

  }

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

  moveChild(child: any, location: Location, duration: number = 150){
    const options = {
      to: { transform: 'translate(' + location.x + 'px, ' + location.y + 'px)'},
      duration: duration
    }

    const target = this.engine == 'popmotion' ? styler(child) : child;
    this.tween(options, target);
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
    this.renderer.setProperty(el, 'draggable', true);

    // Deal with ugly drag image
    this.dragImage = this.renderer.createElement('div');
    this.renderer.setStyle(this.dragImage, 'display', 'none');


    const dragTarget = {
      element: el,
      dragListener: this.renderer.listen(el, 'drag', (e) => {this.onDrag(e, el, index)} ),
      dropListener: this.renderer.listen(el, 'drop', (e) => {this.onDrag(e, el, index)} ),
      dragStartListener: this.renderer.listen(el, 'dragstart', (e) => {this.onDrag(e, el, index)} ),
      dragEndListener: this.renderer.listen(el, 'dragend', (e) => {this.onDrag(e, el, index)} ),
      dragOverListener: this.renderer.listen(el, 'dragover', (e) => {this.onDrag(e, el, index)} ),
      dragEnterListener: this.renderer.listen(el, 'dragenter', (e) => {this.onDrag(e, el, index)} ),
      //dragLeaveListener: this.renderer.listen(el, 'dragleave', (e) => {this.onDrag(e, el, index)} ),
      displayIndex: index
    }

    this.displayList[index] = dragTarget;
  }


}
