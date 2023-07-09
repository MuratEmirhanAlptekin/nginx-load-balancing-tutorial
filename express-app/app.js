const express = require('express')
const PORT = 8080
const HOST = '0.0.0.0';
const name = process.env.name || "World"

const app = express()
app.get('/',(req,res) => {
    res.send(`Hello ${name} `)
})
app.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
  });
  