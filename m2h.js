var loc=[], hotspot=[], locNoHot=[], downloaded=[], processed=true, sidebar, makersLoc, makersLocNoHot, makersHotspot
cntrList = [["AC","Ashmore and Cartier Islands"],["AD","Andorra"],["AE","United Arab Emirates"],["AF","Afghanistan"],["AG","Antigua and Barbuda"],["AI","Anguilla"],["AL","Albania"],["AM","Armenia"],["AO","Angola"],["AQ","Antarctica"],["AR","Argentina"],["AS","American Samoa"],["AT","Austria"],["AU","Australia"],["AW","Aruba"],["AZ","Azerbaijan"],["BA","Bosnia and Herzegovina"],["BB","Barbados"],["BD","Bangladesh"],["BE","Belgium"],["BF","Burkina Faso"],["BG","Bulgaria"],["BH","Bahrain"],["BI","Burundi"],["BJ","Benin"],["BL","Saint Barthélemy"],["BM","Bermuda"],["BN","Brunei"],["BO","Bolivia"],["BQ","Caribbean Netherlands"],["BR","Brazil"],["BS","Bahamas"],["BT","Bhutan"],["BV","Bouvet Island"],["BW","Botswana"],["BY","Belarus"],["BZ","Belize"],["CA","Canada"],["CC","Cocos (Keeling) Islands"],["CD","DR Congo"],["CF","Central African Republic"],["CG","Congo"],["CH","Switzerland"],["CI","Côte d'Ivoire"],["CK","Cook Islands"],["CL","Chile"],["CM","Cameroon"],["CN","China"],["CO","Colombia"],["CP","Clipperton Island"],["CR","Costa Rica"],["CS","Coral Sea Islands"],["CU","Cuba"],["CV","Cape Verde"],["CW","Curaçao"],["CX","Christmas Island"],["CY","Cyprus"],["CZ","Czech Republic"],["DE","Germany"],["DJ","Djibouti"],["DK","Denmark"],["DM","Dominica"],["DO","Dominican Republic"],["DZ","Algeria"],["EC","Ecuador"],["EE","Estonia"],["EG","Egypt"],["EH","Western Sahara"],["ER","Eritrea"],["ES","Spain"],["ET","Ethiopia"],["FI","Finland"],["FJ","Fiji"],["FK","Falkland Islands (Malvinas)"],["FM","Micronesia"],["FO","Faroe Islands"],["FR","France"],["GA","Gabon"],["GB","United Kingdom"],["GD","Grenada"],["GE","Georgia"],["GF","French Guiana"],["GG","Guernsey"],["GH","Ghana"],["GI","Gibraltar"],["GL","Greenland"],["GM","Gambia"],["GN","Guinea"],["GP","Guadeloupe"],["GQ","Equatorial Guinea"],["GR","Greece"],["GS","South Georgia and South Sandwich Islands"],["GT","Guatemala"],["GU","Guam"],["GW","Guinea-Bissau"],["GY","Guyana"],["HK","Hong Kong"],["HM","Heard Island and McDonald Islands"],["HN","Honduras"],["HR","Croatia"],["HT","Haiti"],["HU","Hungary"],["ID","Indonesia"],["IE","Ireland"],["IL","Israel"],["IM","Isle of Man"],["IN","India"],["IO","British Indian Ocean Territory"],["IQ","Iraq"],["IR","Iran"],["IS","Iceland"],["IT","Italy"],["JE","Jersey"],["JM","Jamaica"],["JO","Jordan"],["JP","Japan"],["KE","Kenya"],["KG","Kyrgyzstan"],["KH","Cambodia"],["KI","Kiribati"],["KM","Comoros"],["KN","Saint Kitts and Nevis"],["KP","North Korea"],["KR","South Korea"],["KW","Kuwait"],["KY","Cayman Islands"],["KZ","Kazakhstan"],["LA","Laos"],["LB","Lebanon"],["LC","Saint Lucia"],["LI","Liechtenstein"],["LK","Sri Lanka"],["LR","Liberia"],["LS","Lesotho"],["LT","Lithuania"],["LU","Luxembourg"],["LV","Latvia"],["LY","Libya"],["MA","Morocco"],["MC","Monaco"],["MD","Moldova"],["ME","Montenegro"],["MF","Saint Martin (French part)"],["MG","Madagascar"],["MH","Marshall Islands"],["MK","Macedonia"],["ML","Mali"],["MM","Myanmar"],["MN","Mongolia"],["MO","Macau"],["MP","Northern Mariana Islands"],["MQ","Martinique"],["MR","Mauritania"],["MS","Montserrat"],["MT","Malta"],["MU","Mauritius"],["MV","Maldives"],["MW","Malawi"],["MX","Mexico"],["MY","Malaysia"],["MZ","Mozambique"],["NA","Namibia"],["NC","New Caledonia"],["NE","Niger"],["NF","Norfolk Island"],["NG","Nigeria"],["NI","Nicaragua"],["NL","Netherlands"],["NO","Norway"],["NP","Nepal"],["NR","Nauru"],["NU","Niue"],["NZ","New Zealand"],["OM","Oman"],["PA","Panama"],["PE","Peru"],["PF","French Polynesia"],["PG","Papua New Guinea"],["PH","Philippines"],["PK","Pakistan"],["PL","Poland"],["PM","Saint Pierre and Miquelon"],["PN","Pitcairn Islands"],["PR","Puerto Rico"],["PS","Palestinian Territory"],["PT","Portugal"],["PW","Palau"],["PY","Paraguay"],["QA","Qatar"],["RE","Réunion"],["RO","Romania"],["RS","Serbia"],["RU","Russia"],["RW","Rwanda"],["SA","Saudi Arabia"],["SB","Solomon Islands"],["SC","Seychelles"],["SD","Sudan"],["SE","Sweden"],["SG","Singapore"],["SH","Saint Helena, Ascension, and Tristan da Cunha"],["SI","Slovenia"],["SJ","Svalbard"],["SK","Slovakia"],["SL","Sierra Leone"],["SM","San Marino"],["SN","Senegal"],["SO","Somalia"],["SR","Suriname"],["SS","South Sudan"],["ST","São Tomé and Príncipe"],["SV","El Salvador"],["SX","Sint Maarten"],["SY","Syria"],["SZ","Swaziland"],["TC","Turks and Caicos Islands"],["TD","Chad"],["TF","French Southern and Antarctic Lands"],["TG","Togo"],["TH","Thailand"],["TJ","Tajikistan"],["TK","Tokelau"],["TL","Timor-Leste"],["TM","Turkmenistan"],["TN","Tunisia"],["TO","Tonga"],["TR","Turkey"],["TT","Trinidad and Tobago"],["TV","Tuvalu"],["TW","Taiwan"],["TZ","Tanzania"],["UA","Ukraine"],["UG","Uganda"],["UM","United States Minor Outlying Islands"],["US","United States"],["UY","Uruguay"],["UZ","Uzbekistan"],["VA","Vatican City (Holy See)"],["VC","Saint Vincent and the Grenadines"],["VE","Venezuela"],["VG","Virgin Islands (British)"],["VI","Virgin Islands (U.S.)"],["VN","Vietnam"],["VU","Vanuatu"],["WF","Wallis and Futuna"],["WS","Samoa"],["XK","Kosovo"],["XX","High Seas"],["YE","Yemen"],["YT","Mayotte"],["ZA","South Africa"],["ZM","Zambia"],["ZW","Zimbabwe"]];

jQuery(document).ready(function() {

	jQuery('#avada-stylesheet-inline-css').remove()
	jQuery('#avada-stylesheet-css').remove()

	//Create map   
	map = new L.Map('map1');
	//map.setView(L.latLng(46.57591, 7.84956), 8);
	map.fitWorld().zoomIn();
	baseLayers = {
		'MapBox': L.tileLayer.provider('MapBox', {id: 'rafnuss.npl3amec',accessToken: token.mapbox}).addTo(map),
		'OpenStreetMap': L.tileLayer.provider('OpenStreetMap.Mapnik'),
	};
	control = L.control.layers(baseLayers, null, { collapsed: false	}).addTo(map);
	L.MakiMarkers.accessToken = token.mapbox;
	sidebar = L.control.sidebar('sidebar').addTo(map);

	makersHotspot = L.markerClusterGroup({	
		showCoverageOnHover:1, 
		maxClusterRadius:50,
		iconCreateFunction: function(cluster) {
			return L.icon({
				iconUrl: "https://zoziologie.raphaelnussbaumer.com/wp-content/plugins/Merge2Hotspot/hotspot-icon-hotspot-plus_small.png",
				iconAnchor: [12, 30],
				popupAnchor: [0, -12],
			})
		}
	});
	makersLocNoHot = L.featureGroup();
	control.addOverlay(makersHotspot.addTo(map),'eBird Hotspot')

	jQuery("#uploadMyEBirdData").change(function(evt) {
		if (processed){
			processFile( evt.target.files[0], evt.target.files[0].size )
		}
	});

	
	// Open my data if me in url
	if ( window.location.search.substring(1).indexOf('me') !== -1 ){
		map.spin(true);
		console.log('loading personal file')
		jQuery.get("https://zoziologie.raphaelnussbaumer.com/wp-content/plugins/SeeYourObservations/MyEBirdData.csv", function(data){
			if (processed){
				map.spin(false);
				processFile(data, data.length) 
			}
		})
	}
})

function FindLocationHotspot(){
	if (downloaded.length==0){
		alert('Download the hotspots for at least one region.')
		return;
	}
	sidebar.open('messages');
	makersLocNoHot.clearLayers()
	locNoHot=[];
	control.removeLayer(makersLocNoHot)
	loc.forEach(function(l){
		var t1 = downloaded.indexOf(l.region)
		var t2 = downloaded.indexOf(l.region.split('-')[0])
		if (t1>-1 | t2>-1){
			var dist = hotspot.map(h => distance(parseFloat(l.Latitude), parseFloat(l.Longitude), h.lat, h.lng) )
			var mm = dist.reduce( (acc,curV, curI) => acc[0] > curV ? [curV, curI] : acc  ,[100000,undefined] )
			if (hotspot[mm[1]].locName == l.Location) {
				console.log(hotspot[mm[1]])
			} else {
				var pop = '<b>Name:</b> '+l.Location+'<br><b>Checklists: </b>'+ l.checklists.map( val => '<a href="https://ebird.org/view/checklist/'+val+'" target="_blank">'+val+'</a>' ).join(", ");
				pop = l.checklists.length>2 ? pop+'<br><a href="https://ebird.org/MyEBird?cmd=manageLocations" target="_blank" title="Search the location name in the search box. You need to be login in eBird">Change for all checklists</a>' : pop;
				pop = pop + '<br><a href="https://ebird.org/MyEBird?cmd=manageLocations" target="_blank" title="Search the location name in the search box. You need to be login in eBird">Suggest as a hotspot</a>'
				var m = L.marker([parseFloat(l.Latitude), parseFloat(l.Longitude)],{
					icon:L.icon({
						iconUrl: "https://zoziologie.raphaelnussbaumer.com/wp-content/plugins/Merge2Hotspot/hotspot-icon_perso_small.png",
						iconAnchor: [12, 30],
						popupAnchor: [0, -12],
					})
				}).bindPopup(pop);
				makersLocNoHot.addLayer(m);
				var link = L.polyline([[parseFloat(l.Latitude), parseFloat(l.Longitude)],[hotspot[mm[1]].lat, hotspot[mm[1]].lng]], {color: 'red'})
				makersLocNoHot.addLayer(link);
				var ll = l;
				ll.distance = mm[0];
				ll.nearbyHot = hotspot[mm[1]];
				ll.marker = m;
				ll.link = link;
				locNoHot.push(ll);
			}
		}
	})
	control.addOverlay(makersLocNoHot.addTo(map),'Locations without hotspot')
	map.fitBounds(makersLocNoHot.getBounds(), {paddingTopLeft: [500, 0]});
	makersLoc.removeFrom(map)


	var tableRef = document.getElementById('messages-table');
	locNoHot = locNoHot.sort( (l1,l2) => l1.distance<l2.distance ? -1 : (l1.distance>l2.distance ? 1:0) )
	locNoHot.forEach(function(l){
		var newRow = tableRef.insertRow(tableRef.rows.length)
		newRow.setAttribute('onclick', 'map.setView(new L.LatLng('+l.Latitude+', +'+l.Longitude+'),16)',0);
		newRow.insertCell(0).appendChild(document.createTextNode(l.Location ));
		newRow.insertCell(1).appendChild(document.createTextNode( l.nearbyHot.locName+' ('+Math.round(l.distance*1000).toString()+'m)'));
	})
}

function distance(lat1, lon1, lat2, lon2) {
	var radlat1 = Math.PI * lat1/180;
	var radlat2 = Math.PI * lat2/180;
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(Math.PI * (lon1-lon2)/180);
	return Math.acos(Math.min(dist,1)) * 180/Math.PI * 60 * 1.1515 * 1.609344
}

function processFile( file, size ){
	var percent = 0;
	var progress = 0;
	const data = [];
	jQuery('#MyPg').show()
	var pgbar = document.getElementById("MyPgBar");
	Papa.parse(file, {
		header:true,
		step: function(row,handler) {

			data.push(row.data[0]);
			progress = progress + Object.values(row.data[0]).join(',').length;

			var newPercent = Math.round(progress / size * 100);
			if (newPercent === percent) return;
			handler.pause();
			percent = newPercent;
			//pgbar.style.width = percent + '%'; 
			//pgbar.innerHTML = percent * 1  + '%';
			jQuery("#MyPgBar").css('width', percent+'%').attr('aria-valuenow', percent).html(percent * 1  + '%');
			setTimeout(function(){handler.resume()},50)
		},
		complete: function() {
			//data = results.data;
			//fields = results.meta.fields;
			processed=false

			map.spin(true);
			setTimeout(function(){

				var che = [];
				var name = [];
				data.forEach(function(d){
					if (che.indexOf(d['Submission ID'])<0 && d.Location!=undefined){
						if (name.indexOf(d.Location)<0){
							dnew={};
							dnew.Location = d.Location;
							dnew.Latitude = d.Latitude;
							dnew.Longitude = d.Longitude;
							dnew.region = d['State/Province'];
							dnew.checklists = [];
							loc.push(dnew)
							name.push(d.Location)
						}
						var i = name.indexOf(d.Location);
						loc[i].checklists.push(d['Submission ID'])
						che.push(d['Submission ID']);
					}
				})

				makersLoc = L.markerClusterGroup({	
					showCoverageOnHover:1,
					iconCreateFunction: function(e){
						var t=e.getAllChildMarkers().reduce( (c,m) => c+m.checklists.length,0)
						var i=" marker-cluster-"
						i+=10>t?"small":100>t?"medium":"large"
						t = t<1000 ? t : Math.round(t/1000)+'K'
						var divi = L.divIcon({
							html:"<div><span>"+t+"</span></div>",
							className:"marker-cluster"+i,
							iconSize: L.Point(40,40),
						})
						return divi
					}
				});

				loc.forEach(function(l){
					var pop = '<b>Name:</b> '+l.Location+' ('+l.region+')<br><b>Checklists: </b>'+ l.checklists.map( val => '<a href="https://ebird.org/view/checklist/'+val+'" target="_blank">'+val+'</a>' ).join(", ");
					var m = L.marker([parseFloat(l.Latitude), parseFloat(l.Longitude)],{
						icon:L.MakiMarkers.icon({
							icon: l.checklists.length < 100  ? l.checklists.length : (l.checklists.length < 1000 ? 'c' : 'k' ),
						})
					}).bindPopup(pop);
					m.checklists = l.checklists;
					m.name=l.Location;
					m.region = l.region;
					l.marker=m;
					makersLoc.addLayer(m);
				})

				control.addOverlay(makersLoc.addTo(map),'All Locations')
				map.fitBounds(makersLoc.getBounds(), {paddingTopLeft: [500, 0]});

				ListRegion(loc)

				map.spin(false);
				jQuery('#MyPg').hide()
			},0)
		},
	});
}


ListRegion = function(loc){
	sidebar.open('profile');
	var region = loc.reduce( function(acc, cur){
		var ind = acc.findIndex( x => x.locID == cur.region)
		if (ind <0 ){
			acc = acc.concat({locID: cur.region, count: 1})
		} else {
			acc[ind].count = acc[ind].count+1;
		}
		return acc;
	}, [] );

	region = region.sort(function(a, b){
		if(a.locID < b.locID) return -1;
		if(a.locID > b.locID) return 1;
		return 0;
	})

	var country = region.reduce( function(acc, cur){
		var ind = acc.findIndex( x => x.locID == cur.locID.split('-')[0])
		if (ind <0 ){
			var cn = cntrList.find( elmt => elmt[0] == cur.locID.split('-')[0])
			acc = acc.concat({locID: cur.locID.split('-')[0], count: cur.count, name: cn[1]})
		} else {
			acc[ind].count = acc[ind].count+cur.count;
		}
		return acc;
	}, [] )

	country.forEach(function(c){
		html = '<div class="list-group-item "><a href="#list-country-'+c.locID+'" class="list-crl-a" data-toggle="collapse"><i class="fas fa-chevron fa-chevron-right"></i>'+c.name+'</a><a href="#" class="rcl-download" id="rcl-download-'+c.locID+'"><i class="fas fa-download" ></i></a><span class="badge badge-primary badge-pill">'+c.count.toString()+'</span></div>\
		<div class="list-group collapse" id="list-country-'+c.locID+'"></div>';
		jQuery('#list-countrregionlist').append(html)
		region.forEach(function(r){
			if(r.locID.split('-')[0]==c.locID){
				html = '<div class="list-group-item"><span id="locID-'+r.locID+'">'+r.locID+'</span></a>\
				<a href="#" class="rcl-download" id="rcl-download-'+r.locID+'"><i class="fas fa-download"></i></a>\
				<span class="badge badge-primary badge-pill">'+r.count.toString()+'</span></div>';
				jQuery('#list-country-'+c.locID).append(html)
			}
		})

	})

	country.forEach(function(c){
		jQuery.get("https://ebird.org/ws2.0/ref/region/list/subnational1/"+c.locID+"?fmt=json&key="+token.ebird,function(data){
			region.forEach(function(r){
				if (r.locID.split('-')[0] == c.locID){
					var d = data.find(d=> d.code ==r.locID)
					if (d ==undefined){
						jQuery('#locID-'+r.locID).html(c.name);
					}else{
						jQuery('#locID-'+r.locID).html(d.name);
					}
				}
			})
		})
	})




	/*list.forEach(function(l,id){
		html='<div class="list-group-item"><a href="#">'+l.Location+'</a><a href="#" class="rcl-download" id="rcl-download-'+id+'"><i class="fas fa-download" ></a></div>';
		jQuery('#list-region-'+l.region).append(html)
	})*/

	setTimeout(function(){
		jQuery('.list-crl-a').on('click', function() {
			jQuery('.fa-chevron', this)
			.toggleClass('fa-chevron-right')
			.toggleClass('fa-chevron-down');
		});
		jQuery('.rcl-download').on('click', function(e) {
			e.preventDefault();
			if (!jQuery(e.target).hasClass('fa-disabled')){
				if (jQuery(e.target).hasClass('rcl-download')){
					val = jQuery(e.target).attr('id').replace('rcl-download-','')
				} else {
					val = jQuery(e.target.parentElement).attr('id').replace('rcl-download-','')
				}
				jQuery(e.target).removeClass('fa-download').addClass('fa-spinner fa-spin');
				jQuery.get("https://ebird.org/ws2.0/ref/hotspot/"+val+"?fmt=json&key="+token.ebird,function(data){
					downloaded.push(val)
					jQuery(e.target).removeClass('fa-spinner fa-spin').addClass('fa-download fa-disabled');
					//jQuery(jQuery("[id^=list-region-"+val+"]")[0]).find('i').addClass('fa-disabled');
					jQuery(jQuery("[id^=list-country-"+val+"]")[0]).find('i').addClass('fa-disabled');
					var hlocid = hotspot.map( h => h.locId);
					data.forEach(function(d){
						if (hlocid.indexOf(d.locId)<0){
							h=d;
							var m = L.marker([parseFloat(d.lat), parseFloat(d.lng)],{
								icon:L.icon({
									iconUrl: "https://zoziologie.raphaelnussbaumer.com/wp-content/plugins/Merge2Hotspot/hotspot-icon-hotspot_small.png",
									iconAnchor: [12, 30],
									popupAnchor: [0, -12],
								})
							}).bindPopup("<a href='https://ebird.org/hotspot/"+d.locId+"' target='_blank'>"+d.locName+"</a>");
							m.locName = d.locName;
							m.locId=d.locId;
							h.m = m;
							makersHotspot.addLayer(m);
							hotspot.push(h);
						}
					})
					map.fitBounds(makersHotspot.getBounds(), {paddingTopLeft: [500, 0]});
				})
			}
		});
	},0)
	
}


