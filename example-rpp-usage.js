'use strict'
const ReversiblePreproc = require('reversible-preproc')
const split2 = require('split2')
const through2 = require('through2')
const fs = require('fs')
const events = require('events')

async function PreProc(rpp, readable, writable) {
  function throughLineFunc(line, enc, callback, This) {
    function pushLine(line) {
      if (line)
        This.push(line)
    }
    let [err, _dummy] = rpp.line(line, pushLine)
    callback(err, null)
  }
  await events.once(
    readable
      .pipe(split2('\n'))
      .pipe(through2.obj(function (line, enc, callback) {
        throughLineFunc(line, enc, callback, this)
      }))
      .pipe(writable),'finish')
}
let rawdata = fs.readFileSync("./defines.demo0.json")
let defJson = JSON.parse(rawdata)
let rpp = new ReversiblePreproc(defJson)
let readable = fs.createReadStream("./in.demo0.js")
//let writable = fs.createWriteStream(argv.outfile)
let writable = process.stdout
PreProc(rpp, readable, writable)
