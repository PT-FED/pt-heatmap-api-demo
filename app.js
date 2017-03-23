const Koa = require('koa');
const sendFile = require('koa-send');
const https = require('https');
const node_url = require('url');

const app = new Koa();

//print log.
app.use((ctx, next) => {
    console.log(`--> ${ctx.method} ${ctx.url}`)
    const start = new Date();
    return next().then(() => {
        const ms = new Date() - start;
        console.log(`<-- ${ctx.method} ${ctx.url} - ${ms}ms`);
    });
});

//get index.html
app.use((ctx, next) => {
    if (['/', '/index.html'].includes(ctx.path)) {
        return sendFile(ctx, '/index.html');
    } else {
        return next();
    }
});

//get heatmap url.
app.use((ctx, next) => {
    if (ctx.path === '/getHeatMap') {
        const headers = {
            'PT-heatmap-Authorization': '823d75349ab11a9a65b19630278238ec'
        },
        url = encodeURIComponent(ctx.query.url),  //request heatmap url.
        startTime = ctx.query.startTime;
        endTime = ctx.query.endTime;
        terminal = ctx.query.terminal || "",
        heatMapType = ctx.query.heatMapType || "";
        
        const heatMapAPIUrl = 'https://reportv3.ptengine.jp/API/v1/heatMap/get?url=' + url + "&startTime=" + startTime + "&endTime=" + endTime + "&terminal=" + terminal + "&heatMapType=" + heatMapType;
console.log(heatMapAPIUrl);
        return get(heatMapAPIUrl, headers).then(data =>{
            //response
            ctx.body = data;
        })
    }else{
        return next();
    }
});

//start server
const port = 3400;
app.listen(port).on('listening', () => {
    console.log(`server strat. port:  ${port}.`);
});

/**
 * use get method.
 * 
 * @param {any} url 
 * @param {Object} header 
 * @returns 
 */
function get(url, headers) {
    //use promise.
    return new Promise(resolve => {
        const options = node_url.parse(url);
        options.method = "GET";
        options.headers = headers;
        const req = https.request(options, res => {
            res.setEncoding('utf8');
            console.log(res.statusCode); // if statusCode is 403. because heatmap api token error.
            resolve(res);
        });
        req.end();
    });
}