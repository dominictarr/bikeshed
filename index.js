#!/usr/bin/env node

var opts = require('optimist').argv
var es   = require('event-stream')
var i    = require('iterate')
var fs   = require('fs')

var each   = i.each
var filter = i.filter

var names = {
   '4space' : '    ' ,
   '3space' : '   '  ,
   '2space' : '  '   ,
   '1space' : ' '    ,
   '4'      : '    ' ,
   '3'      : '   '  ,
   '2'      : '  '   ,
   '1'      : ' '    ,
   'tab'    : '\t'   ,
   't'      : '\t'   ,
}

if(opts.safe)
   try { fs.mkdirSync('/tmp/bikeshed') } catch (_) { }

var from = names[('' + opts.from) . toLowerCase ()]
var to   = names[('' + opts.to  ) . toLowerCase ()]

if(!from || !to || !opts._.length) {
   console.error('USAGE: bikeshed --from 4|2|T --to 4|2|T FILENAMES...')
   process.exit(1)
}

each(
   opts._,
   function (file) {
      var buffered, ready = false

      fs.createReadStream(file)
      .on('close', function () {
         ready = true; next()
      })
      .pipe(es.split(/(\n)/))
      .pipe(es.mapSync(function (line) {
         var m
         if(m = /^(\s+).*/.exec(line)) {            
            var oldspace = m[1]
            //check that the style matches what we are converting from?
            //check it's all tabs, or the right number of spaces?
            var newspace = oldspace.split(from).join(to)
            return newspace + line.substring(oldspace.length)
         } else
            return line
      }))
      .pipe(es.join(function (err, _buf) {
         buffered = _buf; next()
      }))
      function next() {
         if(!buffered) return
         if(!ready)    return
         fs.writeFile(
            file = (opts.safe ? '/tmp/bikeshed/'+file : file),
            buffered, function (err) {
               if(err) throw err
               console.log('wrote:' + file)
          })
      }
   })

