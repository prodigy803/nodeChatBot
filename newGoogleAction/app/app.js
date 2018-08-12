'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const {App} = require('jovo-framework');

const config = {
    logging: true,
};

const app = new App(config);


// =================================================================================
// App Logic
// =================================================================================

app.setHandler({
    'LAUNCH': function() {
        this.toIntent('HelloWorldIntent');
    },

    'HelloWorldIntent': function() {
        this.ask('Hello World! What\'s your name?', 'Please tell me your name.');
    },

    'MyNameIsIntent': function(name) {
        this.tell('Hey ' + name.value + ', nice to meet you! Can you fuckoff');
    },
    'WhatIsTheCategoryIntent' : function(cat){
        this.close('Is this _' + cat.value +'_ the category?');
        /*
        opHelper.execute('ItemSearch', {
            'Keywords': cat.value,
            'SearchIndex':'All',
            'ResponseGroup': 'Images,ItemAttributes'
        }).then((response) => {
            //console.log("Results object: ", response.result);
            //this.ask('The Result is _' + response.responseBody +'_ ');
            //var xml = response.responseBody;
            //var xmlDoc = libxmljs.parseXml(xml);

            //var gchild = xmlDoc.get('//LargeImage');
            //console.log("some url" + gchild.text());
            //parser.parseString(xml, function (err, result) {
            //    console.log(result['ItemSearchResponse']['Items']);
            //});

            //console.log("Raw response body: ", response.responseBody);
            }).catch((err) => {
                console.error("Something went wrong! ", err);
            });
            */

    }
});

module.exports.app = app;
