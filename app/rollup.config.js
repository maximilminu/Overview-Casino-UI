import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import babel from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import html from "@rollup/plugin-html";

export default {
  input: "src/index.js",
  treeshake: false,
  output: {
    dir: 'build',
    format: 'esm',
    sourcemap: true,
    preserveModules: true,
    preserveModulesRoot: 'node_modules'
  },
  plugins: [
    html({template: ({ attributes, bundle, files, publicPath, title }) => `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          ${ files.js.filter(js => js.fileName !== "src/index.js").map(js => `<script type="module" async defer src="${js.fileName}"></script>` ).join('\n') }
        </head>
        <body>
          <div id="root">
            Cargando...
          </div>
          <script type="module" src="src/index.js"></script>          
        </body>
      </html>
    `}),
    nodeResolve({
      extensions: ['.js', '.jsx'],
    }),
    replace({
      preventAssignment: false,
      'process.env.NODE_ENV': '"development"'
    }),
    babel({
      babelHelpers: 'bundled',
      presets: ['@babel/preset-react'],
      extensions: ['.js','.jsx']
    }),
    commonjs(),
    serve({
      open: false,
      verbose: true,
      contentBase: ['build'],
      host: 'local.fullcare.hosting',
      port: 3000,
    }),
    livereload({ watch: 'src' }),
  ]
};