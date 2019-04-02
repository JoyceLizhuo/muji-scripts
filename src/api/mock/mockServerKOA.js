const Koa = require('koa')
const foo = require('./test')

const app = new Koa()

app.use(async (ctx) => {
  ctx.body = foo
  console.info('>>> 1', ctx.body) // wyh-todo rm
})

app.listen(3000)
