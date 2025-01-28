type Color =
  | 'red'
  | 'blue'
  | 'green'
  | 'pink'
  | 'orange'
  | 'cyan'
  | 'yellow'
  | 'grey'
  | 'brown'
  | 'black';

export function colog(...args: any[]): void {
  const colorStyles: Record<Color, string> = {
    red: 'color: red',
    blue: 'color: blue',
    green: 'color: green',
    pink: 'color: pink',
    orange: 'color: orange',
    cyan: 'color: cyan',
    yellow: 'color: yellow',
    grey: 'color: grey',
    brown: 'color: brown',
    black: 'color: black',
  };

  // Extract the last argument to see if it's a valid color
  const potentialColor = args[args.length - 1];
  const color = (Object.keys(colorStyles) as Color[]).includes(potentialColor)
    ? (potentialColor as Color)
    : 'black';

  // If the last argument is a valid color, remove it from the arguments list
  const logArgs = color === potentialColor ? args.slice(0, -1) : args;

  // Prepare the `%c` and styles for each argument
  const styledArgs = logArgs.map((arg) => `%c${arg}`);
  const styles = new Array(logArgs.length).fill(colorStyles[color]);

  // Log all styled arguments
  console.log(styledArgs.join(' '), ...styles);
}

// Usage examples:
// colog('This is a red message', 'red');
// colog('Multiple', 'values', 'are', 'here', 'blue');
// colog('This is a default black message');
