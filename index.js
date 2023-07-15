//Boilerplate start
//defining some objects from the Matter library - Matter is a global variable
const { Engine, Render, Runner, World, Bodies } = Matter;
const cells = 3;
const width = 600;
const height = 600;
const borderWidth = 20;
const engine = Engine.create();
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
const grid = Array(cells)
  .fill(null)
  .map(() => Array(cells).fill(false));

const verticals = Array(cells)
  .fill(null)
  .map(() => Array(cells - 1).fill(false));

const horizontals = Array(cells - 1)
  .fill(null)
  .map(() => Array(cells).fill(false));

///////////////////////////////////////////////////////random starting cell
const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);

const stepThroughCell = (row, column) => {
  //If I have visited the cell at [row,column], return
  if (grid[row][column]) {
    console.log("1");
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
      nextRow >= cells ||
      nextColumn < 0 ||
      nextColumn >= cells
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
stepThroughCell(1, 1);
