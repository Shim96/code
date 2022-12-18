let map;
let historicalOverlay;

function initMap() {

	let zoom;

	if($(document).width() > 2000) {
		zoom = 10;
	} else {
		zoom = 9;
	}

  	map = new google.maps.Map(document.getElementById("map"), {
    	center: { lat: 55.8, lng: 22.1 },
    	zoom: zoom,
    	minZoom: zoom,
    	fullscreenControl: false,
    	restriction: {
	      latLngBounds: {
	        east: 24.7351,
	        north: 56.631,
	        south: 54.9551,
	        west: 19.4631
	      }
	    },
  	});



  	let imageBounds = new google.maps.LatLngBounds(
	    new google.maps.LatLng(54.955, 19.463), //SW
	    new google.maps.LatLng(56.63, 24.735)  //NE
	);

	historicalOverlay = new google.maps.GroundOverlay(
	    "/wp-content/themes/google/img/4knew.jpg",
	    imageBounds
	  );
	historicalOverlay.setMap(map);

	map.addListener("zoom_changed", function() {
		if(map.zoom > zoom) {
			historicalOverlay.setMap(null);
		} else {
			historicalOverlay.setMap(map);
		}
	});

	let markers = [];

  	$.ajax({
  		type: 'POST',
  		url: '/helper.php',
  		data: {
  			data: 'google'
  		},
  		success: function(data) {
  			let answer = JSON.parse(data);

  			$(answer).each(function(i) {
				if($(this)[0].points !== null) {
					let cat = $(this)[0].cat;
					let id = $(this)[0].ID;

					$($(this)[0].points).each(function(n) {
						if($(this)[0].platuma != 0 && $(this)[0].ilguma != 0) {

							let icon;

							if(cat == 2) {
								icon = $(this)[0].icon;
							} else if(cat == 3) {
								icon = '/wp-content/themes/google/img/3.png';
							} else if(cat == 4) {
								icon = '/wp-content/themes/google/img/4.png';
							}

							let marker = new google.maps.Marker({
						    	position: { lat: Number($(this)[0].platuma), lng: Number($(this)[0].ilguma) },
						    	map: map,
						    	icon: icon
						  	});

						  	markers.push(marker);

						  	if(cat == 2) {
								marker.type = `type2-${id}`;
							} else if(cat == 3) {
								marker.type = `type3-${id}`;
							} else if(cat == 4) {
								marker.type = `type4-${id}`;
							}


							console.log($(this)[0]);

						  	let name = $(this)[0].vardas,
						  		text = $(this)[0].text,
						  		photo = $(this)[0].photo,
						  		audio = $(this)[0].audio,
						  		video = $(this)[0].video,
						  		location = $(this)[0].lokacija;

						  	marker.addListener('click', function() {
						  		let popap;
						  		popap = `<div class="modal-wrap">
							  				<div class="modal">
							  					<span class="close">&#10006;</span>
							  					<div class="column-2">
							  						<div class="slider-wrap">
							  							<div class="slider">`;
							  	if(photo != undefined) {
							  		$(photo).each(function(i) {
							  			console.log(this);
							  			popap += `<div class="slide">
							  						<img src="${this.url}" title="${this.title}">
							  					</div>`;
							  		});
							  	}

							  	if(audio != undefined && audio != false) {
							  		console.log(audio);
							  		let audioUrl = audio.url;
							  		if(audio.url == undefined) {
							  			audioUrl = audio;
							  		}
						  			popap += `<div class="slide">
						  			            <img class="blank" src="/wp-content/themes/google/img/blank.png">
						  						<audio controls id="audio">
													<source src="${audioUrl}">
												</audio>
						  					</div>`;
							  	}

							  	if(video != undefined && video != false) {
							  		console.log(video);
							  		popap += `<div class="slide">
						  						<video controls>
													<source src="${video.url}">
												</video>
						  					</div>`;
							  	}

							  	popap +=				`</div>
							  							<div class="slider-bottom">`

							  	if(photo != undefined) {
							  		$(photo).each(function(i) {
							  			popap += `<div class="slide-bottom">
							  						<img src="${this.url}" title="${this.title}">
							  					</div>`;
							  		});
							  	}

							  	if(audio != undefined && audio != false) {
						  			popap += `<div class="slide-bottom">
							  						<img src="/wp-content/themes/google/img/audio.jpg">
							  					</div>`;
							  	}

							  	if(video != undefined && video != false) {
							  		popap += `<div class="slide-bottom">
							  						<img src="/wp-content/themes/google/img/video.jpg">
							  					</div>`;
							  	}

							  	popap +=			    `</div>`;
							  	if(audio != undefined && audio != false) {
							  		popap +=				`<div class="audio">Garso įrašas</div>`;
							  	}
							  	popap +=				`</div>


							  							<h3>${name}</h3>
							  							<div class="location"><img src="/wp-content/themes/google/img/place.png">${location}</div>
							  							${text}

							  					</div>
							  				</div>
						  				</div>`;
							  	$('body').append(popap);
							  	$('.slider').slick({
							  		nextArrow: '<span class="arrow next"></span>',
    								prevArrow: '<span class="arrow prev"></span>',
    								asNavFor: '.slider-bottom'
							  	});
							  	$('.slider-bottom').slick({
							  		nav: false,
							  		arrows: false,
							  		dots: false,
							  		slidesToShow: 6,
							  		asNavFor: '.slider',
							  		focusOnSelect: true
							  	});
							  	$('.audio').on('click', function() {
							  		$('.slider-bottom').find('img[src="/wp-content/themes/google/img/audio.jpg"]').closest('.slide-bottom').trigger('click');
							  		document.getElementById('audio').play();
							  	});
							});

							$('body').off('click').on('click', '.close', function() {
								$('.modal-wrap').remove();
							});
						}
					});
				}
			});
  		}
  	});

  	$i = 0;

  	$('.item-before').on('click', function() {
  		let data = $(this).closest('.item-js').data('id');
  		$i++;
		if($(this).hasClass('active')) {
			$(this).removeClass('active');
			$(this).siblings('.submenu').find('.submenu-item').removeClass('active');
			for (var i = 0; i < markers.length; i++) {
				if(data == 2) {
					if(markers[i].type.substring(0, 5) == 'type2') {
						markers[i].setVisible(false);
					}
				} else if(data == 3) {
					if(markers[i].type.substring(0, 5) == 'type3') {
						markers[i].setVisible(false);
					}
				} else if(data == 4) {
					if(markers[i].type.substring(0, 5) == 'type4') {
						markers[i].setVisible(false);
					}
				}
			}
		} else {
			$(this).addClass('active');
			$(this).siblings('.submenu').find('.submenu-item').removeClass('active');
			for (var i = 0; i < markers.length; i++) {
				if(data == 2) {
					if($i == 1) {
						markers[i].setVisible(false);
					}
					if(markers[i].type.substring(0, 5) == 'type2') {
						markers[i].setVisible(true);
					}
				} else if(data == 3) {
					if($i == 1) {
						markers[i].setVisible(false);
					}
					if(markers[i].type.substring(0, 5) == 'type3') {
						markers[i].setVisible(true);
					}
				} else if(data == 4) {
					if($i == 1) {
						markers[i].setVisible(false);
					}
					if(markers[i].type.substring(0, 5) == 'type4') {
						markers[i].setVisible(true);
					}
				}
			}
		}
	});

  	$('.submenu-item').on('click', function() {
  		let id = $(this).data('id');
  		let parent = $(this).closest('.item-js').data('id');
  		let check = Number($(this).closest('.item-js').data('check'));
  		if($(this).hasClass('active')) {
  			$(this).removeClass('active');
  			check--;
  			$(this).closest('.item-js').data('check', check);
  			for (var i = 0; i < markers.length; i++) {
  				if(markers[i].type.substring(6) == id) {
  					markers[i].setVisible(false);
  				}
  				if(check == 0) {
	  				if(markers[i].type.substring(4).substring(0, 1) == parent) {
	  					markers[i].setVisible(true);
	  				}
	  			}
  			}
  			if(!$(this).siblings('.submenu-item').hasClass('active')) {
  				$(this).closest('.submenu').siblings('.item-before').addClass('active');
  			}
  		} else {
  			$(this).closest('.submenu').siblings('.item-before').addClass('active');
  			$(this).addClass('active');
  			check++;
  			$(this).closest('.item-js').data('check', check);
  			for (var i = 0; i < markers.length; i++) {
  				if(check == 1) {
	  				if(markers[i].type.substring(4).substring(0, 1) == parent) {
	  					markers[i].setVisible(false);
	  				}
	  			}
  				if(markers[i].type.substring(6) == id) {
  					markers[i].setVisible(true);
  				}
  			}
  		}

  	});
}
