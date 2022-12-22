import { Lift, Request } from "./Lift";

export class Controller {
  private lifts: Lift[];

  constructor(bottomFloor: number, topFloor: number, numberOfLists: number) {
    this.lifts = [];
    for (let i = 0; i < numberOfLists; i += 1) {
      this.lifts.push(new Lift(String(i), bottomFloor, topFloor));
    }
  }

  addRequest(request: Request): void {
    // choose lift - come up with better solution
    const lift = Math.floor(Math.random() * this.lifts.length);
    this.lifts[lift].addRequest(request);
  }

  getLifts(): Lift[] {
    return this.lifts;
  }

  tick(): void {
    this.lifts.forEach((lift) => lift.tick());
  }
}
