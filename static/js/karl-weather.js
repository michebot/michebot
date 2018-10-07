// Show Me Karl, constructor
function showMeKarl(options) {
    this.options = {
        location: options.location || "",
        woeid: options.woeid || "",
        unit: options.unit || "f",
        success: options.success || function(){},
        error: options.error || function(){}
    };

    this.query = "select * from weather.forecast where woeid";

    if (this.options.location) {
        this.query += ' in (select woeid from geo.placefinder where text="'+this.options.location+'" and gflags="R" limit 1) and u="'+this.options.unit+'"';
    } else if (this.options.woeid) {
        this.query += "="+this.options.woeid+" and u='"+this.options.unit+"'";
    } else {
        this.options.error({
            message: "This is fine"
        });
    }
}


// Fetches data using JSONP from the Yahoo! query API
showMeKarl.prototype.fetch = function(callback) {
    var script = document.createElement("script"),
        uid = "smtw" + new Date().getTime(),
        encodedQuery = encodeURIComponent(this.query.toLowerCase());

    showMeKarl[uid] = function(data) {
        delete showMeKarl[uid];
        document.body.removeChild(script);
        callback(data);
    };

    script.src = "https://query.yahooapis.com/v1/public/yql?q="
        + encodedQuery + "&format=json&callback=showMeKarl." + uid;
    document.body.appendChild(script);
};


// Get weather information
showMeKarl.prototype.now = function() {
    var instance = this;
    this.fetch(function(data) {
        if (data !== null && data.query !== null && data.query.results !== null || data.query.results.channel.description !== "Yahoo! Weather Error") {
            var result = data.query.results.channel,
                weather = {};

            // I´ve choosen to expose only the data needed.
            // There´s a lot of more data to play with here =)
            weather.temp = result.item.condition.temp;
            weather.code = result.item.condition.code;
            weather.city = result.location.city;
            weather.units = {
                temp: result.units.temperature,
                distance: result.units.distance,
                pressure: result.units.pressure,
                speed: result.units.speed
            };

            instance.options.success(weather);
        } else {
            this.options.error({
                message: "Error retrieving the latest weather information."
            });
        }
    });
};

// Shows whether Karl's around or not
var smtw = new showMeKarl({
    woeid: "12797167",
    success: function(weather) {
        if (weather.code == 10 || weather.code == 11 || weather.code == 12 || weather.code == 9 || weather.code == 20 || weather.code == 26 || weather.code == 27 || weather.code == 23 || weather.code == 29 || weather.code == 28 || weather.code == 30){
        var html = '<p>Karl (the fog) is here! 😀</p><div class="weatherIcon"><div class="fog"><div class="inner"></div></div></div>';
            html += '<p>'+weather.city+'</p>';
        document.getElementById("smtw").innerHTML = html;
      } else {
        var html = "<p>Sorry, Karl (the fog) is not around 🙃</p>";
            html += '<div class="weatherIcon"><div class="sunny"><div class="inner"></div></div></div>';
        document.getElementById("smtw").innerHTML = html;
      }
    },
    error: function(error) {
        div.innerHTML = "<p>"+error.message+"</p>";
    }
}).now();