import path from 'path'

export default {
  entry: './src/main.jsx',
  output: {
    path: path.join(__dirname, '/'),
    publicPath: '',
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /.jsx?$/,
        use: [{ loader: 'babel-loader?compact=false' }]
      }
    ]
  },
  plugins: [],
  devServer: {
    contentBase: path.join(__dirname, '/'),
    compress: true,
    port: 3000
  }
}
