let filter = require("./filter.js")

let target = "niagra"

//this is not ok
filter("🇳ɪa🇬ra", target).then(a => console.log(a)) // unicode example
filter("Niagra is beautiful!!!", target).then(a => console.log(a)) //this works with sentances btw
filter("n.i.a.g.r.a", target).then(a => console.log(a)) // someone really trying example
filter("n  @#$@i#@$ a   !$#%^#   g#@$@#r #$@#  a", target).then(a => console.log(a)) // someone really trying example
filter("nagra", target).then(a => console.log(a)) //simularity example
filter("neagara", target).then(a => console.log(a)) // "sounds like" example

//this is ok
filter("The waterfall is beautiful!!!", target).then(a => console.log(a))