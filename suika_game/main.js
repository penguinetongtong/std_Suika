import { Engine, Render, Runner, World } from "matter-js";
import {  } from "matter-js";

const engine = Engine.create();
const render = Render.create({
  engine,
  element: document.body,
  option: {
    wireframes : false,
    background: "#F7F4C8", // background color
    width: 620,
    height: 850,
  }
});
// const world = engine.world;

// const leftWall = Bodies.rectangle(15, 395, 30, 790,{
//   render :{fillStyle: "#E6B143"}
// }); // x,y,width,height 순서

// World.add(world, [leftWall]);

Render.run(render);
Render.run(engine);