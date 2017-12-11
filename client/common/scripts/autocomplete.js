/**
 * Created by tjdfa on 1/22/2017.
 */
export function initializeAutocomplete(elementId, callback) {
	let field = document.getElementById(elementId);
	let autocomplete = new google.maps.places.Autocomplete(field, {});
	autocomplete.addListener('place_changed', function() {
		let selectedPlace = autocomplete.getPlace();
		let placeName = selectedPlace['name'];
		let placeId = selectedPlace['place_id'];

		let place = {
			id: placeId,
			name: placeName
		};

		callback(place);

		// Show new value.
		field.value = placeName;
	});
}