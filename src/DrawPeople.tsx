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
        offset = offset * 120 + (person.status === "WAITING" ? 0 : 650);
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
    (props.numberOfFloors - props.floor - 1) * props.floorHeight + 30;
  return (
    <>
      <ellipse
        cx={props.offset + 50 + 15}
        cy={yPos}
        rx={60}
        ry={20}
        fill="transparent"
        stroke="#000"
        strokeWidth={2}
      ></ellipse>
      <text
        x={props.offset + 20}
        y={yPos + 5}
        stroke="#000"
        strokeWidth={1}
        fontSize="20px"
      >
        {props.person.id}: {props.person.fromFloor} -&gt; {props.person.toFloor}
      </text>
    </>
  );
};
