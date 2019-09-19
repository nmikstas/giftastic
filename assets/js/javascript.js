
/*************************************** Categories Class ****************************************/
class Categories
{
    constructor(catArray, div, callback)
    {
        this.debug = true;
        this.catArray = catArray;
        this.div = div; //The div where buttons will be added.
        this.callback = callback; //Callback used when button is pressed.

        //Display the initial buttons.
        this.displayButtons();
    }

    //add element to catArray when add button clicked.
    addElement(element)
    {
        //Check if string is empty.
        if(element === "") return;

        //Check if element already exists.
        if(this.catArray.includes(element)) return;

        //Add new element to array.
        this.catArray.push(element);

        //Display the updated buttons.
        this.displayButtons();
    }

    //Update the display of the category buttons.
    displayButtons()
    {
        this.div.empty();

        //Create and add buttons to the webpage.
        for(let i = 0; i < this.catArray.length; i++)
        {
            let button = $("<input>");
            button.addClass("btn btn-info m-2 cat-btn");
            button.attr("value", this.catArray[i]);
            button.attr("type", "button");
            button.attr("id", i);
            this.div.append(button);
        }

        var self = this;

        //Function that handles a category button click.
        $(".cat-btn").on("click", function()
        {
            let selection = $(this).attr("value");
            if(self.debug)console.log("Button clicked: " + selection);
            self.callback(selection);
        });
    }
}

/**************************************** ShowGifs Class *****************************************/
class ShowGifs
{
    constructor(div, favoritesCallback)
    {
        this.debug = true;
        this.div = div; //The div containing the gifs.
        this.callbackHandler;
        this.favoritesCallback = favoritesCallback; //Forwards favorites data.
        this.apiKey = "6hk1Q7v4JU4GcK9cDfOghfQEWwWM1DyE";
        
        this.setupHandler();  //Do this so we can use var self = this.
    }

    //Initializes the callback handler.
    setupHandler()
    {
        var self = this;
        
        //This function grabs the gifs with the Giphy API and populates the display.
        this.callbackHandler = function(searchVal)
        {
            if(self.debug)console.log("Search value: " + searchVal);
 
            //Build the query string.
            var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + searchVal +
                           "&api_key=" + self.apiKey + "&limit=10";

            if(self.debug)console.log("Query URL: " + queryURL);

            //Send query and wait for response.
            $.ajax
            ({
                url: queryURL,
                method: "GET"
            }).then(function(response)
            {
                if(self.debug)console.log(response);
                
                //This loop prepends gif divs to the webpage.
                for(let i = 0; i < response.data.length; i++)
                {
                    let animatedURL = response.data[i].images.fixed_height.url;
                    let stillURL = response.data[i].images.fixed_height_still.url
                    let rating = response.data[i].rating;
                    let title = response.data[i].title;

                    //Create the gif div.
                    var gifDiv = $("<div>");
                    gifDiv.addClass("gif-div");

                    //Get the gif image add it to the gif div.
                    var gifImage = $("<img>");
                    gifImage.attr("src", stillURL);
                    gifImage.attr("alt", title);
                    gifImage.attr("data-still", stillURL);
                    gifImage.attr("data-animate", animatedURL);
                    gifImage.attr("data-state", "still");

                    //Add the gif click event handler for animating the gif.
                    gifImage.on("click", function()
                    {
                        var animURL = $(this).attr("data-animate");
                        var stillURL = $(this).attr("data-still");
                        if($(this).attr("data-state") === "still")
                        {
                            $(this).attr("data-state", "animate");
                            $(this).attr("src", animURL);
                        }
                        else
                        {
                            $(this).attr("data-state", "still");
                            $(this).attr("src", stillURL);
                        }
                    });

                    /********************* Overlay **********************/
                    //Create an overlay div.
                    var overlay = $("<div>");
                    overlay.addClass("overlay");

                    /********************** Rating **********************/
                    //Create rating div.
                    var ratingDiv = $("<div>");
                    ratingDiv.addClass("gif-overlay-rating");

                    //Create rating text and append to the rating div.
                    var ratingText = $("<h4>");
                    ratingText.text("Rating: " + rating);
                    ratingDiv.append(ratingText);

                    //Add rating text to the overlay.
                    overlay.append(ratingDiv);

                    //Create rating tooltip.
                    var ratingTooltip = $("<div>");
                    ratingTooltip.addClass("tooltiptext");
                    ratingTooltip.text("Image rating");

                    //Add rating tooltip to the rating div.
                    ratingDiv.append(ratingTooltip);

                    /*********************** Copy ***********************/
                    //Create copy div.
                    var copyDiv = $("<div>");
                    copyDiv.addClass("gif-overlay-copy");

                    //Create the copy button and append to the copy div.
                    var copyButton = $("<input>");
                    copyButton.addClass("btn btn-light");
                    copyButton.attr("value", "copy");
                    copyButton.attr("type", "button");
                    copyButton.attr("data-url", gifImage.attr("data-animate"));
                    copyDiv.append(copyButton);

                    //Add copy div to the overlay.
                    overlay.append(copyDiv);

                    //Create the copy button tooltip.
                    var copyTooltip = $("<div>");
                    copyTooltip.addClass("tooltiptext");
                    copyTooltip.text("Copy URL to Clipboard");

                    //Add copy tooltip to the copy div.
                    copyDiv.append(copyTooltip);

                    //Create a copy URL div for copy purposes.
                    var urlDiv = $("<div>");
                    copyDiv.append(urlDiv);

                    //Add event listener to the copy button.
                    copyButton.on("click", function()
                    {
                        //Create variable to hold URL to copy.
                        var dataURL = $(this).attr("data-url");
                      
                        //Create text field to copy the value to.
                        var tempText = $("<input>");
                        tempText.attr("type", "text");
                        tempText.attr("id", "temp-text");
                        tempText.attr("value", dataURL);

                        if(self.debug)console.log("data URL: " + dataURL);

                        //Perform the copy and then remove the temporary text field.
                        urlDiv.append(tempText);
                        tempText.select();
                        document.execCommand("copy");
                        urlDiv.empty();
                    });

                    /********************* Favorite *********************/
                   //Create add div.
                    var addDiv = $("<div>");
                    addDiv.addClass("gif-overlay-add");

                    //Create the copy button and append to the copy div.
                    var addButton = $("<input>");
                    addButton.addClass("btn btn-light");
                    addButton.attr("value", "+");
                    addButton.attr("type", "button");
                    addButton.attr("data-url", gifImage.attr("data-animate"));
                    addDiv.append(addButton);

                    //Add add div to the overlay.
                    overlay.append(addDiv);

                    //Create the add button tooltip.
                    var addTooltip = $("<div>");
                    addTooltip.addClass("tooltiptext");
                    addTooltip.text("Add to Favorites");

                    //Add add tooltip to the copy div.
                    addDiv.append(addTooltip);

                    //Add event listener to the add button.
                    addButton.on("click", function()
                    {
                        //Create variables to hold data to copy.
                        var dataURL = $(this).attr("data-url");
                        if(self.debug)console.log("data URL: " + dataURL);

                        //Send image data to the favorites object.
                        self.favoritesCallback(animatedURL, stillURL, rating, title);
                    });

                    //Add the gif image to the gif div.
                    gifDiv.append(gifImage);

                    //Add the overlay to the gif div.
                    gifDiv.append(overlay);

                    //Add the gif div to the webpage.
                    self.div.prepend(gifDiv);
                }
            });
        }
    }
}

/**************************************** Favorites Class ****************************************/
class Favorites
{
    constructor(div)
    {
        this.debug = true;
        this.div = div; //The div containing the favorite gifs.
        this.callbackHandler;

        this.setupHandler();  //Do this so we can use var self = this.
    }

    //Initializes the callback handler.
    setupHandler()
    {
        var self = this;

        //This function takes the data supplied by the ShowGifs object and puts it in favorites.
        this.callbackHandler = function(animatedURL, stillURL, rating, title)
        {
            if(self.debug)
            {
                console.log("Favorites animated: " + animatedURL);
                console.log("Favorites still: " + stillURL);
                console.log("Favorites rating: " + rating);
                console.log("Favorites title: " + title);
            }

            //Create the gif div.
            var gifDiv = $("<div>");
            gifDiv.addClass("gif-div");

            //Get the gif image add it to the gif div.
            var gifImage = $("<img>");
            gifImage.attr("src", stillURL);
            gifImage.attr("alt", title);
            gifImage.attr("data-still", stillURL);
            gifImage.attr("data-animate", animatedURL);
            gifImage.attr("data-state", "still");

            //Add the gif click event handler for animating the gif.
            gifImage.on("click", function()
            {
                var animURL = $(this).attr("data-animate");
                var stillURL = $(this).attr("data-still");
                if($(this).attr("data-state") === "still")
                {
                    $(this).attr("data-state", "animate");
                    $(this).attr("src", animURL);
                }
                else
                {
                    $(this).attr("data-state", "still");
                    $(this).attr("src", stillURL);
                }
            });

            /********************* Overlay **********************/
            //Create an overlay div.
            var overlay = $("<div>");
            overlay.addClass("overlay");

            /********************** Rating **********************/
            //Create rating div.
            var ratingDiv = $("<div>");
            ratingDiv.addClass("gif-overlay-rating");

            //Create rating text and append to the rating div.
            var ratingText = $("<h4>");
            ratingText.text("Rating: " + rating);
            ratingDiv.append(ratingText);

            //Add rating text to the overlay.
            overlay.append(ratingDiv);

            //Create rating tooltip.
            var ratingTooltip = $("<div>");
            ratingTooltip.addClass("tooltiptext");
            ratingTooltip.text("Image rating");

            //Add rating tooltip to the rating div.
            ratingDiv.append(ratingTooltip);

            /*********************** Copy ***********************/
            //Create copy div.
            var copyDiv = $("<div>");
            copyDiv.addClass("gif-overlay-copy");

            //Create the copy button and append to the copy div.
            var copyButton = $("<input>");
            copyButton.addClass("btn btn-light");
            copyButton.attr("value", "copy");
            copyButton.attr("type", "button");
            copyButton.attr("data-url", gifImage.attr("data-animate"));
            copyDiv.append(copyButton);

            //Add copy div to the overlay.
            overlay.append(copyDiv);

            //Create the copy button tooltip.
            var copyTooltip = $("<div>");
            copyTooltip.addClass("tooltiptext");
            copyTooltip.text("Copy URL to Clipboard");

            //Add copy tooltip to the copy div.
            copyDiv.append(copyTooltip);

            //Create a copy URL div for copy purposes.
            var urlDiv = $("<div>");
            copyDiv.append(urlDiv);

            //Add event listener to the copy button.
            copyButton.on("click", function()
            {
                //Create variable to hold URL to copy.
                var dataURL = $(this).attr("data-url");
                      
                //Create text field to copy the value to.
                var tempText = $("<input>");
                tempText.attr("type", "text");
                tempText.attr("id", "temp-text");
                tempText.attr("value", dataURL);

                if(self.debug)console.log("data URL: " + dataURL);

                //Perform the copy and then remove the temporary text field.
                urlDiv.append(tempText);
                tempText.select();
                document.execCommand("copy");
                urlDiv.empty();
            });

            /********************** Remove **********************/
            //Create remove div.
            var remDiv = $("<div>");
            remDiv.addClass("gif-overlay-add");

            //Create the remove button and append to the remove div.
            var remButton = $("<input>");
            remButton.addClass("btn btn-light");
            remButton.attr("value", "X");
            remButton.attr("type", "button");
            remDiv.append(remButton);

            //Add remove div to the overlay.
            overlay.append(remDiv);

            //Create the remove button tooltip.
            var remTooltip = $("<div>");
            remTooltip.addClass("tooltiptext");
            remTooltip.text("Remove From Favorites");

            //Add remove tooltip to the remove div.
            remDiv.append(remTooltip);
 
            //Add event listener to the remove button.
            remButton.on("click", function()
            {
                //Clear the gifDiv.
                gifDiv.empty();
            });

            //Add the gif image to the gif div.
            gifDiv.append(gifImage);

            //Add the overlay to the gif div.
            gifDiv.append(overlay);

            //Add the gif div to the webpage.
            self.div.prepend(gifDiv);
        }
    }
}

/******************************************* Top Level *******************************************/

//Create an initial list for the categories object.
actors =
[
    "Arnold Schwarzenegger", "Kurt Russell", "Keanu Reeves", "Bruce Willis", "Christopher Walken",  
    "Leonardo DiCaprio", "Sylvester Stallone", "Jack Nicholson", "Hugo Weaving", "Morgan Freeman"
];

//Instantiate the objects that run the application.
favorites = new Favorites($(".favorites"));
showGifs = new ShowGifs($(".gifs"), favorites.callbackHandler);
categories = new Categories(actors, $(".buttons"), showGifs.callbackHandler);

$(document).ready(function()
{ 
    $('#add-actor').on('click', addButton); //Bind Add button.
});

function addButton(event)
{
    event.preventDefault();
    var value = $("#actor-input").val();

    //Add user iputted value to catergories object.
    categories.addElement(value);

    $("#actor-input").val("");//Clear text box.
}


