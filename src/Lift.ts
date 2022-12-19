export type IntentionState = "GOING_UP" | "GOING_DOWN" | "WAITING";
export type ActualState =
  | "GOING_UP"
  | "GOING_DOWN"
  | "DOORS_OPENING"
  | "DOORS_CLOSING"
  | "DOORS_OPEN_WAITING"
  | "DOORS_CLOSED_WAITING";
export type RequestType =
  | "FROM_OUTSIDE_GOING_UP"
  | "FROM_OUTSIDE_GOING_DOWN"
  | "FROM_INSIDE";
export interface Request {
  type: RequestType;
  floor: number;
  callback: (lift: Lift) => void;
}

const COUNTER: Record<ActualState, number> = {
  GOING_UP: 10,
  GOING_DOWN: 10,
  DOORS_OPENING: 5,
  DOORS_CLOSING: 5,
  DOORS_OPEN_WAITING: 5,
  DOORS_CLOSED_WAITING: 1,
};

export class Lift {
  private id: string;
  private intentionState: IntentionState;
  private actualState: ActualState;
  private floor: number;
  private bottomFloor: number;
  private topFloor: number;
  private requests: Request[];
  private countDown: number;

  constructor(id: string, bottomFloor: number, topFloor: number) {
    if (topFloor < bottomFloor) {
      throw new Error(
        `top floor (${topFloor}) must be greater than or equal to bottom floor (${bottomFloor})`
      );
    }
    this.id = id;
    this.actualState = "DOORS_CLOSED_WAITING";
    this.intentionState = "WAITING";
    this.floor = bottomFloor;
    this.bottomFloor = bottomFloor;
    this.topFloor = topFloor;
    this.countDown = 0;
    this.requests = [];
  }

  addRequest(request: Request): void {
    if (request.floor > this.topFloor || request.floor < this.bottomFloor) {
      throw new Error(
        `invalid floor: ${request.floor}, lift ${this.id} has range: ${this.bottomFloor} - ${this.topFloor}`
      );
    }
    if (
      this.requests.find(
        (req) => req.floor === request.floor && req.type === request.type
      )
    ) {
      return; // ignore any request we already have;
    }
    this.requests.push(request);
  }

  getId(): string {
    return this.id;
  }

  getFloor(): number {
    return this.floor;
  }

  pressButton(floor: number, callback: (lift: Lift) => void): void {
    this.addRequest({
      type: "FROM_INSIDE",
      floor,
      callback,
    });
  }

  tick(): void {
    if (this.countDown > 0) {
      this.countDown -= 1;
    } else {
      this.finalCountdown();
    }
  }

  finalCountdown(): void {
    switch (this.actualState) {
      case "GOING_UP":
      case "GOING_DOWN":
        this.moveToNextFloor();
        if (this.hasRequestsForThisFloor()) {
          this.actualState = "DOORS_OPENING";
          console.log(`lift ${this.id} opening at floor ${this.floor}`);
        } else {
          console.log(`lift ${this.id} passing floor ${this.floor}`);
        }
        break;
      case "DOORS_OPENING":
        this.actualState = "DOORS_OPEN_WAITING";
        break;
      case "DOORS_OPEN_WAITING":
        this.actionRequestsForThisFloor();
        this.actualState = "DOORS_CLOSING";
        break;
      case "DOORS_CLOSING":
        this.actualState = "DOORS_CLOSED_WAITING";
        break;
      case "DOORS_CLOSED_WAITING":
        this.setOffIfRemainingRequests();
        break;
    }
    this.countDown = COUNTER[this.actualState];
  }

  moveToNextFloor(): void {
    if (["GOING_UP", "GOING_DOWN"].indexOf(this.actualState) === -1) {
      throw new Error(`not moving, status: ${this.actualState}`);
    }
    this.floor += this.actualState === "GOING_UP" ? 1 : -1;
    if (this.floor > this.topFloor || this.floor < this.bottomFloor) {
      throw new Error(
        `invalid floor: ${this.floor}, lift ${this.id} has range: ${this.bottomFloor} - ${this.topFloor}`
      );
    }
  }

  hasRequestsForThisFloor(): boolean {
    return !!this.requests.find((req) => req.floor === this.floor);
  }

  actionRequestsForThisFloor(): void {
    // fire callbacks - they may add new requests
    // can't use forEach as this.requests may be changed during loop
    let i = 0;
    while (i < this.requests.length) {
      if (this.requests[i].floor === this.floor) {
        this.requests[i].callback(this);
      }
      i += 1;
    }
    i = 0;
    while (i < this.requests.length) {
      if (this.requests[i].floor === this.floor) {
        this.requests.splice(i, 1); // delete request
      } else {
        i += 1;
      }
    }
  }

  setOffIfRemainingRequests(): void {
    // if (this.requests.length > 0) {
    //   console.log(
    //     `setOffIfRemainingRequests() requests: ${this.requests.map(
    //       (req) => req.type + ": " + req.floor
    //     )}`
    //   );
    // }
    const requestsInSameDirection = this.requests.find(
      (req) =>
        (this.intentionState === "GOING_UP" &&
          req.floor > this.floor &&
          req.type !== "FROM_OUTSIDE_GOING_DOWN") ||
        (this.intentionState === "GOING_DOWN" &&
          req.floor < this.floor &&
          req.type !== "FROM_OUTSIDE_GOING_UP")
    );
    if (requestsInSameDirection && this.intentionState !== "WAITING") {
      this.actualState = this.intentionState;
      console.log(`lift ${this.id} has further requests ${this.actualState}`);
      return;
    }
    const nextRequest = this.requests.sort(
      (a, b) => Math.abs(a.floor - this.floor) - Math.abs(b.floor - this.floor)
    );
    let newIntention: IntentionState = null;
    for (let i = 0; !newIntention && i < nextRequest.length; i += 1) {
      newIntention =
        nextRequest[i].floor > this.floor
          ? "GOING_UP"
          : nextRequest[i].floor < this.floor
          ? "GOING_DOWN"
          : null;
    }
    this.intentionState = newIntention || "WAITING";
    if (this.intentionState !== "WAITING") {
      this.actualState = this.intentionState;
      console.log(`lift ${this.id} has requests ${this.intentionState}`);
    }
  }
}
