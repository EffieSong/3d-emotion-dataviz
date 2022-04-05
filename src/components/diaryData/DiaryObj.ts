export default class DiaryObj {
  id: string;
  time: string;
  type: string;
  relatedEvent: string;
  emotions: string[];
  event: string;
  thoughts: string;
  bodyReaction: string;
  nameOfFeelings: string;

  //@ts-ignore
  _correspondingMesh: THREE.Mesh;
  // _relatedLines: THREE.Line[] = []; //we store curves in object so we can remove them from the scene when event dismissed

  constructor(
    id: string,
    time: string,
    type: string,
    relatedEvent: string,
    emotions: string[],
    event: string,
    thoughts: string,
    bodyReaction: string,
    nameOfFeelings: string,

  ) {
    this.id = id;
    this.time = time;
    this.type = type;
    this.relatedEvent = relatedEvent;
    this.emotions = emotions;
    this.event = event;
    this.thoughts = thoughts;
    this.bodyReaction = bodyReaction;
    this.nameOfFeelings = nameOfFeelings;


  }
}