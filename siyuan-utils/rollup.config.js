//新建一个rollup.config.js 
import { uglify } from 'rollup-plugin-uglify';
import nodeResolve from 'rollup-plugin-node-resolve' 
import commonjs from 'rollup-plugin-commonjs'   
export default {
  input: 'index.js',
  plugins:[ 
    uglify(),
    nodeResolve(),
    commonjs()
  ],
  output: { 
    file:'/Users/allenzhou/Documents/SiYuan/data/widgets/siyuan-utils2/index.js',    
    format:'umd',
    name:'lz',
    sourcemap:true  
  }
};