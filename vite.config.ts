import { UserConfig, ConfigEnv, BuildOptions  } from 'vite'
import path from 'path';
import Vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite'
import fs from 'fs'

export default ({ command, mode }: ConfigEnv): UserConfig => {
  console.log(command, mode)

  // 处理 tsconfig.base.json 库快捷路径
  const paths = (JSON.parse(fs.readFileSync('tsconfig.base.json', 'utf8')) as any).compilerOptions.paths
  const aliasPaths: Record<string, any> = {}
  for (const key in paths) {
    if (Object.prototype.hasOwnProperty.call(paths, key)) {
      aliasPaths[key] = `${path.resolve(__dirname, './' + paths[key][0])}`
    }
  }

  return {
    resolve: {
      alias: {
        '@': `${path.resolve(__dirname, './examples')}/`,
        ...aliasPaths
      }
    },

    // plugins
    plugins: [
      Vue(),
      AutoImport({
        imports: ['vue', 'vue-router'],
        dts: 'examples/types/auto-imports.d.ts',
        eslintrc: {
          enabled: false, // 默认false, true启用。生成一次就可以，避免每次工程启动都生成
          filepath: './.eslintrc-auto-import.json', // 生成json文件
          globalsPropValue: true
        }
      })
    ],

    // server
    server: {
      // 服务配置
      port: 3000, // 类型： number 指定服务器端口;
      open: true, // 类型： boolean | string在服务器启动时自动在浏览器中打开应用程序；
      cors: true, // 类型： boolean | CorsOptions 为开发服务器配置 CORS。默认启用并允许任何源
      host: '0.0.0.0' // IP配置，支持从IP启动
      // proxy: {
      //   '/api': {
      //     target: 'https://www.fastmock.site/mock/d0e0d269a5410a1e187bf39c2cc0b431/admin',
      //     changeOrigin: true,
      //     ws: true,
      //     secure: false,
      //     rewrite: (path: any) => path.replace('^/api', '')
      //   }
      // }
    },
    // css
    // css: {
    //   preprocessorOptions: {
    //     scss: {
    //       modifyVars: {},
    //       javascriptEnabled: true,
    //       additionalData: `@import "src/styles/variables.scss";`
    //     }
    //   }
    // },
    // build
    build: {
      target: 'es2015',
      outDir: 'dist',
      terserOptions: {
        compress: {
          keep_infinity: true,
          drop_console: true
        }
      },
      reportCompressedSize: false,
      chunkSizeWarningLimit: 2000
    }
  }
}
