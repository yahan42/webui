import { Directive, AfterViewInit, Renderer2, ElementRef, Input, OnChanges, SimpleChange } from '@angular/core';
import { AnimationBuilder, AnimationPlayer, style, animate, query, transition, trigger, keyframes } from '@angular/animations';
import { tween, keyframes as popKeyframes, styler, easing } from 'popmotion';

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

interface AnimationState {
  tween?: TweenConfig;
  keyframes?: KeyframesConfig;
}

@Directive({
  selector: '[ix-animate]',
})
export class iXAnimateDirective implements AfterViewInit, OnChanges {

  protected target: any;
  protected defaultEasing: any = easing.easeInOut;
  public player: AnimationPlayer | undefined;

  public _sState: any;
  get sState(){ return this._sState;}
  set sState(v){
    this._sState = v;
    if(this.isTweenConfig(v)){
      this.tween(v);
    } else if (this.isKeyframesConfig(v)){
      this.keyframes(v);
    }
  }

  @Input('animateWith') engine:string = 'angular'; // angular or popmotion are supported
  @Input('animateState') state?:any;
  @Input() container?:boolean = false;
  @Input() arrangement?:string;

  constructor(protected renderer: Renderer2, protected el: ElementRef, protected builder: AnimationBuilder) {
  }

  ngOnChanges(changes:SimpleChange){
    if(changes.state && !changes.state.firstChange){
      //console.log(changes.state);
      if(changes.state.currentValue.tween){
        this.tween(changes.state.currentValue.tween);
      } else if (changes.state.currentValue.keyframes){
        this.keyframes(changes.state.currentValue.keyframes);
      }
    }
  }

  ngAfterViewInit(){
    this.target = this.engine == 'popmotion' ? styler(this.el.nativeElement) : this.el.nativeElement;
    //this.runExample();
  }

  /*runExample(){
    const tweenOptions:TweenConfig = {
      from: {transform: 'translate(0px,0px) scale(1)', 'z-index': 1},
      to: {transform: 'translate(80px,100px) scale(1.25)', 'z-index': 5},
      duration: 300
    }

    const keyframeOptions:KeyframesConfig = {
      values:[
        {transform: 'translate(0px,0px) scale(1) ', 'z-index': 100},
        {transform: 'translate(300px,80px) scale(3.5) ', 'z-index': 100},
        {transform: 'translate(750px,250px) scale(2) ', 'z-index': 100},
        {transform: 'translate(0px,0px) scale(1) ', 'z-index': 100},
      ],
      times:[0, 0.25, 0.77, 1], // NOTE these are end times and not start times!
      duration: 500,
      easing: this.defaultEasing
    }

    setTimeout(() => {
      //this.sState = keyframeOptions;
      //this.sState = tweenOptions;
    }, 1000);

    setTimeout(() => {
      //this.sState = keyframeOptions;
      //this.sState = tweenOptions;
    }, 4000);

  }*/


  protected tween(options: TweenConfig | any){
    if(this.engine !== 'popmotion'){ 
      this.angularTween(options);
      return
    };

    tween(options).start(this.target.set);
  }

  protected keyframes(options: KeyframesConfig | any){
    if(this.engine !== 'popmotion'){ 
      this.angularKeyframes(options);
      return
    };
    popKeyframes(options).start(this.target.set);
  }

  protected angularTween(options: TweenConfig) {
    let angularOptions = [];

    if(options.from){
      angularOptions.push(style(options.from));
    }
    angularOptions.push(animate(options.duration, style(options.to)));

    this.runAngularAnimation(angularOptions);

  }

  protected angularKeyframes(options:KeyframesConfig){
    
    if(options.times.length !== options.values.length){
      const message = 'Keyframes Timing Mismatch!: There are ' + options.values.length + ' values, and ' + options.times.length + ' times';
      throw message
    }

    if(this.player){
      this.player.destroy();
      delete this.player;
    }

    const angularOptions = options.values.map((v, index) => {
      const time = (v) => options.duration * v;

      if(index < 1 && options.times[index] == 0){
        return animate(0, style(v));
      } else if(index < 1 && options.times[index] > 0){
        throw "Missing Keyframe!: Nothing set to run at the beginning of sequence! (time property does not contain 0)"
      }

      const duration = time(options.times[index] - options.times[index - 1]);
      return animate(duration, style(v));
    });
    
    this.runAngularAnimation(angularOptions);

  }

  runAngularAnimation(angularOptions){
    // Define a reusable animation
    const myAnimation = this.builder.build(angularOptions);

    // use the returned factory object to create a player
    this.player = myAnimation.create(this.target);

    this.player.play();
  }

  // Typeguards
  protected isTweenConfig(x: any): x is TweenConfig {
    return (x as TweenConfig).to !== undefined;
  }

  protected isKeyframesConfig(x: any): x is KeyframesConfig {
    return (x as KeyframesConfig).values !== undefined;
  }

}
