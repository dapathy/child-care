/**
 * Created by tjdfa on 3/25/2016.
 */
export function toTitleCase (str) {
	str = str.replace(/_/g, ' ');
	return str.replace(/\b\w+/g, function(s){
		return s.charAt(0).toUpperCase() + s.substr(1).toLowerCase();
	});
}

// Autoform templates seem to assume the user lives in UTC.
export function formatDateUtc (date) {
	return moment(date).utc().format(DATE_FORMAT);
}

// Stuff from external vendors should probably be converted to local.
export function formatDateLocal (date) {
	return moment(date).local().format(DATE_FORMAT);
}

const DATE_FORMAT = "MMMM Do, YYYY";