import * as React from "react";
import { Lift } from "./Lift";

interface DrawLiftsProps {
  numberOfFloors: number;
  lifts: Lift[];
  height: number;
  width: number;
}

export const DrawLifts: React.FC<DrawLiftsProps> = (props) => {
  const [tick, setTick] = React.useState<number>(0);
  React.useEffect(() => {
    setInterval(() => {
      setTick((newTick) => newTick + 1);
    }, 50);
  }, []);
  const children = [];
  const floorHeight = Math.floor(props.height / props.numberOfFloors);
  const liftHeight = floorHeight - 10;
  for (let i = 0; i < props.lifts.length; i += 1) {
    children.push(
      <DrawLiftShaft x={500 + 70 * i} y={0} height={props.height} />
    );
    const liftFloor = props.lifts[i].getFloor();
    const yPos = (props.numberOfFloors - liftFloor - 1) * floorHeight + 5;
    const doorsOpen =
      ["DOORS_OPEN_WAITING", "DOORS_CLOSING"].indexOf(
        props.lifts[i].getActualState()
      ) > -1;
    children.push(
      <DrawLift
        x={505 + 70 * i}
        y={yPos}
        height={liftHeight}
        doorsOpen={doorsOpen}
      />
    );
  }
  return <>{children}</>;
};

interface DrawLiftShaftProps {
  x: number;
  y: number;
  height: number;
}

const DrawLiftShaft: React.FC<DrawLiftShaftProps> = (props) => (
  <rect {...props} width={50} fill="transparent" stroke="#333" />
);

interface DrawLiftProps {
  x: number;
  y: number;
  height: number;
  doorsOpen: boolean;
}

const DrawLift: React.FC<DrawLiftProps> = (props) => (
  <rect
    {...props}
    width={40}
    fill={props.doorsOpen ? "transparent" : "#000"}
    stroke="#000"
    strokeWidth={5}
  />
);
