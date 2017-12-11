/**
 * Created by tjdfa on 7/9/2016.
 */
export const DEFAULT_DISTANCE = 10; // miles
export const MAX_DISTANCE = 50;

const MILES_TO_KILOMETERS = 1.60934;

export function getBoundingBoxForUser(user, distance = MAX_DISTANCE) {
	let centerLatitude = user.privateProfile.address.latitude;
	let centerLongitude = user.privateProfile.address.longitude;
	return getBoundingBox(centerLatitude, centerLongitude, distance);
}

export function getBoundingBox(centerLatitude, centerLongitude, distance = MAX_DISTANCE) {
	const LATITUDE_DEGREE = 111.321543;
	const LONGITUDE_DEGREE = Math.cos(degreesToRadians(centerLatitude)) * LATITUDE_DEGREE;

	// convert to kilometers
	distance *= MILES_TO_KILOMETERS;

	let northLatitude = centerLatitude + (distance / LATITUDE_DEGREE);
	let southLatitude = centerLatitude - (distance / LATITUDE_DEGREE);

	let eastLongitude = centerLongitude - (distance / LONGITUDE_DEGREE);
	let westLongitude = centerLongitude + (distance / LONGITUDE_DEGREE);

	return {
		north: northLatitude,
		east: eastLongitude,
		south: southLatitude,
		west: westLongitude
	};
}

function degreesToRadians(degrees) {
	return degrees * Math.PI/180;
}