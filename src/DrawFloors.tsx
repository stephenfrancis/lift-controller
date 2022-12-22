import * as React from "react";

interface DrawFloorsProps {
  numberOfFloors: number;
  height: number;
  width: number;
}

export const DrawFloors: React.FC<DrawFloorsProps> = (props) => {
  const children = [];
  const floorHeight = Math.floor(props.height / props.numberOfFloors);
  for (let i = 0; i < props.numberOfFloors; i += 1) {
    const height = floorHeight * i;
    children.push(<DrawFloor width={props.width} height={height} />);
  }
  return <>{children}</>;
};

interface DrawFloorProps {
  height: number;
  width: number;
}

const DrawFloor: React.FC<DrawFloorProps> = (props) => {
  const path = `M 0,${props.height} L ${props.width},${props.height}`;
  return <path d={path} stroke="#000000" />;
};
