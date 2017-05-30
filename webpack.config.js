module.exports = {
  context: __dirname + '/src',
  entry: {
    'app': './app.js',
  },
  output: {
    path: __dirname + '/js',
    filename: '[name].js'
  },
  module: {
    loaders: [
      { 
        test: /\.js$/, 
        exclude: /node_modules/, 
        loader: "babel-loader", 
        query:{
          presets: ['es2015']
        }
      }
    ]
  }
};
