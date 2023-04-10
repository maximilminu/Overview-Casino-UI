const webpack = require("webpack");

module.exports = (config) => {
  config.module.rules[1].oneOf.splice(0, 0, {
    test: /\.svg$/,
    use: ["@svgr/webpack"],
  });

  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    http: require.resolve("http-browserify"),
    https: require.resolve("https-browserify"),
    url: require.resolve("url"),
    util: require.resolve("util/"),
    stream: require.resolve("stream-browserify"),
    os: require.resolve("os-browserify"),
    buffer: require.resolve("buffer/"),
    path: require.resolve("path-browserify"),
    zlib: require.resolve("browserify-zlib"),
  });
  config.resolve.fallback = fallback;
  config.ignoreWarnings = [/Failed to parse source map/]; // gets rid of a billion source map warnings

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
    new webpack.DefinePlugin({
      "process.env.VERSION": JSON.stringify(process.env.npm_package_version),
      "process.env.NAME": JSON.stringify(process.env.npm_package_name),
    }),
  ]);

  return config;
};
