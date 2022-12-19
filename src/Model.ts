import { Controller } from "./Controller";
import { Lift } from "./Lift";

interface Person {
  id: number;
  fromFloor: number;
  toFloor: number;
  lift: Lift | null;
}

const NUMBER_OF_PEOPLE = 3;
const NUMBER_OF_LIFTS = 1;
const NUMBER_OF_FLOORS = 10;

export class Model {
  private controller: Controller;
  private people: Person[];
  private completed: number;

  constructor() {
    this.controller = new Controller(0, NUMBER_OF_FLOORS, NUMBER_OF_LIFTS);
    this.people = [];
    this.completed = 0;
    this.setupPeople();
    const interval = setInterval(() => {
      this.controller.tick();
      // if ((this.completed = NUMBER_OF_PEOPLE)) {
      //   clearInterval(i);
      // }
    }, 100);
  }

  setupPeople(): void {
    for (let i = 0; i < NUMBER_OF_PEOPLE; i += 1) {
      setTimeout(() => {
        this.setupPerson(i);
      }, i * 3000);
    }
  }

  setupPerson(id: number): void {
    const p: Person = {
      id,
      fromFloor: Math.floor(Math.random() * NUMBER_OF_FLOORS),
      toFloor: Math.floor(Math.random() * NUMBER_OF_FLOORS),
      lift: null,
    };
    if (p.fromFloor === p.toFloor) {
      p.toFloor = p.fromFloor === 0 ? 1 : p.fromFloor - 1;
    }
    this.people.push(p);
    console.log(
      `Person ${p.id} is waiting at floor ${p.fromFloor} to go to ${p.toFloor}`
    );
    this.controller.addRequest({
      floor: p.fromFloor,
      type:
        p.toFloor > p.fromFloor
          ? "FROM_OUTSIDE_GOING_UP"
          : "FROM_OUTSIDE_GOING_DOWN",
      callback: (lift: Lift) => {
        this.personEntersLift(p, lift);
      },
    });
  }

  personEntersLift(p: Person, lift: Lift): void {
    console.log(
      `Person ${p.id} enters Lift ${lift.getId()} at floor ${lift.getFloor()}`
    );
    if (lift.getFloor() !== p.fromFloor) {
      throw new Error(`incorrect entry floor`);
    }
    lift.pressButton(p.toFloor, (lift2: Lift) => {
      this.personExitsLift(p, lift2);
    });
  }

  personExitsLift(p: Person, lift: Lift): void {
    console.log(
      `Person ${p.id} exits Lift ${lift.getId()} at floor ${lift.getFloor()}`
    );
    if (lift.getFloor() !== p.toFloor) {
      throw new Error(`incorrect exit floor`);
    }
    this.completed += 1;
  }
}

new Model();
