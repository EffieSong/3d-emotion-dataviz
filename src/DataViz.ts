/* An object that store the parameters of the visualization of the data */
export default class DataViz{
    cameraPositionX: number = 0; // position x of camera for the main scene.
    cameraPositionY: number = 12; // position y of camera for the main scene.
    cameraPositionZ: number = 100; // position z of camera for the main scene.
    bars: number = 3; // how many lanes are generated on the timeline.
    fontFamily: string = "dddd"; // fonts used for the text displayed on the event plane
    constructor(){
        this.cameraPositionX = 0; // position x of camera for the main scene.
        this.cameraPositionY = 12; // position y of camera for the main scene.
        this.cameraPositionZ = 100; // position z of camera for the main scene.
        this.bars = 3; // how many lanes are generated on the timeline.
        this.fontFamily = "dddd"; // fonts used for the text displayed on the event plane

    }
}