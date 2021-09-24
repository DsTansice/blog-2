# Async main wrap

[![npm version](https://badge.fury.io/js/%40gustavnikolaj%2Fasync-main-wrap.svg)](https://www.npmjs.com/package/@gustavnikolaj/async-main-wrap)
[![Build Status](https://travis-ci.com/gustavnikolaj/async-main-wrap.svg?branch=master)](https://travis-ci.com/gustavnikolaj/async-main-wrap)
[![Coverage Status](https://coveralls.io/repos/github/gustavnikolaj/async-main-wrap/badge.svg?branch=master)](https://coveralls.io/github/gustavnikolaj/async-main-wrap?branch=master)

A simple utility to base cli tools on async methods.

```js
// cli.js

const wrap = require("@gustavnikolaj/async-main-wrap");
const main = require("./main.js");

wrap(main)(process.cwd(), process.argv.slice(2));

// main.js

module.exports = async function cliTool(cwd, args) {
  if (!condition) {
    throw new Error("foo!"); // Will exit the CLI tool with status code 1.
  }

  console.log("All done!");
};
```

The motivation behind this tool is that I got tired of writing the same lines
to wrap my main method for small cli utilities.

Besides being small and simple, this tool also makes testing your cli tool a
lot simpler. You don't have to actually run it through the command line to test
it, you can simply test your main method.

The following rules apply for main methods:

- They should return a promise (or, you know, be an async function).
- If they throw an error with a numeric exitCode property that will be used
  when shutting down the process.

There is examples in both the `examples` directory as well as in
`test/__fixtures__`. The fixtures contains some examples of different use, but
in general, most of it will look like the example at the top, and the best
reference for a more real world implementation is most likely going to be the
[glob example](./examples/glob).

# Tips

## Pass in your output channels

No clever things is done around what arguments you're passed. Whatever you pass
to the wrapped method is passed on to your actual method. If you want to make
testing the output easier, you can pass the `console` object to your method.

```js
// cli.js

const wrap = require("@gustavnikolaj/async-main-wrap");
const main = require("./main.js");

wrap(main)(process.cwd(), process.argv.slice(2), console);

// main.js

module.exports = async function cliTool(args, console) {
  const name = args[0] || "world";

  console.log(`Hello, ${name}!`);
};

// main.spec.js

it("should say hello world", async () => {
  const logs = [];
  const mockConsole = {
    log(message) {
      logs.push(message);
    }
  };

  await main([], mockConsole);

  expect(logs, "to equal", ["Hello, world!"]);
});

it("should say hello Gustav", async () => {
  const logs = [];
  const mockConsole = {
    log(message) {
      logs.push(message);
    }
  };

  await main(["Gustav"], mockConsole);

  expect(logs, "to equal", ["Hello, Gustav!"]);
});
```

You could also pass in the raw `process.stdout` or `process.stderr` streams if
you want tighter control.

## Use with arguments parser

You can use any arguments parser you like, here I use yargs as an example:

```js
// cli.js

const wrap = require("@gustavnikolaj/async-main-wrap");
const main = require("./main.js");

wrap(main)(process.cwd(), process.argv.slice(2));

// main.js

const yargs = require("yargs");

module.exports = async function main(cwd, args) {
  const argv = yargs(args).argv;

  if (argv.help) {
    printHelp();
    return;
  }

  // ...

  console.log("Done!");
};
```

## Works with esm

The node "polyfill" for es modules: [esm](https://github.com/standard-things/esm)

```js
// cli.js

require = require("esm")(module);
const wrap = require("@gustavnikolaj/async-main-wrap");
const main = require("./main").default;

wrap(main)(process.cwd(), process.argv.slice(2));

// main.js

export default async function main(cwd, args) {
  // ...
}
```

## Shebang (how to look like a real shell tool)

The `#!` line at the top of the file will tell the shell how to execute the
script, meaning that you no longer have to call the script with the `node`
binary.

```js
#!/usr/bin/env node

const wrap = require("@gustavnikolaj/async-main-wrap");
const main = require("./main.js");

wrap(main)(process.cwd(), process.argv.slice(2));
```

For this to work you need to give the script executable permissions. That can
be done like this on Linux and Mac:

```
$ chmod +x my-awesome-tool
```

## Modifying errors before printing them

Sometimes you will want to do something to your errors before printing them.
E.g. the [invariant](https://github.com/zertosh/invariant) module will throw
errors with a custom property `framesToPop` that error handlers can use as a
hint to remove frames from the stack trace - the module will put itself on top
of any stack trace, because of how it functions. Using a module like
[frame-popper](https://github.com/gustavnikolaj/frame-popper) you can remove
those extra stack frames.

```js
#!/usr/bin/env node

const wrap = require("@gustavnikolaj/async-main-wrap");
const framePopper = require("@gustavnikolaj/frame-popper");
const main = require("./framePopper-main");

wrap(main, { processError: err => framePopper(err) })();
```

## Custom human friendly error output

By setting a `customOutput` property on your errors you can override the output
generated by `async-main-wrap`. Setting the DEBUG environment variable will
disable `customOutput`-based output and print the full details.

Can be combined with the `processError` option to generate friendly errors for
all your errors.

```js
// main.js

module.exports = async function(/* ... */) {
  // ...

  const err = new Error("Such an unfriendly error message");
  err.customOutput = "So friendly, but still an error!";
  throw err;

  // ...
};
```

```
$ cli
So friendly, but still an error!
```
