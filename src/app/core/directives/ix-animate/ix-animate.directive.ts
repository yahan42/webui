import { Directive, AfterViewInit, Renderer2, ElementRef, Input } from '@angular/core';
import { AnimationBuilder, style, animate, query, transition, trigger } from '@angular/animations';
import { tween, keyframes, styler, easing } from 'popmotion';

export interface TweenConfig {
  from: any;
  to: any;
  duration: number | string;
  easing?: any;  // popmotion only?
}

export interface KeyframesConfig {
  values: any[];
  times: number[];
  duration: number;
  easing?: any;  // popmotion only?
}

@Directive({
  selector: '[ix-animate]',
})
export class iXAnimateDirective implements AfterViewInit {

  protected target: any;
  protected defaultEasing: any = easing.easeInOut;
  @Input('engine') engine:string = 'native'; 
  @Input() container?:boolean = false;
  @Input() arrangement?:string;

  constructor(protected renderer: Renderer2, protected el: ElementRef, protected builder: AnimationBuilder) {
    console.log("iXAnimateDirective")
  }

  ngAfterViewInit(){
    this.target = this.engine == 'popmotion' ? styler(this.el.nativeElement) : this.el.nativeElement;

    setTimeout(() => {
      const tweenOptions:TweenConfig = {
        from: {transform: 'translate(0px)', 'z-index': 1},
        to:{transform: 'translate(680px)', 'z-index': 5},
        duration: 200
      }

      const keyframeOptions = {
        values:[
          {x: 0, y: 0, scale: 1, 'z-index': 100},
          {x: 300, y: 80, scale: 1.5, 'z-index': 100},
          {x: 750, y: '0', scale: 1, 'z-index': 100},
        ],
        times:[0, 0.45, 1],
        duration: 500,
        easing: this.defaultEasing
      }

      //this.keyframes(keyframeOptions);
      this.tween(tweenOptions);
    }, 3000);

  }


  tween(options: TweenConfig | any){
    if(this.engine !== 'popmotion'){ 
      this.makeAnimation(options);
      return
    };

    tween(options).start(this.target.set);
  }

  keyframes(options: KeyframesConfig | any){
    if(this.engine !== 'popmotion'){ return};
    keyframes(options).start(this.target.set);
  }

  makeAnimation(options: TweenConfig ) {
    
    // Define a reusable animation
    const myAnimation = this.builder.build([
      style(options.from),
      animate(options.duration, style(options.to))
    ]);

    // use the returned factory object to create a player
    const player = myAnimation.create(this.target);

    player.play();
  }

}
