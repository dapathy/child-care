/**
 * Created by tjdfa on 1/23/2016.
 */
export function handleError(error) {
	const genericError = "Oops, something unexpected happened";
	console.log("ERROR");
	console.log(error);

	//Logger.error(error);

	if (error.hasOwnProperty("stack")) {
		if (error.stack.indexOf("\"message\"") !== -1) {
			return failure(parseOnfidoError(error));
		}
		else {
			return failure(genericError);
		}
	}
	else {
		return failure(genericError);
	}
}

export function success(data) {
	//Logger.log(data);

	return {
		result: "success",
		data: data
	};
}

export function failure(message) {
	return {
		result: "failure",
		message: message
	};
}

function parseOnfidoError(exception) {
	let response = exception.message;
	
	try {
		let start = response.indexOf('{');
		let end = response.lastIndexOf('}');
		let jsonResponse = response.substring(start, end + 1);
		let error = JSON.parse(jsonResponse);

		return error.error.message;
	} catch(exception){
		return exception.message;
	}
}