var fs = require('fs');

let specials = {    
    "a" : ["а", "₳", "卂", "ᴀ", "🅰️", "🇦", "ᶺ"],
    "b" : ["в", "б", "ь", "ы", "ъ", "฿", "乃", "ʙ", "🅱️", "🇧", "ｂ", "ᛒ", "ẟ", "ƅ"],
    "c" : ["с", "₵", "匚", "ᴄ", "©️", "🇨", "ᑕ"], 
    "d" : ["Д", "Đ", "り", "ᴅ", "🇩", "ⅾ", "Ｄ", "ｄ", "Δ", "∂"],
    "e" : ["е", "э", "з", "ё", "Ɇ", "乇", "ᴇ", "🇪", "Ǝ", "ȝ", "Ξ", "Э"],
    "f" : ["₣", "千", "ꜰ", "🇫", "Ｆ", "ｆ", "Ϝ", "ϝ"], 
    "g" : ["₲", "ム", "ɢ", "🇬", "Ｇ", "ᶢ"],
    "h" : ["н", "Ⱨ", "卄", "ʜ", "♓", "🇭", "ᵸ"],
    "i" : ["ł", "丨", "ɪ", "ℹ️", "🇮", "i️", "ⅰ", "ı"],
    "j" : ["J", "ﾌ", "ᴊ", "🇯"],
    "k" : ["к", "₭", "ズ", "ᴋ", "🇰", "ｋ", "ĸ"],
    "l" : ["Ⱡ", "ㄥ", "ʟ", "🇱", "Ｌ"],
    "m" : ["м", "₥", "爪", "ᴍ", "ⓜ️", "Ⓜ️", "🇲", "m️", "ｍ", "ꮇ" , "ʍ"],
    "n" : ["й", "и", "₦", "几", "ɴ", "♑", "🆖", "🇳", "ｎ", "π", "л", "ͷ", "Π", "Ո"],
    "o" : ["о", "ф", "Ø", "ㄖ", "ᴏ", "⭕", "🇴", "🅾️", "ʘ", "Φ", "ɸ"],
    "p" : ["р", "₱", "卩", "ᴘ", "🅿️", "🇵", "ᴩ", "ᴾ", "Þ"],
    "q" : ["Q", "Ɋ", "q", "🇶", "Ｑ", "ｑ"], 
    "r" : ["г", "я", "Ɽ", "尺", "ʀ", "®️", "🇷", "Ｒ", "ｒ", "ᚱ", "Γ"],
    "s" : ["₴", "丂", "ꜱ", "🇸"],
    "t" : ["т", "₮", "ㄒ", "ᴛ", "🇹", "ｔ", "ţ"],
    "u" : ["Ʉ", "ㄩ", "ᴜ", "⛎", "🇺", "Ｕ", "ｕ"],
    "v" : ["V", "ᐯ", "ᴠ", "🇻", "Ｖ"],
    "w" : ["ш", "щ", "₩", "山", "ᴡ", "🇼", "Ｗ", "ｗ", "ω", "Ш"],
    "x" : ["х", "ж", "Ӿ", "乂", "x", "❌", "🇽", "χ"],
    "y" : ["у", "ч", "Ɏ", "ㄚ", "ʏ", "🇾"],
    "z" : ["Ⱬ", "乙", "ᴢ", "🇿", "ｚ", "Ʃ"],
    "0" : ["0️⃣", "０", "⓪"],
    "1" : ["1️⃣", "🔟", "①", "１", "𝟏","𝟙","𝟣","𝟭","𝟷", "⑴", "ⅼ", "𝐈", "𝐥", "𝐼", "𝑙", "𝑰", "𝒍", "𝔩", "𝕀", "𝕝", "𝟏", "𝟙", "𝟣", "𝟭", "𝟷", "🄂", "⒈", "1̋"],
    "2" : ["2️⃣", "２", "②"],
    "3" : ["3️⃣", "３", "③"],
    "4" : ["4️⃣", "４", "④"],
    "5" : ["5️⃣", "５", "⑤"],
    "6" : ["6️⃣", "６", "⑥"],
    "7" : ["7️⃣", "７", "⑦"],
    "8" : ["8️⃣", "８", "⑧"],
    "9" : ["9️⃣", "９", "⑨"]
}

let file = fs.readFileSync("./confusables/confusablesSummary.txt", 'utf8')

//find simularity lines and extract them
let metches = file.match(/#(.*?)\n/g).map(el => {
    el = el.replace("#", "")
    el = el.replace("\n", "")
    return el.split("\t").filter(el => !el.includes("→")).filter(el => el != "")
})
//remove empty strings
metches = metches.filter(el => el.length > 1)

let confusables = {}

//creating and filtering the json file
metches.forEach(match => {
    let key = match.shift().toLowerCase()
    if (key.match(/\w/gi)) key = key.replace(/[^a-zA-Z0-9]/gi, "")
    if (key.match(/\(\w*\)/gi)) key = key.replace("(", "").replace(")", "")
    if (key.match(/\(\d*\)/gi)) key = key.replace("(", "").replace(")", "")
    if (key.match(/\(l\d*\)/gi)) key = key.replace("(l", "").replace(")", "")
    if (key == "rn") key = "m" //special case
    if (!Array.isArray(match)) match = match.split(",")

    confusables[key] ? confusables[key] = confusables[key].concat(match) : confusables[key] = match
});

//adding the custom characters i have
Object.keys(specials).forEach(char => {
    if (Object.keys(confusables).includes(char)) {
        confusables[char] = confusables[char].concat(specials[char])
    } else {
        confusables[char] = specials[char]
    }
})

//finding keys in values and combinging them except number keys
for (let [key, array] of Object.entries(confusables).filter(el => el[0] != "l")) {
    array.forEach(element => {
        if (!element.match(/\(\d*\)/g) && Object.keys(confusables).includes(element) && Object.keys(confusables).includes(key)) {
            
            confusables[key] = confusables[key].concat(confusables[element])
            delete confusables[element]
        }
    });
}

// removing non-english matchers
Object.keys(confusables).forEach(key => {
    if (key.match(/[^a-zA-Z0-9]/gi)) delete confusables[key]
});

//remove numbers from non number matches and remove ascii characters from matches
for (let [key, array] of Object.entries(confusables)) {
    array.forEach((element, index) => {
        if (isNaN(key) && (!isNaN(element) || element.match(/[ -~]/gi))) {
            array.splice(index, 1)
            confusables[key] = array
        }
    });
}

//save
fs.writeFileSync('./confusables/confusables.json', JSON.stringify(confusables, null, 2));