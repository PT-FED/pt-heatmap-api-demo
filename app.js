const Koa = require('koa');
const sendFile = require('koa-send');
const http = require('http');
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
            'PT-heatmap-Authorization': 'd35cddd616194b7f7a40cf0e3f788e62'
        },
        url = encodeURIComponent(ctx.query.url),  //request heatmap url.
        startTime = 1487088000,
        endTime = 1489593600,
        terminal = 'Smartphone',
        heatMapType = 'click';
        
        const heatMapAPIUrl = 'http://localhost:3200/API/v1/heatMap/get?url=' + url + "&startTime=" + startTime + "&endTime=" + endTime + "&terminal=" + terminal + "&heatMapType=" + heatMapType;
        
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
        const req = http.request(options, res => {
            res.setEncoding('utf8');
            console.log(res.statusCode); // if statusCode is 403. because heatmap api token error.
            resolve(res);
        });
        req.end();
    });
}