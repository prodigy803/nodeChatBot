var natural = require('natural'),

stemmer = natural.PorterStemmer;

var stem = stemmer.stem('stems');

console.log(stem);

stem = stemmer.stem('stemming');

console.log(stem);

stem = stemmer.stem('stemmed');

console.log(stem);

stem = stemmer.stem('stem');

console.log(stem);


var natural = require('natural'),

    TfIdf = natural.TfIdf,

    tfidf = new TfIdf();

tfidf.addDocument(user_input);

console.log('node');

tfidf.tfidfs('node', function(i, measure) {

    console.log('document #' + i + ' is ' + measure);

});

console.log('ruby --------------------------------');

tfidf.tfidfs('ruby', function(i, measure) {

    console.log('document #' + i + ' is ' + measure);

});

var NGrams = natural.NGrams;

console.log(NGrams.trigrams('some other words here'));

console.log(NGrams.trigrams(['some',  'other', 'words',  'here']));