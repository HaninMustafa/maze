//Boilerplate start
//defining some objects from the Matter library - Matter is a global variable
const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;
//Body: a property for functions inside a shape i.e position, velocity, rotation
//Events: an object that listen for things that occured inside the world object

//squere maze
// const cells = 3;
//Rectangular maze
const cellsHorizontal = 14;
const cellsVertical = 8;
//strtching the canvas
const width = window.innerWidth;
const height = window.innerHeight;

//squere maze
//const unitLength = width / cells;

//Rectangular maze
const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;

const borderWidth = 5;

const engine = Engine.create();
engine.world.gravity.y = 0; //disabling gravity
const { world } = engine;
const render = Render.create({
  element: document.body, // this is the location of the canvas
  engine: engine,
  options: {
    wireframes: false, // to have shapes solid filled with color
    width,
    height, // to create the canvas dimentions
  },
});
Render.run(render);
Runner.run(Runner.create(), engine);
//Boilerplate end

//walls : to prevent the shape from going outside the canvas - Drawing borders
const walls = [
  Bodies.rectangle(width / 2, 0, width, borderWidth * 2, { isStatic: true }),
  Bodies.rectangle(width / 2, height, width, borderWidth * 2, {
    isStatic: true,
  }),
  Bodies.rectangle(0, height / 2, borderWidth * 2, height, { isStatic: true }),
  Bodies.rectangle(width, height / 2, borderWidth * 2, height, {
    isStatic: true,
  }),
];
World.add(world, walls);

//Maze generation - outer for col, inner array for rows#

const shuffle = (arr) => {
  let counter = arr.length;
  while (counter > 0) {
    const index = Math.floor(Math.random() * counter);
    counter--;
    const temp = arr[counter];
    arr[counter] = arr[index];
    arr[index] = temp;
  }
  return arr;
};
const grid = Array(cellsVertical)
  .fill(null)
  .map(() => Array(cellsHorizontal).fill(false));

const verticals = Array(cellsVertical)
  .fill(null)
  .map(() => Array(cellsHorizontal - 1).fill(false));

const horizontals = Array(cellsVertical - 1)
  .fill(null)
  .map(() => Array(cellsHorizontal).fill(false));

///////////////////////////////////////////////////////random starting cell
const startRow = Math.floor(Math.random() * cellsVertical);
const startColumn = Math.floor(Math.random() * cellsHorizontal);

const stepThroughCell = (row, column) => {
  //If I have visited the cell at [row,column], return
  if (grid[row][column]) {
    return;
  }
  //Mark this cell as being visited
  grid[row][column] = true;
  //Assemble randomly-ordered list of neighbors
  const neighbors = shuffle([
    [row - 1, column, "up"],
    [row, column + 1, "right"],
    [row + 1, column, "down"],
    [row, column - 1, "left"],
  ]);
  //For each neighbor ...
  for (let neighbor of neighbors) {
    const [nextRow, nextColumn, direction] = neighbor;

    //See if that neighbor is out of bounds -- when on the edges of the screen
    if (
      nextRow < 0 ||
      nextRow >= cellsVertical ||
      nextColumn < 0 ||
      nextColumn >= cellsHorizontal
    ) {
      continue; //keywords used inside loops to skip the current iteration and move on to the next one
    }
    //If we have visited that neighbor, continue to next neighbor
    if (grid[nextRow][nextColumn]) {
      continue;
    }

    //Remove a wall from either horizontals or verticals

    if (direction === "left") {
      verticals[row][column - 1] = true;
    } else if (direction === "right") {
      verticals[row][column] = true;
    } else if (direction === "up") {
      horizontals[row - 1][column] = true;
    } else if (direction === "down") {
      horizontals[row][column] = true;
    }

    stepThroughCell(nextRow, nextColumn);
  }
  //Visit that next cell
};
stepThroughCell(startRow, startColumn);

//iterating over walls
horizontals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) {
      return;
    }
    const wall = Bodies.rectangle(
      columnIndex * unitLengthX + unitLengthX / 2,
      rowIndex * unitLengthY + unitLengthY,
      unitLengthX,
      10,
      {
        label: "wall",
        isStatic: true,
        render: {
          fillStyle: "red",
        },
      }
    );
    World.add(world, wall);
  });
});

verticals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) {
      return;
    }
    const wall = Bodies.rectangle(
      columnIndex * unitLengthX + unitLengthX,
      rowIndex * unitLengthY + unitLengthY / 2,
      10,
      unitLengthY,
      {
        label: "wall",
        isStatic: true,
        render: {
          fillStyle: "red",
        },
      }
    );
    World.add(world, wall);
  });
});

//Drawing the goal
const goal = Bodies.rectangle(
  width - unitLengthX / 2,
  height - unitLengthY / 2,
  unitLengthX * 0.7,
  unitLengthY * 0.7,
  {
    label: "goal",
    isStatic: true,
    render: {
      fillStyle: "green",
    },
  }
);
World.add(world, goal);

//Drawing the playing ball
const ballRadius = Math.min(unitLengthX, unitLengthY) / 4;
const ball = Bodies.circle(unitLengthX / 2, unitLengthY / 2, ballRadius, {
  label: "ball",
  render: {
    fillStyle: "blue",
  },
});
World.add(world, ball);

//Handling keypresses
document.addEventListener("keydown", (event) => {
  //adding keyboard controls
  const { x, y } = ball.velocity; //destructuring
  //https://keycode.info/

  //key W: up
  if (event.keyCode === 87) {
    Body.setVelocity(ball, { x, y: y - 5 }); //update the velocity of a shape
  }

  //key D: right
  if (event.keyCode === 68) {
    Body.setVelocity(ball, { x: x + 5, y });
  }
  //key S: down
  if (event.keyCode === 83) {
    Body.setVelocity(ball, { x, y: y + 5 });
  }
  //key A: left
  if (event.keyCode === 65) {
    Body.setVelocity(ball, { x: x - 5, y });
  }
});
//Detecting a win
Events.on(engine, "collisionStart", (event) => {
  event.pairs.forEach((collision) => {
    const labels = ["ball", "goal"];
    if (
      labels.includes(collision.bodyA.label) &&
      labels.includes(collision.bodyB.label)
    ) {
      //adding a won animation - gravity on and maze fall
      document.querySelector(".winner").classList.remove("hidden");
      world.gravity.y = 1;
      world.bodies.forEach((body) => {
        if (body.label == "wall") {
          Body.setStatic(body, false);
        }
      });
    }
  });
});
