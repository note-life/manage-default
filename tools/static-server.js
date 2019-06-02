const Koa = require('koa');
const fs = require('fs');
const app = new Koa();

const HTMLStr = fs.readFileSync(`${__dirname}/../dist/index.html`);

app.use(async (ctx, next) => {
    try {
        await next()
    } catch (err) {
        ctx.body = err;
    }
});

app.use(async (ctx, next) => {

    if (/\.js$/.test(ctx.url)) {
        ctx.type = 'text/javascript';
        ctx.body = fs.readFileSync(`${__dirname}/../dist${ctx.url}`);
        return;
    }

    if (/\.css$/.test(ctx.url)) {
        ctx.type = 'text/css';
        ctx.body = fs.readFileSync(`${__dirname}/../dist${ctx.url}`);
        return;
    }
    
    ctx.type = 'text/html';
    ctx.body = HTMLStr;
});

app.listen(8090, () => {
    console.log('static server run at 8090...');
});