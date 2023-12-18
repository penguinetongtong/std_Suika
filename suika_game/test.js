import { Engine, Render, Runner, Bodies, World} from "matter-js";
import { FRUITS } from "./fruits";

const engine = Engine.create();
const render = Render.create({
  engine,
  element: document.body,
  options: {
    wireframes: false,
    background: "#F7F4C8",
    width: 620,
    height: 850,
  },
});

const world = engine.world;

const ground = Bodies.rectangle(310, 820, 620, 60, {
  isStatic: true,
  render: {
    fillStyle: "#E6B143",
  },
});

const leftWall = Bodies.rectangle(15, 395, 30, 790, {
  isStatic: true,
  render: {
    fillStyle: "#E6B143",
  },
});

const rightWall = Bodies.rectangle(605, 395, 30, 790, {
  isStatic: true,
  render: {
    fillStyle: "#E6B143",
  },
});

const topLine = Bodies.rectangle(310, 150, 620, 2, {
  isStatic: true,
  isSensor: true,
  render: { fillStyle: "#E6B143" },
  label: "topLine",
});

World.add(world, [ground, leftWall, rightWall, topLine]);

Render.run(render);
Runner.run(engine);

let currentBody = null;
let currentFruit = null;

function addCurrentFruit() {
  const randomFruit = getRandomFruit();

  const body = Bodies.circle(300, 50, randomFruit.radius, {
    label: randomFruit.label,
    isSleeping: true,
    render: {
      sprite: { texture: `${randomFruit.label}.png` },
    },
    restitution: 0.2,
  });

  currentBody = body;
  currentFruit = randomFruit;

  World.add(world, body);
}
 /**  */
function getRandomFruit() {
  const randomIndex = Math.floor(Math.random() * 5);
  const fruit = FRUITS[randomIndex];

  if (currentFruit && currentFruit.label === fruit.label)
    return getRandomFruit();

  return fruit;
}

addCurrentFruit();
