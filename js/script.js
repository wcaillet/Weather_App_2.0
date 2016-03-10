console.log('hiya bud!') // This has backbone!!
console.log($)
console.log(Backbone)

//----------------------------------------//
//           ****************            //            
//--------------------------------------//

var changeView = function(clickEvent) {
	var route = window.location.hash.substr(1),
		routeParts = route.split('/'),
		lat = routeParts[1],
		lng = routeParts[2]

	var buttonEl = clickEvent.target,
		newView = buttonEl.value
	location.hash = newView + "/" + lat + "/" + lng
}

var initView = function(someModel) {
	this.model = someModel
	var boundRender = this._render.bind(this)
	this.model.on("sync",boundRender)
}


var WeatherModel = Backbone.Model.extend({
	_generateUrl: function(lat,lng) {
		this.url = "https://api.forecast.io/forecast/95fddab35544148bbb14d85e5cf9278a/" + lat + "," + lng + "?callback=?"
	},
})

//----------------------------------------//
//          View Types                   //            
//--------------------------------------//

var CurrentlyView = Backbone.View.extend({

	el: "#tempContainer",

	initialize: initView,

	_render: function() {
		var currentlyData = this.model.attributes.currently
		this.el.innerHTML = '<div id="weatherContainer"> <p class="temp">' + currentlyData.temperature.toPrecision(2) + '&deg;</p>' + '<p class="summary">' + currentlyData.summary + '</p>' + '</div>'
	}
})

var DailyView = Backbone.View.extend({

	el: "#tempContainer",

	initialize: initView,

	_render: function() {
		console.log(this.model)
		var daysArray = this.model.attributes.daily.data
		var htmlString = ''
		for (var i = 0; i < daysArray.length; i ++) {
			var dayObject = daysArray[i]
			htmlString += '<div id="weatherContainer">'
			htmlString +=    '<p class="max"> Max Temp:' 
			htmlString +=    dayObject.temperatureMax.toPrecision(2) + '&deg;</p>'
			htmlString +=    '<p class="min"> Min Temp' 
			htmlString +=     dayObject.temperatureMin.toPrecision(2) + '&deg;</p>'
			htmlString +=	  dayObject.summary
			htmlString += '</div>'
		}
		this.el.innerHTML = htmlString		
	}
})

var HourlyView = Backbone.View.extend({

	el: "#tempContainer",

	initialize: initView,

	_render: function(){
		console.log(this.model)
		var hoursArray = this.model.attributes.hourly.data
		var htmlString = ''
		for (var i=0; i< hoursArray.length; i++) {
			var hourObject = hoursArray[i]
			htmlString += '<div id="weatherContainer">'
			htmlString +=	 '<p class="time">'
			htmlString += 	 hourObject.time + '</p>'
			htmlString +=    '<p class="temperature">'
			htmlString += 	 hourObject.temperature.toPrecision(2) + '&deg;</p>'
			htmlString +=	 '<p class="summary">' + hourObject.summary + '</p>'
			htmlString += '</div>'
		}
		this.el.innerHTML = htmlString
	}
})

//----------------------------------------//
//          Routing                      //            
//--------------------------------------//

var WeatherRouter = Backbone.Router.extend({

	routes: {
		"current/:lat/:lng": "handleCurrentWeather",
		"daily/:lat/:lng": "handleDailyWeather",
		"hourly/:lat/:lng": "handleHourlyWeather",
		"*default": "handleDefault"
	},

	handleCurrentWeather: function(lat,lng) {
		var wm = new WeatherModel()
		wm._generateUrl(lat,lng)
		var cv = new CurrentlyView(wm)
		wm.fetch()
	},

	handleDailyWeather: function(lat,lng) {
		var wm = new WeatherModel()
		wm._generateUrl(lat,lng)
		var dv = new DailyView(wm)
		wm.fetch()
	},

	handleHourlyWeather: function(lat,lng) {
		var wm = new WeatherModel()
		wm._generateUrl(lat,lng)
		var hv = new HourlyView(wm)
		wm.fetch()
	},

	handleDefault: function() {
	 	// get current lat long, write into the route
	 	var successCallback = function(positionObject) {
	 		var lat = positionObject.coords.latitude 
	 		var lng = positionObject.coords.longitude 
	 		location.hash = "current/" + lat + "/" + lng
	 	}
	 	var errorCallback = function(error) {
	 		console.log(error)
	 	}
	 	window.navigator.geolocation.getCurrentPosition(successCallback,errorCallback)
	},

	initialize: function() {
		Backbone.history.start()
	}
})


var myRtr = new WeatherRouter()

var buttonsContainer = document.querySelector("#buttonContainer")
buttonsContainer.addEventListener('click',changeView)










