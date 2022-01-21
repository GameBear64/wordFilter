let filter = require("./filter.js")

let target = "niagara"

//positive results
filter("🇳ɪa🇬ara", target)
.then(result => {if (result) console.log(result)}) // unicode example

filter("Niagara is beautiful!!!", target)
.then(result => {if (result) console.log(result)}) // works with sentances btw

filter("n.i.a.g.a.r.a", target)
.then(result => {if (result) console.log(result)}) // someone really trying example

filter("n  @#$@i#@$ a   !$#%^#   g#@$a@#r #$@#  a", target)
.then(result => {if (result) console.log(result)}) // someone really trying example

filter("nagra", target)
.then(result => {if (result) console.log(result)}) // simularity example

filter("neagra", target)
.then(result => {if (result) console.log(result)}) // "sounds like" example

//negative result
filter("The waterfall is beautiful!!!", target)
.then(result => {if (result) {console.log(result)} else {console.log("All good here")}} )