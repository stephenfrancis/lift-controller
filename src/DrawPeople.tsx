import * as React from "react";
import { Person } from "./Model";

interface DrawPeopleProps {
  people: Person[];
  numberOfFloors: number;
  height: number;
}

export const DrawPeople: React.FC<DrawPeopleProps> = (props) => {
  const [tick, setTick] = React.useState<number>(0);
  React.useEffect(() => {
    setInterval(() => {
      setTick((newTick) => newTick + 1);
    }, 50);
  }, []);
  const floorHeight = Math.floor(props.height / props.numberOfFloors);
  const peopleOnFloor = {};
  return (
    <>
      {props.people.map((person, index) => {
        const floor =
          person.status === "WAITING" ? person.fromFloor : person.toFloor;
        const key = person.status + floor;
        let offset = peopleOnFloor[key] || 0;
        peopleOnFloor[key] = offset + 1;
        offset = offset * 80 + (person.status === "WAITING" ? 0 : 750);
        return (
          <DrawPerson
            offset={offset}
            floor={floor}
            person={person}
            numberOfFloors={props.numberOfFloors}
            floorHeight={floorHeight}
          />
        );
      })}
    </>
  );
};

interface DrawPersonProps {
  offset: number;
  floor: number;
  person: Person;
  numberOfFloors: number;
  floorHeight: number;
}

const DrawPerson: React.FC<DrawPersonProps> = (props) => {
  if (props.person.status === "IN_LIFT") {
    return null; // don't draw while in lift
  }
  const yPos =
    (props.numberOfFloors - props.floor - 1) * props.floorHeight + 50;
  return (
    <>
      <svg
        x={props.offset + 10}
        y={yPos}
        height={30}
        width={30}
        viewBox="0 0 489.3 489.3"
      >
        <path
          d="M181.95,62.7c0,34.6,28.1,62.7,62.7,62.7s62.7-28.1,62.7-62.7S279.25,0,244.65,0S181.95,28.1,181.95,62.7z M244.65,24.5
			c21.1,0,38.2,17.1,38.2,38.2s-17.1,38.2-38.2,38.2s-38.2-17.1-38.2-38.2S223.55,24.5,244.65,24.5z"
        />
        <path
          d="M196.25,138.5c-34.3,0-62.2,27.9-62.2,62.2v79.7c0,23,12.9,44,32.8,54.7v104.7c0,27.3,22.2,49.5,49.5,49.5h56.6
			c27.3,0,49.5-22.2,49.5-49.5V335c19.9-10.7,32.8-31.7,32.8-54.7v-79.7c0-34.3-27.9-62.2-62.2-62.2h-96.8V138.5z M330.75,200.6
			v79.7c0,15.7-9.9,29.9-24.7,35.3c-4.8,1.8-8,6.4-8,11.5v112.6c0,13.8-11.2,25-25,25h-56.6c-13.8,0-25-11.2-25-25V327.2
			c0-5.1-3.2-9.7-8-11.5c-14.8-5.4-24.7-19.6-24.7-35.3v-79.8c0-20.8,16.9-37.7,37.7-37.7h96.8
			C313.85,163,330.75,179.9,330.75,200.6z"
        />
      </svg>
      <ellipse
        cx={props.offset + 43}
        cy={yPos + 2}
        rx={8}
        ry={8}
        fill="transparent"
        stroke="#000"
        strokeWidth={1}
      ></ellipse>
      <text
        x={props.offset + 40}
        y={yPos + 7}
        stroke="#000"
        strokeWidth={1}
        fontSize="10px"
      >
        {props.person.id}&nbsp;&nbsp;&nbsp;{props.person.fromFloor}
        &nbsp;to&nbsp;
        {props.person.toFloor}
      </text>
    </>
  );
};
