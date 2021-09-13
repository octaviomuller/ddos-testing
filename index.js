// 10 request in 2 seconds

var express = require('express')
var app = express()
var limitter = require('express-rate-limit')

var port = 4009

let expiry = 1
let fibCount = 1
let lastDenial
let newDenial

function fib(n) {
  if (n <= 1) return 1
  return fib(n - 1) + fib(n - 2)
}

app.use(
  limitter({
    windowMs: 5000,
    max: 4,
    handler: async (req, res, next) => {
      if (lastDenial === undefined) lastDenial = new Date()
      return await new Promise(async resolve => {
        newDenial = new Date()
        setTimeout(() => {
          console.log({ expiry, lastDenial, newDenial });
          expiry = fib(fibCount++)
          if ((newDenial - lastDenial)/1000 >= 5) {
            expiry = 1
            fibCount = 1
          }
          lastDenial = newDenial
          resolve(next())
        }, expiry * 1000)
      })
    }
  })
)

app.get('/', (req, res) => {
  res.send('ok!')
})

app.get('/2', (req, res) => {
  res.send('ok 2!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
