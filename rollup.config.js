import babel from 'rollup-plugin-babel';

export default {
    entry: 'src/index.js',
    format: 'umd',
    moduleName: 'marionette.morphdom',
    plugins: [babel()],
    dest: 'dist/index.umd.js'
};
