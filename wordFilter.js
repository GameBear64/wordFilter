function wordFilter(list, word) {
    let normalized = word
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/\s/g)
    .reduce((acc, a) => a.length >= 3 ? acc + " " + a : acc + a, "")
    .split(/\s/g)
    .reduceRight((acc, a) => a.length >= 3 ? a + " " + acc : a + acc, "")

    list.forEach(item => {
        if (new RegExp(item, "gi").test(normalized)) console.log(`Detected - ${word} by [/${item}/gi]`)
    });
}

let list = [
    "n(i|a|1|!|\\*|#)(g+|k+|b+)((a|@|e|y)r?s?)?", 
    "crypto giveaway", 
    "bad",
    "word"
]

wordFilter(list, "bad word")