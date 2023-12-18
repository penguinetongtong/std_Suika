import { Bodies, Engine, Render, Runner, World } from "matter-js";
import { FRUITS } from "./fruits";

const engine = Engine.create();
const render = Render.create({
  engine,
  element: document.body,
  options: {
    wireframes : false,
    background: "#F7F4C8", // background color
    width: 620,
    height: 850,
  }
});

const world = engine.world;

/** 왼쪽 벽 */
const leftWall = Bodies.rectangle(15, 395, 30, 790, { // matter js 는 오브젝트의 중앙을 기준으로 물체의 위치를 특정함.
  isStatic: true,
  render: {fillStyle: "#E6B143"} // 왼쪽벽 색상 설정
});
/** 오른쪽 벽 */
const rightWall = Bodies.rectangle(605, 395, 30, 790, { // x,y,height,width
  isStatic: true,
  render: {fillStyle: "#E6B143"} // 오른쪽 색상 설정
});
/** 바닥 벽 */
const ground = Bodies.rectangle(310, 820, 620, 60, { // x,y,height,width
  isStatic: true,
  render: {fillStyle: "#E6B143"} 
});
/** 천장 벽 */
const topLine = Bodies.rectangle(310, 150, 620, 2, { // x,y,height,width
  isStatic: true,
  isSensor: true,
  render: {fillStyle: "#E6B143"}
});

World.add(world, [leftWall, rightWall, ground, topLine]);

Render.run(render);
Runner.run(engine);

/** 과일을 생성하는 함수 */
function addFruit(){
  const index = 7;
  const fruit = FRUITS[index];

  const body = Bodies.circle(300, 50, fruit.radius,{
    render:{
      sprite: { texture: `${fruit.label}.png` }
    }
  });

  World.add(world, body);
}

addFruit();