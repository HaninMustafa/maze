//Boilerplate start
//defining some objects from the Matter library - Matter is a global variable
const { Engine, Render, Runner, World, Bodies, MouseConstraint, Mouse } =
  Matter;
const width = 800;
const height = 600;
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

//Clicking and Dragging
World.add(
  world,
  MouseConstraint.create(engine, {
    mouse: Mouse.create(render.canvas),
  })
);

//the first two numbers represent the position of the shape.. the second two number represent the size
const shape = Bodies.rectangle(200, 200, 50, 50, {
  isStatic: true, // this means we do not want it to move , false makes it fall to gravity!
});
World.add(world, shape);
//the world object has all the shapes inside Bodies
//each shape has many properties
//AngularVelocity : how quickly is rotate and the direction
//Position: the fysical position
//Velocity: how quickly it moves up/down/left/right

//walls : to prevent the shape from going outside the canvas - Drawing borders
const walls = [
  Bodies.rectangle(400, 0, 800, 40, { isStatic: true }),
  Bodies.rectangle(400, 600, 800, 40, { isStatic: true }),
  Bodies.rectangle(0, 300, 40, 800, { isStatic: true }),
  Bodies.rectangle(800, 300, 40, 800, { isStatic: true }),
];
World.add(world, walls);

//add a shape to world directly
World.add(world, Bodies.rectangle(200, 200, 50, 50));

//Add random shapes
for (let i = 0; i < 40; i++) {
  if (Math.random() > 0.5) {
    World.add(world, Bodies.rectangle(200, 200, 50, 50)); //stacked shapes
    World.add(
      world,
      Bodies.rectangle(Math.random() * width, Math.random() * height, 50, 50)
    ); //random locations
  } else {
    World.add(
      world,
      Bodies.circle(Math.random() * width, Math.random() * height, 35, {
        render: {
          fillStyle: "red",
        },
      }) //third value is raduis
    );
  }
}
