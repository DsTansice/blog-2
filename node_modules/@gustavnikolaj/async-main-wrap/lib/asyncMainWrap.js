function exitWithError(err) {
  if (process.env.DEBUG) {
    console.error(err);
  } else if (err.customOutput) {
    console.error(err.customOutput);
  } else {
    console.error(err.stack);
  }

  if (typeof err.exitCode === "number") {
    process.exit(err.exitCode);
  }

  process.exit(1);
}

const supportedOptions = ["processError"];

function asyncMainWrap(main, options = {}) {
  const unsupportedOptions = Object.keys(options).filter(
    key => !supportedOptions.includes(key)
  );

  if (unsupportedOptions.length > 0) {
    for (const option of unsupportedOptions) {
      console.error(`Unsupported option "${option}".`);
    }

    return exitWithError(new Error("Unsupported options"));
  }

  if (options.processError && typeof options.processError !== "function") {
    return exitWithError(
      new Error(
        `Invalid option "processError" of value "${typeof options.processError}". Must be a function.`
      )
    );
  }

  return function() {
    if (typeof main !== "function") {
      return exitWithError(new Error("You must pass in a function."));
    }

    var promise = main.apply(null, arguments);

    if (!promise || typeof promise.then !== "function") {
      return exitWithError(
        new Error("The wrapped method must return a promise.")
      );
    }

    return promise.then(undefined, function(err) {
      if (options.processError) {
        err = options.processError(err);
      }
      return exitWithError(err);
    });
  };
}

module.exports = asyncMainWrap;
