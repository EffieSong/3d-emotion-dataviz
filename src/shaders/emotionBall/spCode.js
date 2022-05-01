/* eslint-disable */

// Note this function is converted into a string at runtime
// Don't try and call external function inside your SP code
// If you want to bring in extneral input use the input() function

export function spCode() {
    let size = input(19, 10, 50.0);
      
    let gyroidSteps = input(.09, 0, .1)
    let s = getSpace() + .3;
  
    let col = vec3(1, 1, 1.5) + normal * .2;
    metal(.2);
    shine(.5);
    col -= length(s);
    color(col);
  
    s += time *.1;
    setSDF(min(gyroidSteps, sin(s.x * size) + sin(s.y * size) + sin(s.z * size)));
    intersect();
    sphere(.5);  
  }