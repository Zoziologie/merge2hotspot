import $ from "jquery";
import 'bootstrap';
import * as L from 'leaflet';
import 'leaflet-sidebar-v2';
import * as Papa from 'papaparse';
import 'leaflet-makimarkers'
import 'leaflet-providers'
import 'leaflet-spin'
import 'leaflet.markercluster'

import 'bootstrap/dist/css/bootstrap.min.css';
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet-sidebar-v2/css/leaflet-sidebar.min.css";
import './style.css';
//import 'leaflet-makimarkers/MarkerCluster.css;



var cntrList = [["AC","Ashmore and Cartier Islands"],["AD","Andorra"],["AE","United Arab Emirates"],["AF","Afghanistan"],["AG","Antigua and Barbuda"],["AI","Anguilla"],["AL","Albania"],["AM","Armenia"],["AO","Angola"],["AQ","Antarctica"],["AR","Argentina"],["AS","American Samoa"],["AT","Austria"],["AU","Australia"],["AW","Aruba"],["AZ","Azerbaijan"],["BA","Bosnia and Herzegovina"],["BB","Barbados"],["BD","Bangladesh"],["BE","Belgium"],["BF","Burkina Faso"],["BG","Bulgaria"],["BH","Bahrain"],["BI","Burundi"],["BJ","Benin"],["BL","Saint Barthélemy"],["BM","Bermuda"],["BN","Brunei"],["BO","Bolivia"],["BQ","Caribbean Netherlands"],["BR","Brazil"],["BS","Bahamas"],["BT","Bhutan"],["BV","Bouvet Island"],["BW","Botswana"],["BY","Belarus"],["BZ","Belize"],["CA","Canada"],["CC","Cocos (Keeling) Islands"],["CD","DR Congo"],["CF","Central African Republic"],["CG","Congo"],["CH","Switzerland"],["CI","Côte d'Ivoire"],["CK","Cook Islands"],["CL","Chile"],["CM","Cameroon"],["CN","China"],["CO","Colombia"],["CP","Clipperton Island"],["CR","Costa Rica"],["CS","Coral Sea Islands"],["CU","Cuba"],["CV","Cape Verde"],["CW","Curaçao"],["CX","Christmas Island"],["CY","Cyprus"],["CZ","Czech Republic"],["DE","Germany"],["DJ","Djibouti"],["DK","Denmark"],["DM","Dominica"],["DO","Dominican Republic"],["DZ","Algeria"],["EC","Ecuador"],["EE","Estonia"],["EG","Egypt"],["EH","Western Sahara"],["ER","Eritrea"],["ES","Spain"],["ET","Ethiopia"],["FI","Finland"],["FJ","Fiji"],["FK","Falkland Islands (Malvinas)"],["FM","Micronesia"],["FO","Faroe Islands"],["FR","France"],["GA","Gabon"],["GB","United Kingdom"],["GD","Grenada"],["GE","Georgia"],["GF","French Guiana"],["GG","Guernsey"],["GH","Ghana"],["GI","Gibraltar"],["GL","Greenland"],["GM","Gambia"],["GN","Guinea"],["GP","Guadeloupe"],["GQ","Equatorial Guinea"],["GR","Greece"],["GS","South Georgia and South Sandwich Islands"],["GT","Guatemala"],["GU","Guam"],["GW","Guinea-Bissau"],["GY","Guyana"],["HK","Hong Kong"],["HM","Heard Island and McDonald Islands"],["HN","Honduras"],["HR","Croatia"],["HT","Haiti"],["HU","Hungary"],["ID","Indonesia"],["IE","Ireland"],["IL","Israel"],["IM","Isle of Man"],["IN","India"],["IO","British Indian Ocean Territory"],["IQ","Iraq"],["IR","Iran"],["IS","Iceland"],["IT","Italy"],["JE","Jersey"],["JM","Jamaica"],["JO","Jordan"],["JP","Japan"],["KE","Kenya"],["KG","Kyrgyzstan"],["KH","Cambodia"],["KI","Kiribati"],["KM","Comoros"],["KN","Saint Kitts and Nevis"],["KP","North Korea"],["KR","South Korea"],["KW","Kuwait"],["KY","Cayman Islands"],["KZ","Kazakhstan"],["LA","Laos"],["LB","Lebanon"],["LC","Saint Lucia"],["LI","Liechtenstein"],["LK","Sri Lanka"],["LR","Liberia"],["LS","Lesotho"],["LT","Lithuania"],["LU","Luxembourg"],["LV","Latvia"],["LY","Libya"],["MA","Morocco"],["MC","Monaco"],["MD","Moldova"],["ME","Montenegro"],["MF","Saint Martin (French part)"],["MG","Madagascar"],["MH","Marshall Islands"],["MK","Macedonia"],["ML","Mali"],["MM","Myanmar"],["MN","Mongolia"],["MO","Macau"],["MP","Northern Mariana Islands"],["MQ","Martinique"],["MR","Mauritania"],["MS","Montserrat"],["MT","Malta"],["MU","Mauritius"],["MV","Maldives"],["MW","Malawi"],["MX","Mexico"],["MY","Malaysia"],["MZ","Mozambique"],["NA","Namibia"],["NC","New Caledonia"],["NE","Niger"],["NF","Norfolk Island"],["NG","Nigeria"],["NI","Nicaragua"],["NL","Netherlands"],["NO","Norway"],["NP","Nepal"],["NR","Nauru"],["NU","Niue"],["NZ","New Zealand"],["OM","Oman"],["PA","Panama"],["PE","Peru"],["PF","French Polynesia"],["PG","Papua New Guinea"],["PH","Philippines"],["PK","Pakistan"],["PL","Poland"],["PM","Saint Pierre and Miquelon"],["PN","Pitcairn Islands"],["PR","Puerto Rico"],["PS","Palestinian Territory"],["PT","Portugal"],["PW","Palau"],["PY","Paraguay"],["QA","Qatar"],["RE","Réunion"],["RO","Romania"],["RS","Serbia"],["RU","Russia"],["RW","Rwanda"],["SA","Saudi Arabia"],["SB","Solomon Islands"],["SC","Seychelles"],["SD","Sudan"],["SE","Sweden"],["SG","Singapore"],["SH","Saint Helena, Ascension, and Tristan da Cunha"],["SI","Slovenia"],["SJ","Svalbard"],["SK","Slovakia"],["SL","Sierra Leone"],["SM","San Marino"],["SN","Senegal"],["SO","Somalia"],["SR","Suriname"],["SS","South Sudan"],["ST","São Tomé and Príncipe"],["SV","El Salvador"],["SX","Sint Maarten"],["SY","Syria"],["SZ","Swaziland"],["TC","Turks and Caicos Islands"],["TD","Chad"],["TF","French Southern and Antarctic Lands"],["TG","Togo"],["TH","Thailand"],["TJ","Tajikistan"],["TK","Tokelau"],["TL","Timor-Leste"],["TM","Turkmenistan"],["TN","Tunisia"],["TO","Tonga"],["TR","Turkey"],["TT","Trinidad and Tobago"],["TV","Tuvalu"],["TW","Taiwan"],["TZ","Tanzania"],["UA","Ukraine"],["UG","Uganda"],["UM","United States Minor Outlying Islands"],["US","United States"],["UY","Uruguay"],["UZ","Uzbekistan"],["VA","Vatican City (Holy See)"],["VC","Saint Vincent and the Grenadines"],["VE","Venezuela"],["VG","Virgin Islands (British)"],["VI","Virgin Islands (U.S.)"],["VN","Vietnam"],["VU","Vanuatu"],["WF","Wallis and Futuna"],["WS","Samoa"],["XK","Kosovo"],["XX","High Seas"],["YE","Yemen"],["YT","Mayotte"],["ZA","South Africa"],["ZM","Zambia"],["ZW","Zimbabwe"]];
var token = {
    mapbox : "pk.eyJ1IjoicmFmbnVzcyIsImEiOiIzMVE1dnc0In0.3FNMKIlQ_afYktqki-6m0g",
    ebird : "vcs68p4j67pt",
}
var processed=true;
var loc = [];
var hotspot = [];
var locNoHot = [];
var downloaded = [];

//Create map   
var map = new L.Map('map1');

//map.setView(L.latLng(46.57591, 7.84956), 8);
map.fitWorld().zoomIn();
var baseLayers = {
	'MapBox': L.tileLayer.provider('MapBox', {id: 'mapbox/streets-v11', accessToken:token.mapbox}).addTo(map),
	'OpenStreetMap': L.tileLayer.provider('OpenStreetMap.Mapnik'),
	'Satellite': L.tileLayer.provider('Esri.WorldImagery')
};
var control = L.control.layers(baseLayers, null, { collapsed: false	}).addTo(map);
L.MakiMarkers.accessToken = token.mapbox;
var sidebar = L.control.sidebar({container: 'sidebar'}).addTo(map);

var makersHotspot = L.markerClusterGroup({	
	showCoverageOnHover:1, 
	maxClusterRadius:50,
	iconCreateFunction: function(cluster) {
		return L.icon({
			iconUrl: "hotspot-icon-hotspot-plus_small.png",
			iconAnchor: [12, 30],
			popupAnchor: [0, -12],
		})
	}
});
var makersLocNoHot = L.featureGroup();
control.addOverlay(makersHotspot.addTo(map),'eBird Hotspot')

$("#uploadMyEBirdData").change(function(evt) {
	if (processed){
		processFile( evt.target.files[0], evt.target.files[0].size )
	}
});


// Open my data if me in url
if ( window.location.search.substring(1).indexOf('me') !== -1 ){
	map.spin(true);
	//console.log('loading personal file')
	$.get("MyEBirdData.csv", function(data){
		map.spin(false);
		processFile(data, data.length) 
	})
}

	
	var togglechevron = function(e) {
		$(e.target).prev().find('.fas').toggleClass('fa-chevron-down fa-chevron-up')
	};
	$('#instruction1').on('hidden.bs.collapse',togglechevron);
	$('#instruction1').on('shown.bs.collapse',togglechevron);
	$('#instruction2').on('shown.bs.collapse',togglechevron);
	$('#instruction2').on('hidden.bs.collapse',togglechevron);


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
				//console.log(hotspot[mm[1]])
			} else {
				var pop = '<p><b>Name:</b> '+l.Location+'<br><b>Checklists: </b>'+ l.checklists.map( val => '<a href="https://ebird.org/view/checklist/'+val+'" target="_blank">'+val+'</a>' ).join(", ");
				//pop = l.checklists.length>2 ? pop+'<br><a href="https://ebird.org/MyEBird?cmd=manageLocations" target="_blank" title="Search the location name in the search box. You need to be login in eBird">Change for all checklists</a>' : pop;
				//pop = pop + '<br><a href="https://ebird.org/MyEBird?cmd=manageLocations" target="_blank" title="Search the location name in the search box. You need to be login in eBird">Suggest as a hotspot</a>'
				pop += '<button role="button" class="btn btn-secondary" onclick="OpenmanageLocations(\''+l.checklists[0]+'\')"><i class="fas fa-edit"></i> Merge to/suggest as hotspot</button></p>'
				var m = L.marker([parseFloat(l.Latitude), parseFloat(l.Longitude)],{
					icon:L.icon({
						iconUrl: "hotspot-icon_perso_small.png",
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

	locNoHot = locNoHot.sort( (l1,l2) => l1.distance<l2.distance ? -1 : (l1.distance>l2.distance ? 1:0) )
	locNoHot.forEach(function(l){
		var td1 = l.Location+'<a href="#" onclick="OpenmanageLocations(\''+l.checklists[0]+'\')"><i class="fas fa-edit pad-r"></i></a>';
		var dist = l.distance<1 ?  Math.round(Math.round(l.distance*1000).toString()).toString()+'m' : Math.round(Math.round(l.distance).toString()).toString()+'km';
		var td2 =  l.nearbyHot.locName+' ('+ dist +')';
		$('#messages-table').append('<tr onclick="map.setView(new L.LatLng('+l.Latitude+', +'+l.Longitude+'),16)"><td>'+td1+'</td><td>'+td2+'</td></tr>');
	})
}

function OpenmanageLocations(subId){
	$.getJSON('https://ebird.org/ws2.0/product/checklist/view/'+subId+"?key="+token.ebird,function(data){
		window.open('https://ebird.org/MyEBird?cmd=EditLoc&locID='+data.locId,'_blank');
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
	$('#MyPg').show()
	var pgbar = document.getElementById("MyPgBar");
	Papa.parse(file, {
		header:true,
		step: function(row,handler) {

			data.push(row.data);
			/*progress = progress + Object.values(row.data[0]).join(',').length;

			var newPercent = Math.round(progress / size * 100);
			if (newPercent === percent) return;
			handler.pause();
			percent = newPercent;
			//pgbar.style.width = percent + '%'; 
			//pgbar.innerHTML = percent * 1  + '%';
			$("#MyPgBar").css('width', percent+'%').attr('aria-valuenow', percent).html(percent * 1  + '%');
			setTimeout(function(){handler.resume()},50)*/
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
							var dnew={};
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

				//var makersLoc = L.LayerGroup();
				var makersLoc = L.markerClusterGroup({	
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
					var pop = '<p><b>Name:</b> '+l.Location+' ('+l.region+')<br><b>Checklists: </b>'+ l.checklists.map( val => '<a href="https://ebird.org/view/checklist/'+val+'" target="_blank">'+val+'</a>' ).join(", ")+'</p>';
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

				makersLoc.addTo(map)
				control.addOverlay(makersLoc.addTo(map),'All Locations')
				map.fitBounds(makersLoc.getBounds(), {paddingTopLeft: [500, 0]});
				ListRegion(loc)

				map.spin(false);
				$('#MyPg').hide()
			},0)
		},
	});
}


var ListRegion = function(loc){
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
		var html = '<div class="list-group-item "><a href="#list-country-'+c.locID+'" class="list-crl-a" data-toggle="collapse"><i class="fas fa-chevron fa-chevron-right"></i><span class="chevron-margin">'+c.name+'</span></a><a href="#" class="rcl-download" id="rcl-download-'+c.locID+'"><i class="fas fa-download" ></i></a><span class="badge bg-primary bg-pill">'+c.count.toString()+'</span></div>\
		<div class="list-group collapse" id="list-country-'+c.locID+'"></div>';
		$('#list-countrregionlist').append(html)
		region.forEach(function(r){
			if(r.locID.split('-')[0]==c.locID){
				var html = '<div class="list-group-item"><span id="locID-'+r.locID+'">'+r.locID+'</span></a>\
				<a href="#" class="rcl-download" id="rcl-download-'+r.locID+'"><i class="fas fa-download"></i></a>\
				<span class="badge badge-primary badge-pill">'+r.count.toString()+'</span></div>';
				$('#list-country-'+c.locID).append(html)
			}
		})

	})

	country.forEach(function(c){
		$.getJSON("https://ebird.org/ws2.0/ref/region/list/subnational1/"+c.locID+"?fmt=json&key="+token.ebird,function(data){
			region.forEach(function(r){
				if (r.locID.split('-')[0] == c.locID){
					var d = data.find(d=> d.code ==r.locID)
					if (d ==undefined){
						$('#locID-'+r.locID).html(c.name);
					}else{
						$('#locID-'+r.locID).html(d.name);
					}
				}
			})
		})
	})




	/*list.forEach(function(l,id){
		html='<div class="list-group-item"><a href="#">'+l.Location+'</a><a href="#" class="rcl-download" id="rcl-download-'+id+'"><i class="fas fa-download" ></a></div>';
		$('#list-region-'+l.region).append(html)
	})*/

	$('.list-crl-a').on('click', function() {
		$('.fa-chevron', this)
		.toggleClass('fa-chevron-right')
		.toggleClass('fa-chevron-down');
	});

		$('.rcl-download').on('click', function(e) {
			e.preventDefault();
			if (!$(this).hasClass('fa-disabled')){
				if ($(this).hasClass('rcl-download')){
					val = $(this).attr('id').replace('rcl-download-','')
				} else {
					val = $(this.parentElement).attr('id').replace('rcl-download-','')
				}
				this.innerHTML='<i class="fa fa-spinner fa-spin"></i>'; 
				$.getJSON("https://ebird.org/ws2.0/ref/hotspot/"+val+"?fmt=json&key="+token.ebird,function(data){
					downloaded.push(val)
					$('#rcl-download-'+val)[0].innerHTML='<i class="fas fa-download"></i>'; 
					$('#rcl-download-'+val).addClass('fa-disabled');
					//$($("[id^=list-region-"+val+"]")[0]).find('i').addClass('fa-disabled');
					$($($("[id^=list-country-"+val+"]")[0]).find('.rcl-download')).each( function(e){
						e.innerHTML=='<i class="fas fa-download"></i>';
					});
					$($($("[id^=list-country-"+val+"]")[0]).find('.rcl-download')).addClass('fa-disabled');
					var hlocid = hotspot.map( h => h.locId);
					console.log(data)
					data.forEach(function(d){
						console.log(d.lat)
						if (hlocid.indexOf(d.locId)<0){
							var h=d;
							var m = L.marker([parseFloat(d.lat), parseFloat(d.lng)],{
								icon:L.icon({
									iconUrl: "hotspot-icon-hotspot_small.png",
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
}


