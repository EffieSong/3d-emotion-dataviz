/* CONTROLS */

/**
 * @param {THREE.camera} camera 
 */

export default class Control {    
    constructor(nearest,farest) {
        this.mouse_xy = [0, 0];
        this.mouseWheelY = 0;

        //the restricted range of the camera's postion on Z axis
        this.nearest = nearest||8; 
        this.farest = farest || -20;

        //the restricted range of the camera's postion on X axis related to mouse position
        this.rangeX = 3;

        //these are dynamic parameters related to camera's position
        this.delayed_x1 = 0;
        this.delayed_y1 = 0;
        this.delayed_mw = 0; //mw => mouse wheel

        //these are dynamic parameters related to camera's looking at
        this.delayed_x2 = 0;
        this.delayed_y2 = 0;
        this.addEventListener();
        this.isActive = true;

    }
    addEventListener() {
        document.addEventListener('mousemove', event => {
            this.mouse_xy = [event.clientX, event.clientY];
        });
        document.addEventListener('mousewheel', event => {
            this.mouseWheelY += event.wheelDeltaY * 0.001;
            this.mouseWheelY = Math.max(Math.min(this.nearest, this.mouseWheelY), this.farest); //restrict range
        }, false);
    }
    setRangeX(num){
        this.rangeX =num;
    }
    //this function should be called in the animation loop
    update(camera) {
        let easing = 0.08; //related to camera's position
        let easing2 = 0.04; //related to the point camera is looking at
        let c_height = 2.4;
        let dx = this.mouse_xy[0] - this.delayed_x1;
        let dy = this.mouse_xy[1] - this.delayed_y1;
        let dz = this.mouseWheelY - this.delayed_mw;
        this.delayed_x1 = Math.abs(dx) > 0.05 ? this.delayed_x1 + dx * easing : this.mouse_xy[0];
        this.delayed_y1 = Math.abs(dy) > 0.05 ? this.delayed_y1 + dy * easing : this.mouse_xy[1];
        this.delayed_mw = Math.abs(dz) > 0.05 ? this.delayed_mw + dz * easing : this.mouseWheelY;
        this.delayed_x2 = Math.abs(dx) > 0.05 ? this.delayed_x1 + dx * easing2 : this.mouse_xy[0];
        this.delayed_y2 = Math.abs(dy) > 0.05 ? this.delayed_y1 + dy * easing2 : this.mouse_xy[1];

        let c_x = (this.delayed_x1 / window.innerWidth - 0.5) * this.rangeX;
        let c_y = (1 - this.delayed_y1 / window.innerHeight + c_height) * 1.5;

        //p is the point camera is looking at
        let p_x = (this.delayed_x2 / window.innerWidth - 0.5) * this.rangeX;
        let p_y = (1 - this.delayed_y2 / window.innerHeight + c_height - 0.2) * 1.5; //manipulate 0.2 to change the rotation angle of the camera

        if(this.isActive){
            camera.position.x = c_x;
            camera.position.y = c_y;
            camera.position.z = this.delayed_mw + 10;
            camera.lookAt(p_x, p_y, camera.position.z - 1);
        }
        
    }

}
