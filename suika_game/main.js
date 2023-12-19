import { Bodies, Engine, Render, Runner, World, Body, Events } from "matter-js";
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
  name: "topLine",
  isStatic: true,
  isSensor: true,
  render: {fillStyle: "#E6B143"}
});

World.add(world, [leftWall, rightWall, ground, topLine]);

Render.run(render);
Runner.run(engine);

let currentBody = null;
let currentFruit = null;
// 과일이 내려가기 시작하는 1초 동안에는 사용자가 아무런 버튼조작을 못하게 하는 변수 설정
let disableAction = false; 
let interval = null;

/** 과일을 생성하는 함수 */
function addFruit(){
  const index = Math.floor(Math.random() * 5);
  const fruit = FRUITS[index];

  const body = Bodies.circle(300, 50, fruit.radius,{
    index: index, // 이후 collision Event 에서 index 비교시 사용.
    isSleeping: true, // 이벤트 전까지 더이상 떨어지지 않고 keep 한 상태가 됨.
    render:{
      sprite: { texture: `${fruit.label}.png` }
    },
    restitution: 0.2 // 과일의 탄성 설정
  });


  currentBody = body;
  currentFruit = fruit;

  World.add(world, body);
}
/** 키보드 입력 구현
 * onkeydown : 자바스크립트의 기본적인 키보드 이벤트 함수 */

window.onkeydown = (event) => {
  if(disableAction) {
    return;
  }
  switch (event.code) {
    case "KeyA": 
      if (interval)
        return;
      interval = setInterval(() => {
        if (currentBody.position.x - currentFruit.radius > 30) // 벽에 과일이 닿으면 더이상 못가게
        Body.setPosition(currentBody,{
          x: currentBody.position.x - 1, // A 키를 두를때마다 왼쪽으로 1만큼 이동
          y: currentBody.position.y,
      });
      }, 5);
      break;

    case "KeyD":
      if (interval)
        return;
      interval = setInterval(() => {
        if (currentBody.position.x + currentFruit.radius < 590) // 620 - 30 = 590 오른쪽벽 끝
        Body.setPosition(currentBody,{
          x: currentBody.position.x + 1, // A 키를 두를때마다 오른쪽으로 1만큼 이동
          y: currentBody.position.y,
        });
      }, 5);
      break;
    
    case "KeyS": 
      currentBody.isSleeping = false;
      disableAction = true;

      // 1초(1000) 뒤에 addFruit() 가 실행되도록 설정
      setTimeout(() =>{
          addFruit();
          disableAction = false;
      }, 500);
      break;
  }
}

// 키를 떼면 interval 을 초기화하는 함수
window.onkeyup = (event) => {
  switch(event.code){
    case "KeyA":
    case "KeyD":
      clearInterval(interval);
      interval = null;
  }
}

Events.on(engine, "collisionStart", (event) =>{
  event.pairs.forEach((collision) => {
    if (collision.bodyA.index === collision.bodyB.index){ // 만약 이벤트 발생한 A,B의 index 가 같으면 
      const index = collision.bodyA.index;
      if (index === FRUITS.length - 1){ // 그 과일이 수박인지 검사하고
        return;
      }
      World.remove(world, [collision.bodyA, collision.bodyB]); // 두 과일 삭제하고
      // 두 과일 다음 과일 생성
      const newFruit = FRUITS[index+1]; 
      const newBody = Bodies.circle(
        //충돌이 일어난 x, y 좌표에
        collision.collision.supports[0].x,
        collision.collision.supports[0].y,
        // 다음 과일 생성
        newFruit.radius, 
        {
          render: { 
            sprite: { texture :`${newFruit.label}.png` }
          },
          index : index + 1,
        }
      );
      World.add(world, newBody); // 생성한 두 과일은 World에 적용
    }

    // 패배조건 판단
    if (!disableAction &&
      (collision.bodyA.name === "topLine" || collision.bodyB.name === "topLine")){
      alert("Game over!");
    }

  });
});
addFruit();