import { Directive, AfterViewInit, Renderer2, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
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

export interface AnimationState {
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

  @Input('animateWith') engine:string = 'angular'; // angular or popmotion are supported
  @Input('animateState') animateState?:any;

  constructor(protected renderer: Renderer2, protected el: ElementRef, protected builder: AnimationBuilder) {
  }

  ngOnChanges(changes:SimpleChanges){
    if(changes.animateState && !changes.animateState.firstChange){
      this.animateStateChanged(changes.animateState.currentValue);
    }

  }

  ngAfterViewInit(){
    this.target = this.engine == 'popmotion' ? styler(this.el.nativeElement) : this.el.nativeElement;
  }

  animateStateChanged(state){
    if(state.tween){
      this.tween(state.tween);
    } else if (state.keyframes){
      this.keyframes(state.keyframes);
    }
  }

  protected tween(options: TweenConfig | any, target = this.target){
    if(this.engine !== 'popmotion'){ 
      this.angularTween(options, target);
      return
    };

    tween(options).start(target.set);
  }

  protected keyframes(options: KeyframesConfig | any, target = this.target){
    if(this.engine !== 'popmotion'){ 
      this.angularKeyframes(options, target);
      return
    };
    popKeyframes(options).start(target.set);
  }

  protected angularTween(options: TweenConfig, target) {
    let angularOptions = [];

    if(options.from){
      angularOptions.push(style(options.from));
    }
    angularOptions.push(animate(options.duration, style(options.to)));

    this.runAngularAnimation(angularOptions, target);

  }

  protected angularKeyframes(options:KeyframesConfig, target){
    
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
    
    this.runAngularAnimation(angularOptions, target);

  }

  protected runAngularAnimation(angularOptions, target){
    // Define a reusable animation
    const myAnimation = this.builder.build(angularOptions);

    // use the returned factory object to create a player
    this.player = myAnimation.create(target);

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
