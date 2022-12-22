import * as React from "react";
import * as ReactDOM from "react-dom";
import { Model, NUMBER_OF_FLOORS } from "./Model";
import { DrawFloors } from "./DrawFloors";
import { DrawLifts } from "./DrawLifts";
import { DrawPeople } from "./DrawPeople";

const SCALE_X = 1;
const SCALE_Y = 1;
const width = 1200;
const height = 800;

const App: React.FC = (props) => {
  const m = new Model();
  return (
    <div style={{ padding: 10 }}>
      <h2>Lift Controller</h2>
      <svg
        width={width * SCALE_X}
        height={height * SCALE_Y}
        viewBox={`0 0 ${width} ${height}`}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <DrawFloors
          height={height}
          width={width}
          numberOfFloors={NUMBER_OF_FLOORS}
        />
        <DrawLifts
          height={height}
          width={width}
          numberOfFloors={NUMBER_OF_FLOORS}
          lifts={m.getController().getLifts()}
        />
        <DrawPeople
          height={height}
          numberOfFloors={NUMBER_OF_FLOORS}
          people={m.getPeople()}
        />
      </svg>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector("#app"));
