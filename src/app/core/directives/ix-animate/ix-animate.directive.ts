import { Directive, AfterViewInit, Renderer2, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AnimationBuilder, style, animate, query, transition, trigger, keyframes } from '@angular/animations';
import { tween, keyframes as pKeyframes, styler, easing } from 'popmotion';

export interface TweenConfig {
  from?: any;
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
export class iXAnimateDirective implements AfterViewInit, OnChanges {

  protected target: any;
  protected defaultEasing: any = easing.easeInOut;

  public _sState: any;
  get sState(){ return this._sState;}
  set sState(v){
    this._sState = v;
    if(this.isTweenConfig(v)){
      this.angularTween(v);
      console.log("Tween!");
    } else if (this.isKeyframesConfig(v)){
      this.angularKeyframes(v);
      console.log("Keyframes!");
    }
  }

  @Input('animateWith') engine:string = 'angular'; // angular or popmotion are supported
  @Input('state') state?:any;
  @Input() container?:boolean = false;
  @Input() arrangement?:string;

  constructor(protected renderer: Renderer2, protected el: ElementRef, protected builder: AnimationBuilder) {
  }

  ngOnChanges(changes:SimpleChanges){
    if(changes.state){
      console.log(changes.state);
    }
  }

  ngAfterViewInit(){
    this.target = this.engine == 'popmotion' ? styler(this.el.nativeElement) : this.el.nativeElement;

    setTimeout(() => {
      const tweenOptions:TweenConfig = {
        from: {transform: 'translate(1920px,0)', 'z-index': 1},
        to:{transform: 'translate(680px,100px)', 'z-index': 5},
        duration: 300
      }

      const keyframeOptions = {
        values:[
          /*{x: 0, y: 0, scale: 1, 'z-index': 100},
          {x: 300, y: 80, scale: 1.5, 'z-index': 100},
          {x: 750, y: '0', scale: 1, 'z-index': 100},*/
          {transform: 'translate(0,0) scale(1) ', 'z-index': 100},
          {transform: 'translate(300,80) scale(1.5) ', 'z-index': 100},
          {transform: 'translate(750,0) scale(1) ', 'z-index': 100},
        ],
        times:[0, 0.45, 1],
        duration: 500,
        easing: this.defaultEasing
      }

      this.sState = keyframeOptions;
      //this.sState = tweenOptions;

    }, 3000);

  }


  protected tween(options: TweenConfig | any){
    console.log(this.engine);
    if(this.engine !== 'popmotion'){ 
      this.angularTween(options);
      return
    };

    tween(options).start(this.target.set);
  }

  protected keyframes(options: KeyframesConfig | any){
    if(this.engine !== 'popmotion'){ 

      return
    };
    pKeyframes(options).start(this.target.set);
  }

  protected angularTween(options: TweenConfig) {
    let angularOptions = [
    ];

    if(options.from){
      angularOptions.push(style(options.from));
    }
    angularOptions.push(animate(options.duration, style(options.to)));
    console.log(angularOptions);
    
    // Define a reusable animation
    const myAnimation = this.builder.build(angularOptions);

    // use the returned factory object to create a player
    const player = myAnimation.create(this.target);

    player.play();
  }

  protected angularKeyframes(options:KeyframesConfig){
    console.log(options);
    const frames = options.values.map((v, index) => {
      const offset = options.times[index];
      
      
      v.offset = offset;
      console.log(v);
      return style(v);
    });
    console.log(frames);

    // Define a reusable animation
    const myAnimation = this.builder.build([
      animate(options.duration, keyframes(frames))
    ]);
    const player = myAnimation.create(this.target);
    player.play;
  }

  // Typeguards
  protected isTweenConfig(x: any): x is TweenConfig {
    return (x as TweenConfig).to !== undefined;
  }

  protected isKeyframesConfig(x: any): x is KeyframesConfig {
    return (x as KeyframesConfig).values !== undefined;
  }

}
