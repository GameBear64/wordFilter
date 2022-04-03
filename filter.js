module.exports = async function filter(word, target, whitelist) {
  let { metaphone } = await import('metaphone');
  let { stemmer } = await import('stemmer');
  let strSim = require('string-comparison').levenshtein;
  let original = word;

  //0. remove discord emojis
  word = word.replace(/<a?:([a-zA-Z0-9_-]+):(\d{18})>/g, '');

  //1. sanitize - remove confusable unicode characters
  let confusablesFile = require('./confusables/confusables.json');
  function sanitize(word, confusables) {
    word = word.toLowerCase();
    for (const [normalChar, array] of Object.entries(confusables)) {
      array.forEach(element => {
        let regex = new RegExp(element, 'g');
        if (regex.test(word)) word = word.replace(regex, normalChar);
      });
    }
    return word;
  }
  word = sanitize(word, confusablesFile);
  if (new RegExp(target, 'gi').test(word)) return `${original} matched with ${target}`;

  //2. normalize - normilize 2 types, remove symbols, remove lonely characters
  word = word
    .normalize('NFKD')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  let veryNormalized = word
    .replace(/[^a-zA-Z0-9 ]/gi, ' ')
    .split(/\s/g)
    .reduce((acc, a) => (a.length >= 4 ? acc + ' ' + a : acc + a), '')
    .split(/\s/g)
    .reduceRight((acc, a) => (a.length >= 4 ? a + ' ' + acc : a + acc), '');
  if (new RegExp(target, 'gi').test(veryNormalized)) return `${original} normalized and matched with ${target}`;

  //2.5 after normalization check whitelist
  if (whitelist.includes(word)) return;

  //3. simularuty - for each
  let each = word.split(' ');

  for (let i = 0; i < each.length; i++) {
    if (strSim.similarity(each[i], target) >= 0.75 || strSim.similarity(stemmer(each[i]), stemmer(target)) >= 0.75) return `${original} simular to ${target}`;
  }

  //4. phonetic check - for each, all
  for (let i = 0; i < each.length; i++) {
    if (strSim.similarity(each[i], target) >= 0.5 && (metaphone(stemmer(each[i])) == metaphone(target) || metaphone(each[i]) == metaphone(target))) return `${original} sounds like ${target}`;
  }

  if (metaphone(target).length > 5 && new RegExp(metaphone(target), 'gi').test(metaphone(word))) return `${original} has a sound like ${target}`;

  //otherwise return ok
  return false;
};
