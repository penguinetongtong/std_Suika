import { Bodies, Engine, Body, Render, Runner, World, Events, Collision } from "matter-js";
import { FRUITS } from "./fruits";

//배경화면 color
const engine = Engine.create();
const render = Render.create({
  engine,
  element: document.body,
  options: {
    wireframes : false,
    background: "#F7F4C8", 
    width: 620,
    height: 850,
  }
});
const world = engine.world;
//배경화면 테두리 (x축, y축, 너비, 높이)
const leftWall = Bodies.rectangle(15, 395, 30, 790,{
  isStatic: true,
  render :{fillStyle: "#E6B143"}
});

const rightWall = Bodies.rectangle(605, 395, 30, 790,{
  isStatic: true,
  render :{fillStyle: "#E6B143"}
});

const ground = Bodies.rectangle(310, 820, 620, 60,{
  isStatic: true,
  render :{fillStyle: "#E6B143"}
});

const topLine = Bodies.rectangle(310, 150, 620, 2,{
  isStatic: true,
  isSensor: true,
  render :{fillStyle: "#E6B143"}
});

World.add(world, [leftWall, rightWall, ground, topLine]);

Render.run(render);
Runner.run(engine);

let currentBody = null;
let currentFruit = null;
//움직이지 못하게 함
let disableAction = false;

//과일 떨어뜨리기
function addFruit() {
  //5개 과일 중 랜덤 생성
  const index = Math.floor(Math.random() * 5);
  const fruit = FRUITS[index];

  const body = Bodies.circle(300, 50, fruit.radius, {
    index:index,
    isSleeping: true,
    render: {
      sprite: { texture: `${fruit.label}.png` }
    }, 
    //튀기는 정도: 0 ~ 1 
    restitution: 0.2,
  });

  currentBody = body;
  currentFruit = fruit;

  World.add(world, body);
}
//키 눌러서 작동하게 만들기
window.onkeydown = (event) => {
  //disableAction이 되어 있다면 아래 코드를 실행하지 않음?
  if (disableAction) {
    return; 
  }
  switch (event.code) {
    //왼쪽으로 10만큼 이동
    case "KeyA":
      Body.setPosition(currentBody, {
        x: currentBody.position.x - 10,
        y: currentBody.position.y,
      });
      break;

      case "KeyD":
        //오른쪽으로 10만큼 이동
        Body.setPosition(currentBody, {
          x: currentBody.position.x + 10,
          y: currentBody.position.y,
        });
      break;
      //과일 떨어짐
      case "KeyS":
        //멈춘 후 생성
        currentBody.isSleeping = false;
        //키 다운이 되었을 때
        disableAction = true;
        //과일이 바로 생성되지 않고 1초(1000) 뒤에 생성
        setTimeout(() => {
          addFruit();  
          //1초 동안 과일을 왼쪽, 오른쪽 이동 안되게 함
          disableAction = false;
        }, 1000);
        break;
  }
}
//충돌 시 아래 코드 실행
Events.on(engine, "collisionStart", (event) => {
  event.pairs.forEach((collision) => {
    if(collision.bodyA.index === collision.bodyB.index) {
      World.remove(world, [collision.bodyA, collision.bodyB])
    }
  });
  

})

addFruit();