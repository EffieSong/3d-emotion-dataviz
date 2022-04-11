/* An object that store the parameters of the visualization of the data */
export default class DataViz{
    cameraPositionX: number = 0; // position x of camera for the main scene.
    cameraPositionY: number = 12; // position y of camera for the main scene.
    cameraPositionZ: number = 100; // position z of camera for the main scene.
    bars: number = 4; // how many lanes are generated on the timeline.
    eventTypes: string[]; 
    fontFamily: string = "dddd"; // fonts used for the text displayed on the event plane
    scale:number = 1;
    rowSpace:number = 5; // space between each emotion ball in z- axis
    colSpace:number = 2; // width of each bar

    constructor(){
        this.cameraPositionX = 0; // position x of camera for the main scene.
        this.cameraPositionY = 12; // position y of camera for the main scene.
        this.cameraPositionZ = 100; // position z of camera for the main scene.
        
        this.bars = 4; // how many lanes are generated on the timeline.
        this.eventTypes =['work','life','love','friend'];
        this.fontFamily = "dddd"; // fonts used for the text displayed on the event plane
        
        this.scale=1;
        this.rowSpace = 5;
        this.colSpace = 2;
    }
}