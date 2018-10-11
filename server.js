// const Vue = require('vue')
// const express = require('express')
// const bodyParser = require('body-parser')
// const fs = require('fs')
// const path = require('path')
// const { createBundleRenderer } = require('vue-server-renderer')
// const server = express()

// const history = require('connect-history-api-fallback');

// const utils = require('./build/utils');

// const modulesArray = utils.modulesArray();


// const modules = modulesArray.map(item => {
//     return { from: item, to: `./${item}.html` }
// });




// const renderer = (function () {

//     const moduleRender = {};

//     modulesArray.forEach(module => {
//         const bundle = require(`./dist/server/${module}/vue-ssr-server-bundle.json`);
//         const clientManifest = require(`./dist/server/${module}/vue-ssr-client-manifest.json`);
//         moduleRender[module] = createBundleRenderer(bundle, {
//             template: fs.readFileSync('./index.template.html', 'utf-8'),
//             clientManifest
//         })
//     });

//     return moduleRender;

// })();

// console.log(renderer);


// // 这个方法返回一个仅仅用来解析json格式的中间件。这个中间件能接受任何body中任何Unicode编码的字符。支持自动的解析gzip和 zlib。
// server.use(bodyParser.json());
// // 这个方法也返回一个中间件，这个中间件用来解析body中的urlencoded字符，只支持utf-8的编码的字符。同样也支持自动的解析gzip和 zlib。
// server.use(bodyParser.urlencoded({ extended: false }));

// // 静态文件
// server.use(express.static(path.join(__dirname, '/dist'), { maxAge: 2592000 * 1000 }));



// // api
// let items = { 1: { title: "item1", content: "item1 content" } }
// let id = 2


// server.get("/api/items/:id", (req, res, next) => {
//     console.log();
//     res.json(items[req.params.id] || {})
// })

// server.get("/api/items", (req, res, next) => {
//     res.json(items)
// })

// server.post("/api/items", (req, res, next) => {
//     items[id] = req.body
//     res.json({ id, item: items[id++] })
// })

// try{
//     modulesArray.forEach(module => {
//         server.get(`/${module}`, (req, res) => {
            
//             const context = { url: req.originalUrl }
            
//             console.log(context);
            
//             renderer[module].renderToString((err, html) => {
//                 console.log(err);
//                 console.log(html);
//                 if (err) {
//                     if (err.code === 404) {
//                         res.status(404).end('Page not found')
//                     } else {
//                         res.status(500).end('Internal Server Error')
//                     }
//                 } else {
                   
//                     res.end(html)
//                 }
//             })
//         })
//     })
    
// } catch(e) {
//     console.log(e);
// }



// server.use(history({
//     rewrites: modules
// }));


// // 服务端渲染


// server.listen(8081)


/**
 * Created by kenkozheng on 2017/11/27.
 */

const fs = require('fs');
const path = require('path');
// const LRU = require('lru-cache');
const express = require('express');
// const favicon = require('serve-favicon')
// const compression = require('compression')
const server = express();
const { createBundleRenderer } = require('vue-server-renderer');
const router = {
    'oms': {
        url: '/oms.html',                         //访问的url规则，用于express的get
        dir: './web/pages/page1',                   //页面目录，默认有app.js作为入口
        title: 'Page1',                             //生成html的title
        // template: './web/pages/page1/tpl.html'      //特殊指定一个html
    },
    'pms': {
        url: '/pms.html',                 //访问的url规则，用于express的get
        dir: './web/pages/page2',          //页面目录，默认有app.js作为入口
        title: 'Page2'                      //生成html的title
    }
}

const isProd = true;
console.log(isProd);
const resolve = file => path.resolve(__dirname, file);
const serve = (path, cache) => express.static(resolve(path), {
    maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0
});
const createRenderer = (bundle, options) => createBundleRenderer(bundle, Object.assign(options, {
    // for component caching
    cache: LRU({
        max: 1000,
        maxAge: 1000 * 60 * 15
    }),
    // recommended for performance
    runInNewContext: false
}));

let render;
let rendererMap = {};
const templatePath = resolve('../index.template.html');            //要么使用path.resolve以当前文件换算路径，要么写以最终执行脚本的位置的相对路径
let baseRender = (renderer, pageName, req, res) => {
    //context是一个对象，在模版中，使用<title>{{ title }}</title>方式填充 https://ssr.vuejs.org/zh/basic.html
    let routeConfig = router[pageName];
    let context = {title: routeConfig.title};           //这个context同时会传递给entry-server，server里边可以注入数据，然后再交给模版
    renderer.renderToString(context, (err, html) => {
        if (err) {
            console.log(err);   //如果entry-server返回的是promise，那么err就是reject的内容
            res.status(500).end('Internal Server Error');
            return
        }
        res.send(html);
        res.end();
    });
};

if (isProd) {
    // In production: create server renderer using template and built server bundle.
    // The server bundle is generated by vue-ssr-webpack-plugin.
    const uniTpl = fs.readFileSync(templatePath, 'utf-8');
    let template = null;
    for (let pageName in router) {
        if(router[pageName].template) {
            template = fs.readFileSync(router[pageName].template, 'utf-8');
        } else {
            template = uniTpl;
        }
        const bundle = require(`../dist/server/${pageName}/vue-ssr-server-bundle.json`);
        // The client manifests are optional, but it allows the renderer
        // to automatically infer preload/prefetch links and directly add <script>
        // tags for any async chunks used during render, avoiding waterfall requests.
        const clientManifest = require(`../dist/server/${pageName}/vue-ssr-client-manifest.json`);
        rendererMap[pageName] = createRenderer(bundle, {
            template,
            clientManifest
        });
    }
    render = (pageName, req, res) => {
        baseRender(rendererMap[pageName], pageName, req, res);
    };
} else {
    // In development: setup the dev server with watch and hot-reload,
    // and create a new renderer on bundle / index template update.
    // devserver使用的是webpack-dev-middleware，过程文件存储在内存
    // const devServerSetup = require('./build/setup-dev-server');
    // const appEntry = require('../build/multipageWebpackConfig');
    // let promiseMap = {};
    // for (let pageName in appEntry) {
    //     let entry = appEntry[pageName];
    //     let tplPath = router[pageName].template || templatePath;
    //     promiseMap[pageName] = devServerSetup(server, tplPath, pageName, entry.clientConfig, entry.serverConfig, (pageName, bundle, options) => {
    //         rendererMap[pageName] = createRenderer(bundle, options);     //刷新renderer
    //     });
    // }
    // render = (pageName, req, res) => {
    //     promiseMap[pageName].then(() => baseRender(rendererMap[pageName], pageName, req, res));     //需要等待文件初始化
    // };
}

// server.use(compression({ threshold: 0 }));
// server.use(favicon('./public/logo-48.png'));
server.use('/public', serve('../public', true));     //静态目录
server.use('/dist/js', serve('../dist/js'));
server.use('/dist/img', serve('../dist/img'));

/**
 * 不建议在server.js中写太多路由的事情，如果路由多了，建议迁移到额外一个配置表中
 */
for (let pageName in router) {
    let pageConfig = router[pageName];
    server.get(pageConfig.url, ((pageName) => {
        return (req, res) => {
            render(pageName, req, res);
        }
    })(pageName));
}

const port = 80;
server.listen(port, () => {
    console.log(`server started at localhost:${port}`)
});