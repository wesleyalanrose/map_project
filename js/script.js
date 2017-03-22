var map;

/////////////////MODEL

var model = {
	markers: [
		{
			station: "8th Av",
			lat: 40.739777,
			lng: -74.002578,
			routes: "ACEL",
			visible: true,
			id: "stop1"
		},
		{
			station: "6th Av",
			lat: 40.737335,
			lng: -73.996786,
			routes: "FLM123",
			visible: true,
			id: "stop2"
		},
		{
			station: "Union Square",
			lat: 40.735736,
			lng: -73.990568,
			routes: "LNQR456",
			visible: true,
			id: "stop3"
		},
		{
			station: "3rd Av",
			lat: 40.732849,
			lng: -73.986122,
			routes: "L",
			visible: true,
			id: "stop4"
		},
		{
			station: "1st Av",
			lat: 40.730953,
			lng: -73.981628,
			routes: "L",
			visible: true,
			id: "stop5"
		},
		{
			station: "Bedford Av",
			lat: 40.717304,
			lng: -73.956872,
			routes: "L",
			visible: true,
			id: "stop6"
		},
		{
			station: "Lorimer St",
			lat: 40.714063,
			lng: -73.950275,
			routes: "GL",
			visible: true,
			id: "stop7"
		},
		{
			station: "Graham Av",
			lat: 40.714565,
			lng: -73.944053,
			routes: "L",
			visible: true,
			id: "stop8"
		},
		{
			station: "Grand St",
			lat: 40.711926,
			lng: -73.94067,
			routes: "L",
			visible: true,
			id: "stop9"
		},
		{
			station: "Montrose Av",
			lat: 40.707739,
			lng: -73.93985,
			routes: "L",
			visible: true,
			id: "stop10"
		},
		{
			station: "Morgan Av",
			lat: 40.706152,
			lng: -73.933147,
			routes: "L",
			visible: true,
			id: "stop11"
		},
		{
			station: "Jefferson St",
			lat: 40.706607,
			lng: -73.922913,
			routes: "L",
			visible: true,
			id: "stop12"
		},
		{
			station: "DeKalb Av",
			lat: 40.703811,
			lng: -73.918425,
			routes: "L",
			visible: true,
			id: "stop13"
		},
		{
			station: "Myrtle-Wyckoff Avs",
			lat: 40.699814,
			lng: -73.911586,
			routes: "LM",
			visible: true,
			id: "stop14"
		},
		{
			station: "Halsey St",
			lat: 40.695602,
			lng: -73.904084,
			routes: "L",
			visible: true,
			id: "stop15"
		},
		{
			station: "Wilson Av",
			lat: 40.688764,
			lng: -73.904046,
			routes: "L",
			visible: true,
			id: "stop16"
		},
		{
			station: "Bushwick Av - Aberdeen St",
			lat: 40.682829,
			lng: -73.905249,
			routes: "L",
			visible: true,
			id: "stop17"
		},
		{
			station: "Broadway Junction - East New York",
			lat: 40.678334,
			lng: -73.905316,
			routes: "ACJL",
			visible: true,
			id: "stop18"
		},
		{
			station: "Atlantic Av",
			lat: 40.675345,
			lng: -73.903097,
			routes: "L",
			visible: true,
			id: "stop19"
		},
		{
			station: "Sutter Av",
			lat: 40.669367,
			lng: -73.901975,
			routes: "L",
			visible: true,
			id: "stop20"
		},
		{
			station: "Livonia Av",
			lat: 40.664038,
			lng: -73.900571,
			routes: "L",
			visible: true,
			id: "stop21"
		},
		{
			station: "New Lots Av",
			lat: 40.658733,
			lng: -73.899232,
			routes: "L",
			visible: true,
			id: "stop22"
		},
		{
			station: "East 105th St",
			lat: 40.650573,
			lng: -73.899485,
			routes: "L",
			visible: true,
			id: "stop23"
		},
		{
			station: "Canarsie - Rockaway Parkway",
			lat: 40.646654,
			lng: -73.90185,
			routes: "L",
			visible: true,
			id: "stop24"
		}
	]
};

////////Octopus
var octopus = {
	init: function() {

		var mapOptions = {
			zoom: 13,
			center: new google.maps.LatLng(40.683677, -73.940600),
			mapTypeControl: false,
			disableDefaultUI: true
		}

		map = new google.maps.Map(document.getElementById('mapDiv'), mapOptions);  
		
		$("#mapDiv").append(map);

		view.init();
	},

	getMarkers: function() {
		return model.markers;
	}
};



//////////View

var view = {
	init: function() {
		var markers = octopus.getMarkers();
		var i, mLength = markers.length;
		var streetViewUrl;

		for (i = 0; i < mLength; i++) {
			if (markers[i].visible) {
				markers[i].pin = new google.maps.Marker({
					position: new google.maps.LatLng(markers[i].lat, markers[i].lng),
					map: map,
					title: markers[i].station
				});

				streetViewUrl = 'https://maps.googleapis.com/maps/api/streetview?size=200x200&location='+markers[i].lat+','+markers[i].lng+
				'&fov=90&heading=235&pitch=10&key=AIzaSyBoM5h4efcjiFRrrBBkWZUn1FudEzOGr54';

				markers[i].contentString = '<img src="' + streetViewUrl + '" alt="Street View Image of ' + markers[i].station + '">';

				var infowindow = new google.maps.InfoWindow({
				    content: markers[i].contentString
				});

				new google.maps.event.addListener(markers[i].pin, 'click', (function(marker, i) {
					return function() {
						infowindow.setContent(markers[i].contentString);
						infowindow.open(map,this);
						var windowWidth = $(window).width();
						if(windowWidth <= 1080) {
						    map.setZoom(14);
						} else if(windowWidth > 1080) {
						    map.setZoom(16);  
						}
						map.setCenter(marker.getPosition());
						markers[i].picBoolTest = true;
					}; 
				})(markers[i].pin, i));
			}
		}
	}
};

function yesNav() {
    $("#search-nav").show();
            var scrollerHeight = $("#scroller").height() + 55;
            if($(window).height() < 600) {
                $("#search-nav").animate({
                    height: scrollerHeight - 100,
                }, 500, function() {
                    $(this).css('height','auto').css("max-height", 439);
                });  
            } else {
            $("#search-nav").animate({
                height: scrollerHeight,
            }, 500, function() {
                $(this).css('height','auto').css("max-height", 549);
            });
            }
            $("#arrow").attr("src", "img/up-arrow.gif");
            isNavVisible = true;
}

octopus.init();