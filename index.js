// 10 request in 2 seconds

var express = require('express')
var app = express()
var limitter = require('express-rate-limit')

var port = 4009

let expiry = 1
let fibCount = 1

function fib(n) {
  if (n <= 1) return 1
  return fib(n - 1) + fib(n - 2)
}

app.use(
  limitter({
    windowMs: 5000,
    max: 4,
    handler: async (req, res, next) => {
      return await new Promise(async resolve => {
        setTimeout(() => {
          expiry = fib(fibCount++)
          resolve(next())
        }, expiry * 1000)
      })
    }
  })
)

app.get('/', (req, res) => {
  res.send('ok!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
