import Feature from "./feature";

// Duration of parts of days. Sum must be 1
const nightToDayDuration = 0.25;
const dayDuration = 0.25;
const dayToNightDuration = 0.25;
const nightDuration = 0.25;

const nightAlpha = 0.6;

export default class Environment extends Feature {
  preload(wop) {
    super.preload(wop);
  }

  create(wop) {
    super.create(wop);

    // Prepare scene here
    wop.scene.cameras.main.alpha = 1;
    wop.day = true;

    wop.nightShade = wop.scene.add.rectangle(0, 0, 1920, 1920, 0x000000, 1);
    wop.nightShade.depth = 50;
    wop.nightShade.setOrigin(0, 0);
  }

  update(wop) {
    super.update(wop);

    // Game frame update logic here
    const diff = new Date () - (wop.state.state.startGameTime -0);
    wop.cycleDuration = 600*1000;
    wop.timeOfDay = (diff / wop.cycleDuration) % 1;
    //return;
    var tdVal;
    if (wop.timeOfDay < nightToDayDuration) {
        // night -> day
        tdVal = EasingFunctions.easeInOutCubic(wop.timeOfDay/nightToDayDuration);
        wop.nightShade.alpha = nightAlpha * (1 - tdVal);
    } else if (wop.timeOfDay < nightToDayDuration + dayDuration) {
        // day
        tdVal = EasingFunctions.easeInOutCubic((wop.timeOfDay - nightToDayDuration)/dayDuration);
        wop.nightShade.alpha = 0; 
    } else if (wop.timeOfDay < nightToDayDuration + dayDuration + dayToNightDuration) {
        // day -> night
        tdVal = EasingFunctions.easeInOutCubic((wop.timeOfDay - nightToDayDuration -dayDuration)/dayToNightDuration);
        wop.nightShade.alpha = tdVal * nightAlpha; 
    } else {
        // night
        tdVal = EasingFunctions.easeInOutCubic((wop.timeOfDay - nightToDayDuration -dayDuration -dayToNightDuration)/nightDuration);
        wop.nightShade.alpha = nightAlpha;
    }
  }

  onSocketMessage(wop, message) {
    super.onSocketMessage(wop, message);
  }
}

const EasingFunctions = {
    // no easing, no acceleration
    linear: t => t,
    // accelerating from zero velocity
    easeInQuad: t => t*t,
    // decelerating to zero velocity
    easeOutQuad: t => t*(2-t),
    // acceleration until halfway, then deceleration
    easeInOutQuad: t => t<.5 ? 2*t*t : -1+(4-2*t)*t,
    // accelerating from zero velocity 
    easeInCubic: t => t*t*t,
    // decelerating to zero velocity 
    easeOutCubic: t => (--t)*t*t+1,
    // acceleration until halfway, then deceleration 
    easeInOutCubic: t => t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1,
    // accelerating from zero velocity 
    easeInQuart: t => t*t*t*t,
    // decelerating to zero velocity 
    easeOutQuart: t => 1-(--t)*t*t*t,
    // acceleration until halfway, then deceleration
    easeInOutQuart: t => t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t,
    // accelerating from zero velocity
    easeInQuint: t => t*t*t*t*t,
    // decelerating to zero velocity
    easeOutQuint: t => 1+(--t)*t*t*t*t,
    // acceleration until halfway, then deceleration 
    easeInOutQuint: t => t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t
};
