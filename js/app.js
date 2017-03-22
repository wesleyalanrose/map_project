function mapViewModel() {
	var self = this;
	var map, infowindow;

	var subwayLocations = [];
	this.stationList = ko.observableArray([]);
	this.filteredStationList = ko.observableArray([]);
	this.nameFilteredStationList = ko.observableArray([]);
	this.mapMarkers = ko.observableArray([]);
	this.requestStatus = ko.observable('Searching for Subway Stations.');
	this.lineToFilter = ko.observable('');
	this.stationToFilter = ko.observable('');
	this.barList = ko.observableArray([]);
	this.barMarkers = ko.observableArray([]);

	function mapMarkers(array) {
		$.each(array, function(index, value) {
			var latitude = value.lat,
				longitude = value.lon,
				loc = new google.maps.LatLng(latitude, longitude),
				stationName = value.stationName;

			var contentString = '<p>'+stationName+'<p>';

			var marker = new google.maps.Marker({
				icon: {
					url: 'img/underground.png',
					origin: new google.maps.Point(0, 0),
					anchor: new google.maps.Point(12.5, 40)
				},
				position: loc,
				title: stationName,
				map: map
			});

			self.mapMarkers.push({marker: marker, content: contentString});

			//infowindow on-click lister to then search for nearby bars
			google.maps.event.addListener(marker, 'click', function() {
				infowindow.setContent(contentString);
				map.setZoom(16);
				map.setCenter(marker.position);
				infowindow.open(map, marker);
				getBars(latitude,longitude);		
			});
		});
	}

	function clearMarkers() {
		$.each(self.mapMarkers(), function(key, value) {
			value.marker.setMap(null);
		});
		self.mapMarkers([]);
	}	

	this.clearFilter = function() {
		self.filteredStationList([]);
		self.lineToFilter('');
		self.stationToFilter('');
		clearMarkers();
		self.barList([]);
	}

	this.searchLines = function() {
		var searchRoute = this.lineToFilter();
		var stations = self.stationList();

		if (!searchRoute) {
			return;
		}
		else {
			self.filteredStationList([]);

			for (var i = 0; i < stations.length; i++) {
				if (stations[i].trainLines.indexOf(searchRoute) != -1) {				
					self.filteredStationList.push(stations[i]);					
				}
			}
		}

		mapMarkers(self.filteredStationList());
	} 

	this.searchStations = function() {
		var searchStations = this.stationToFilter();
		var stations = self.filteredStationList();

		if (!searchStations) {
			return;
		}
		else {
			self.nameFilteredStationList([]);
			clearMarkers();
			for (var i = 0; i < stations.length; i++) {
				if (stations[i].stationName.indexOf(searchStations) != -1) {
					self.filteredStationList.push(stations[i]);					
				}
			}
		}

		mapMarkers(self.nameFilteredStationList());
	}

	function mapInitialize() {
		var mapOptions = {
				zoom: 12,
				center: new google.maps.LatLng(40.683677, -73.940600),
				mapTypeControl: false,
				disableDefaultUI: true
		}
		map = new google.maps.Map(document.getElementById('mapDiv'), mapOptions);
		


		infowindow = new google.maps.InfoWindow({maxWidth: 300});
		getStations();

	}

	function getStations() {
		var point;
		$.ajax({
			url: 'https://data.cityofnewyork.us/api/views/kk4q-3rt2/rows.json',
			success: function (e) {
				for(var i=0; i<e.data.length; i++)
				{
					point = e.data[i][11];
					self.stationList.push({
						stationName: e.data[i][10],
						lon: point.substring(7,point.indexOf(' ', 8)),
						lat: point.substring(point.indexOf(' ', 8)+1,point.indexOf(')')),
						trainLines: e.data[i][12],
						trainLinesSplit: (e.data[i][12]).split('-')
					});
				}
			},
			error: function() {
				console.error('Annnnnd ya broke it. Try refreshing.');
			}	   	
		});
		//mapMarkers(self.stationList());
	}

	function getBars(lat, lng) {
		/**
		 * Generates a random number and returns it as a string for OAuthentication
		 * @return {string}
		 */

		self.barList([]); //clear out previous bars.

		function nonce_generate() {
		  return (Math.floor(Math.random() * 1e12).toString());
		}

		var yelp_url = 'https://api.yelp.com/v2/search?';

	    var parameters = {
	    	term: 'bar',
	    	sort: 1,
	    	ll: lat+','+lng,
	    	limit: 5,
	    	radius_filter: 1000,
	    	category_filter: 'divebars,pubs,beerbar',
			oauth_consumer_key: 'Mj9YJWoxf89RdIGDXzBLbw',
			oauth_token: 'xuGfycVOedtdGKBvBKnmk8MMcKDvb-VX',
			oauth_nonce: nonce_generate(),
			oauth_timestamp: Math.floor(Date.now()/1000),
			oauth_signature_method: 'HMAC-SHA1',
			oauth_version : '1.0',
			callback: 'cb'              // This is crucial to include for jsonp implementation in AJAX or else the oauth-signature will be wrong.
	    };

	    var encodedSignature = oauthSignature.generate('GET',yelp_url, parameters, 'bWz6BEaW-pBkdax5v6u5SmODMAs', 'mGOEBCJPSTKaphctk43x3LTl1B0');
	    parameters.oauth_signature = encodedSignature;

		var settings = {
			url: yelp_url,
			data: parameters,
			cache: true,                // This is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
			dataType: 'jsonp',
			success: function(e) {
				$.each(e.businesses, function(index, value)
				{	
					var contentString = '<p>' + value.name + '</p><img src="'+value.image_url+'"<p>'+ value.phone + '</p>';
					var bMarker = new google.maps.Marker({
						icon: {
							url: 'img/bar.png',
							origin: new google.maps.Point(0, 0),
							anchor: new google.maps.Point(12.5, 40)
						},
						position: new google.maps.LatLng(value.location.coordinate.latitude, value.location.coordinate.longitude),
						title: value.name,
						map: map
					});

					google.maps.event.addListener(bMarker, 'click', function() {
						infowindow.setContent(contentString);
						infowindow.open(map, bMarker);
					});

					self.mapMarkers.push({marker: bMarker, content: contentString});
				});
			},
			fail: function() {
				console.error('it didnt work');
			}
		};

	    // Send AJAX query via jQuery library.
	    $.ajax(settings);
	}

	this.searchBarShow = ko.observable(true);
	this.searchToggle = function() {
		if(self.searchBarShow() === true) {
			self.searchBarShow(false);
		} else {
			self.searchBarShow(true);
		}
	};

	mapInitialize();
}



ko.applyBindings(mapViewModel);