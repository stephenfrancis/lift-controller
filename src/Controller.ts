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
    this.getNearestLift(request).addRequest(request);
  }

  getLifts(): Lift[] {
    return this.lifts;
  }

  getNearestLift(request: Request): Lift {
    const liftsAndDistances = this.lifts
      .map((lift) => ({
        lift: lift,
        distance: lift.getDistanceTo(request.floor, request.type),
      }))
      .sort((a, b) => a.distance - b.distance);
    // .map((obj) => {
    //   console.log(
    //     ` at floor ${
    //       request.floor
    //     }, lift ${obj.lift.getId()} [at ${obj.lift.getFloor()}] gives: ${
    //       obj.distance
    //     }`
    //   );
    //   return obj;
    // });
    if (liftsAndDistances.length === 0) {
      throw new Error(`no lifts available`);
    }
    return liftsAndDistances[0].lift;
  }

  tick(): void {
    this.lifts.forEach((lift) => lift.tick());
  }
}
