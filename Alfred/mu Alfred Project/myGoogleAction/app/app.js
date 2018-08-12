'use strict';

// =================================================================================
// App Configuration
// =================================================================================

//Initializations:

//for the parser:

var xml2js = require('xml2js');

var parser = new xml2js.Parser();

//End of parser init

//Google Assitant UI initializations:

const BasicCard = require('jovo-framework').GoogleAction.BasicCard;

const Carousel = require('jovo-framework').GoogleAction.Carousel;

const OptionItem = require('jovo-framework').GoogleAction.OptionItem;

const CarouselBrowse = require('jovo-framework').GoogleAction.CarouselBrowse;

const CarouselBrowseTile = require('jovo-framework').GoogleAction.CarouselBrowseTile;

const {GoogleAction} = require('jovo-framework');

//End of Google UI Inits:

//For getting the data from amazon, we need opHelper:

const {OperationHelper} = require('apac');

const opHelper = new OperationHelper({

    awsId:     'AKIAIQWXVVSOIXRWDBIQ',
    
    awsSecret: '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',
    
    assocId:   'theaedifex-21',
    
    locale :    "IN"
    
});

//end of opHelper

//Use config for transporting the understanding to Amazons Alexa:

const config = {
    
    logging: true,
    
    intentMap: {
    
        'AMAZON.YesIntent': 'YesIntent',
    
        'AMAZON.NoIntent': 'NoIntent',
    
    },

};

//Inits for parsing and Jovo

const {App} = require('jovo-framework');

const app = new App(config);

//End of Initializations:

// =================================================================================
// App Logic
// =================================================================================

//from here on we define the intent which we get from the google assitant:

var globalCategories;

app.setHandler({

    'LAUNCH': function() 
    {

        this.toIntent('HelloWorldIntent');

    },

    'HelloWorldIntent': function() 
    {

        console.log('it works');

        this.ask('Hello World! What\'s your name?', 'Please tell me your name.');

    },

    'MyNameIsIntent': function(name) 
    {

        this.tell('Hey ' + name.value + ', nice to meet you!');

    },

    'WhatIsTheCategoryIntent' : function(cat) 
    {
        
        var workingResult;

        var MainPromise = new Promise(function(resolve, reject) 
        {
            
            var self = this;
            
            globalCategories = cat.value;
            
            opHelper.execute('ItemSearch', {

                        'Keywords': cat.value,
                        'SearchIndex':'All',
                        'ResponseGroup': 'Images,ItemAttributes'

                    }).then((response) => {
                        
                        resolve(response);
                    
                    });
        
        });
        
        var a = this;
        
        //This next promise converts the XML to JS and then sends that 
        //result to another implicit promise:
        
        MainPromise.then(function(result) 
        {
            
            //var self = this;
            
            console.log('what we got from amazon' + result);
            
            return new Promise((resolve, reject) => { // (*)
            
                var xml = result.responseBody;

                parser.parseString(xml, function (err, Parsingresult) {
                    
                    //console.log('inside first promise ' + Parsingresult);
                    
                    resolve(Parsingresult);
                });
            
            }); 
        }).then(function(result)
        { 
            
            //Here we take the xml vals and get the particular values: 
            //and then display via a carousel card:

            var self = this;
            
            //console.log("inside second promise " + result);
            
            workingResult = result;
            
            var mainOBJ = result.ItemSearchResponse;
            
            var Title = result.ItemSearchResponse;

            //Initializing all the variables:
            
            var product1_Title ;
            
            var product1_DetailPageURL ;
            
            var product1_LargeImageURL ;

            var product2_Title ;
            
            var product2_DetailPageURL ;
            
            var product2_LargeImageURL ;

            var product3_Title ;
            
            var product3_DetailPageURL ;
            
            var product3_LargeImageURL ;  
            
            //console.log(Title);
            
            try
            {
                product1_Title = result.ItemSearchResponse.Items[0].Item[0].ItemAttributes[0].Title[0];
                
                product1_DetailPageURL = result.ItemSearchResponse.Items[0].Item[0].DetailPageURL[0];
                
                product1_LargeImageURL =  result.ItemSearchResponse.Items[0].Item[0].LargeImage[0].URL[0];
            }
            catch(e)
            {
                product1_Title = result.ItemSearchResponse.Items[0].Item[3].ItemAttributes[0].Title[0];
                
                product1_DetailPageURL = result.ItemSearchResponse.Items[0].Item[3].DetailPageURL[0];
                
                product1_LargeImageURL =  result.ItemSearchResponse.Items[0].Item[3].LargeImage[0].URL[0];
            }
            try
            {
                product2_Title = result.ItemSearchResponse.Items[0].Item[1].ItemAttributes[0].Title[0];
                
                product2_DetailPageURL = result.ItemSearchResponse.Items[0].Item[1].DetailPageURL[0];
                
                product2_LargeImageURL =  result.ItemSearchResponse.Items[0].Item[1].LargeImage[0].URL[0];
            }
            catch(e)
            {
                product2_Title = result.ItemSearchResponse.Items[0].Item[4].ItemAttributes[0].Title[0];
                
                product2_DetailPageURL = result.ItemSearchResponse.Items[0].Item[4].DetailPageURL[0];
                
                product2_LargeImageURL =  result.ItemSearchResponse.Items[0].Item[4].LargeImage[0].URL[0];
            }
            try
            {
                product3_Title = result.ItemSearchResponse.Items[0].Item[2].ItemAttributes[0].Title[0];
                
                product3_DetailPageURL = result.ItemSearchResponse.Items[0].Item[2].DetailPageURL[0];
                
                product3_LargeImageURL =  result.ItemSearchResponse.Items[0].Item[2].LargeImage[0].URL[0];
            }
            catch(e)
            {

                product3_Title = result.ItemSearchResponse.Items[0].Item[5].ItemAttributes[0].Title[0];
                
                product3_DetailPageURL = result.ItemSearchResponse.Items[0].Item[5].DetailPageURL[0];
                
                product3_LargeImageURL =  result.ItemSearchResponse.Items[0].Item[5].LargeImage[0].URL[0];
            }
            
            let carousel = new CarouselBrowse();
            
            carousel.addItem(
                (new CarouselBrowseTile())
                    .setTitle(product1_Title)
                    .setDescription('Option 1')
                    .setOpenUrlAction(
                    {

                        url: product1_DetailPageURL

                    })
                    .setImage(product1_LargeImageURL, 'accessibilityText')
            );        
            
            carousel.addItem(
                (new CarouselBrowseTile())
                    .setTitle(product2_Title)
                    .setDescription('Option 2')
                    .setOpenUrlAction(
                    {

                        url: product2_DetailPageURL

                    })
                    .setImage(product2_LargeImageURL, 'accessibilityText')
            );
            carousel.addItem(
                (new CarouselBrowseTile())
                    .setTitle(product3_Title)
                    .setDescription('Option 3')
                    .setOpenUrlAction(
                    {

                        url: product3_DetailPageURL

                    })
                    .setImage(product3_LargeImageURL, 'accessibilityText')
                
            );
            
            a.googleAction().showCarouselBrowse(carousel);

            //a.googleAction().showSuggestionChips(['List', 'Carousel', 'Basic card']);
            
            a.followUpState('ShowMeMoreOptionsState').ask('Choose from list: Please say Yes if you want to see more options:');
        });
        
    },
    ShowMeMoreOptionsState :{
        
        'YesIntent': function(cat) 
        {
        
            var workingResult;

            var MainPromise = new Promise(function(resolve, reject) 
            {
                
                var self = this;
                
                opHelper.execute('ItemSearch', {

                            'Keywords': globalCategories,
                            'SearchIndex':'All',
                            'ResponseGroup': 'Images,ItemAttributes'

                        }).then((response) => {
                
                            resolve(response);
                
                        });
            });
            
            var a = this;
            
            //This next promise converts the XML to JS and then sends that 
            //result to another implicit promise:
            
            MainPromise.then(function(result) 
            {
                
                //var self = this;
                
                console.log('what we got from amazon' + result);
            
                return new Promise((resolve, reject) => { // (*)
                    
                    var xml = result.responseBody;
                    
                    parser.parseString(xml, function (err, Parsingresult) {
                        
                        //console.log('inside first promise ' + Parsingresult);
                        
                        resolve(Parsingresult);
            
                    });
            
                }); 
            }).then(function(result)
            { 
                //Here we take the xml vals and get the particular values: and then display via a carousel card:
                
                var self = this;

                //console.log("inside second promise " + result);
                
                workingResult = result;
                
                var mainOBJ = result.ItemSearchResponse;
                
                var Title = result.ItemSearchResponse;

                //Initializing all the variables:
                
                var product1_Title ;
                
                var product1_DetailPageURL ;
                
                var product1_LargeImageURL ;

                var product2_Title ;
                
                var product2_DetailPageURL ;
                
                var product2_LargeImageURL ;

                var product3_Title ;
                
                var product3_DetailPageURL ;
                
                var product3_LargeImageURL ;  
                
                //console.log(Title);
                
                try
                {
                    product1_Title = result.ItemSearchResponse.Items[0].Item[6].ItemAttributes[0].Title[0];
                    
                    product1_DetailPageURL = result.ItemSearchResponse.Items[0].Item[6].DetailPageURL[0];
                    
                    product1_LargeImageURL =  result.ItemSearchResponse.Items[0].Item[6].LargeImage[0].URL[0];
                }
                catch(e)
                {
                    product1_Title = result.ItemSearchResponse.Items[0].Item[7].ItemAttributes[0].Title[0];
                    
                    product1_DetailPageURL = result.ItemSearchResponse.Items[0].Item[7].DetailPageURL[0];
                    
                    product1_LargeImageURL =  result.ItemSearchResponse.Items[0].Item[7].LargeImage[0].URL[0];
                }
                try
                {
                    product2_Title = result.ItemSearchResponse.Items[0].Item[8].ItemAttributes[0].Title[0];
                    
                    product2_DetailPageURL = result.ItemSearchResponse.Items[0].Item[8].DetailPageURL[0];
                    
                    product2_LargeImageURL =  result.ItemSearchResponse.Items[0].Item[8].LargeImage[0].URL[0];
                }
                catch(e)
                {
                    product2_Title = result.ItemSearchResponse.Items[0].Item[9].ItemAttributes[0].Title[0];
                    
                    product2_DetailPageURL = result.ItemSearchResponse.Items[0].Item[9].DetailPageURL[0];
                    
                    product2_LargeImageURL =  result.ItemSearchResponse.Items[0].Item[9].LargeImage[0].URL[0];
                }

                let carousel = new CarouselBrowse();

                carousel.addItem(
                    (new CarouselBrowseTile())
                        .setTitle(product1_Title)
                        .setDescription('Option 1')
                        .setOpenUrlAction(
                        {

                            url: product1_DetailPageURL

                        })
                        .setImage(product1_LargeImageURL, 'accessibilityText')
                );        
                
                carousel.addItem(
                    (new CarouselBrowseTile())
                        .setTitle(product2_Title)
                        .setDescription('Option 2')
                        .setOpenUrlAction(
                        {

                            url: product2_DetailPageURL

                        })
                        .setImage(product2_LargeImageURL, 'accessibilityText')
                );

                a.googleAction().showCarouselBrowse(carousel);
                
                a.tell('Here are some more choices:');
            });
            
            /*

            let speech = 'Blue Door: You chose Yes!';

            console.log(speech);

            this.ask(speech);

            */
        
        },

        /*

        'NoIntent': function() {

            let speech = 'Blue Door: You chose No!';

            this.tell(speech);

        },

        */
    }

});

module.exports.app = app;