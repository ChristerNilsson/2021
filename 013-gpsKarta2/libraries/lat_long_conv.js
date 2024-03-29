// Author: Arnold Andreasson, info@mellifica.se
// Copyright (c) 2007-2016 Arnold Andreasson
// License: MIT License as follows:
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// =============================================================================
// Converts latitude and longitude between:
// - DD, Decimal degree.
// - DM, Degree/minute.
// - DMS, Degree/minute/second.
// Accepts most input formats. Parser implemented in regexp.
//
// Converts from input format.
function convert_lat_from_dd(value) {
	value = value.replace(/[N]/gi, 'N');
	value = value.replace(/[S]/gi, 'S');
	var result = value.match(/^\s*([NS\-\+]?)\s*(\d{1,3})([\.\,]\d*)?\s*([NS]?)\s*$/);
	if (result != null) {
		if ((result[2] != '') && (result[2] != null)) {
			latitude = parseFloat(result[2]);
		}
		if ((result[3] != '') && (result[3] != null) && (result[3].replace(",", ".") != ".")) {
			latitude += parseFloat(result[3].replace(",", "."));
		}
		if (latitude > 90) {
			latitude = null;
			return latitude;
		}
		if ((result[1] != '') && (result[1] != null) && ((result[1] == "S") || (result[1] == "-"))) {
			latitude *= -1;
		} else {
			if ((result[4] != '') && (result[4] != null) && ((result[4] == "S"))) {
				latitude *= -1;
			}
		}
	} else {
		latitude = null;
	}
	return latitude;
}
function convert_long_from_dd(value) {
	value = value.replace(/[E�]/gi, 'E'); // Note: �=�st for swedish users.
	value = value.replace(/[WV]/gi, 'W'); // Note: v=V�st for swedish users.
	var result = value.match(/^\s*([EW\-\+]?)\s*(\d{1,3})([\.\,]\d*)?\s*([EW]?)\s*$/);
	if (result != null) {
		if ((result[2] != '') && (result[2] != null)) {
			longitude = parseFloat(result[2]);
		}
		if ((result[3] != '') && (result[3] != null) && (result[3].replace(",", ".") != ".")) {
			longitude += parseFloat(result[3].replace(",", "."));
		}
		if (longitude > 180) {
			longitude = null;
			return longitude;
		}
		if ((result[1] != '') && (result[1] != null) && ((result[1] == "W") || (result[1] == "-"))) {
			longitude *= -1;
		} else {
			if ((result[4] != '') && (result[4] != null) && ((result[4] == "W"))) {
				longitude *= -1;
			}
		}
	} else {
		longitude = null;
	}
	return longitude;
}
function convert_lat_from_dm(value) {
	value = value.replace(/[N]/gi, 'N');
	value = value.replace(/[S]/gi, 'S');
	var result = value.match(/^\s*([NS\-\+]?)\s*(\d{1,3})\�?\s*([0-5]?[0-9])?([\.\,]\d*)?\'?\s*([NS]?)\s*$/);
	if (result != null) {
		if ((result[2] != '') && (result[2] != null)) {
			latitude = parseFloat(result[2]);
		}
		if ((result[3] != '') && (result[3] != null)) {
			latitude += parseFloat(result[3]) / 60;
		}
		if ((result[4] != '') && (result[4] != null) && (result[4].replace(",", ".") != ".")) {
			latitude += parseFloat(result[4].replace(",", ".")) / 60;
		}
		if (latitude > 90) {
			latitude = null;
			return latitude;
		}
		if ((result[1] != '') && (result[1] != null) && ((result[1] == "S") || (result[1] == "-"))) {
			latitude *= -1;
		} else {
			if ((result[5] != '') && (result[5] != null) && ((result[5] == "S"))) {
				latitude *= -1;
			}
		}
	} else {
		latitude = null;
	}
	return latitude;
}
function convert_long_from_dm(value) {
	value = value.replace(/[E�]/gi, 'E');
	value = value.replace(/[WV]/gi, 'W');
	var result = value.match(/^\s*([EW\-\+]?)\s*(\d{1,3})\�?\s*([0-5]?[0-9])?([\.\,]\d*)?\'?\s*([EW]?)\s*$/);
	if (result != null) {
		if ((result[2] != '') && (result[2] != null)) {
			longitude = parseFloat(result[2]);
		}
		if ((result[3] != '') && (result[3] != null)) {
			longitude += parseFloat(result[3]) / 60;
		}
		if ((result[4] != '') && (result[4] != null) && (result[4].replace(",", ".") != ".")) {
			longitude += parseFloat(result[4].replace(",", ".")) / 60;
		}
		if (longitude > 180) {
			longitude = null;
			return longitude;
		}
		if ((result[1] != '') && (result[1] != null) && ((result[1] == "W") || (result[1] == "-"))) {
			longitude *= -1;
		} else {
			if ((result[5] != '') && (result[5] != null) && ((result[5] == "W"))) {
				longitude *= -1;
			}
		}
	} else {
		longitude = null;
	}
	return longitude;
}

function convert_lat_from_dms(value) {
	value = value.replace(/[N]/gi, 'N');
	value = value.replace(/[S]/gi, 'S');
	var result = value.match(/^\s*([NS\-\+]?)\s*(\d{1,3})\�?\s*([0-5]?[0-9])?\'?\s*([0-5]?[0-9])?([\.\,]\d*)?\"?\s*([NS]?)\s*$/);
	if (result != null) {
		if ((result[2] != '') && (result[2] != null)) {
			latitude = parseFloat(result[2]);
		}
		if ((result[3] != '') && (result[3] != null)) {
			latitude += parseFloat(result[3]) / 60;
		}
		if ((result[4] != '') && (result[4] != null)) {
			latitude += parseFloat(result[4]) / 3600;
		}
		if ((result[5] != '') && (result[5] != null) && (result[5].replace(",", ".") != ".")) {
			latitude += parseFloat(result[5].replace(",", ".")) / 3600;
		}
		if (latitude > 90) {
			latitude = null;
			return latitude;
		}
		if ((result[1] != '') && (result[1] != null) && ((result[1] == "S") || (result[1] == "-"))) {
			latitude *= -1;
		} else {
			if ((result[6] != '') && (result[6] != null) && ((result[6] == "S"))) {
				latitude *= -1;
			}
		}
	} else {
		latitude = null;
	}
	return latitude;
}
function convert_long_from_dms(value) {
	value = value.replace(/[E�]/gi, 'E');
	value = value.replace(/[WV]/gi, 'W');
	var result = value.match(/^\s*([EW\-\+]?)\s*(\d{1,3})\�?\s*([0-5]?[0-9])?\'?\s*([0-5]?[0-9])?([\.\,]\d*)?\"?\s*([EW]?)\s*$/);
	if (result != null) {
		if ((result[2] != '') && (result[2] != null)) {
			longitude = parseFloat(result[2]);
		}
		if ((result[3] != '') && (result[3] != null)) {
			longitude += parseFloat(result[3]) / 60;
		}
		if ((result[4] != '') && (result[4] != null)) {
			longitude += parseFloat(result[4]) / 3600;
		}
		if ((result[5] != '') && (result[5] != null) && (result[5].replace(",", ".") != ".")) {
			longitude += parseFloat(result[5].replace(",", ".")) / 3600;
		}
		if (longitude > 180) {
			longitude = null;
			return longitude;
		}
		if ((result[1] != '') && (result[1] != null) && ((result[1] == "W") || (result[1] == "-"))) {
			longitude *= -1;
		} else {
			if ((result[6] != '') && (result[6] != null) && ((result[6] == "W"))) {
				longitude *= -1;
			}
		}
	} else {
		longitude = null;
	}
	return longitude;
}

// Converts to display format.
function convert_lat_to_dd(value) {
	if (value == null) {
		return '';
	}
	return value.toFixed(6); // Round.
}
function convert_long_to_dd(value) {
	if (value == null) {
		return '';
	}
	return value.toFixed(6); // Round.
}
function convert_lat_to_dm(value) {
	if (value == null) {
		return '';
	}
	value += 0.0000008; // Round (= 0.5 min).
	var degrees = Math.floor(Math.abs(value));
	var minutes = (Math.abs(value) - degrees) * 60;
	if (value >= 0) {
		return "N " + degrees + "� " +
				(Math.floor(minutes*10000)/10000).toFixed(4) + "'";
	} else {
		return "S " + degrees + "� " +
				(Math.floor(minutes*10000)/10000).toFixed(4) + "'";
	}
}
function convert_long_to_dm(value) {
	if (value == null) {
		return '';
	}
	value += 0.0000008; // Round (= 0.5 min).
	var degrees = Math.floor(Math.abs(value));
	var minutes = (Math.abs(value) - degrees) * 60;
	if (value >= 0) {
		return "E " + degrees + "� " +
				(Math.floor(minutes*10000)/10000).toFixed(4) + "'";
	} else {
		return "W " + degrees + "� " +
				(Math.floor(minutes*10000)/10000).toFixed(4) + "'";
	}
}
function convert_lat_to_dms(value) {
	if (value == null) {
		return '';
	}
	value += 0.0000014; // Round (= 0.5 sec).
	var degrees = Math.floor(Math.abs(value));
	var minutes = Math.floor((Math.abs(value) - degrees) * 60);
	var seconds = (Math.abs(value) - degrees - minutes / 60) * 3600;
	if (value >= 0) {
		return "N " + degrees + "� " + minutes + "' " +
				(Math.floor(seconds*100)/100).toFixed(2) + '"';
	} else {
		return "S " + degrees + "� " + minutes + "' " +
				(Math.floor(seconds*100)/100).toFixed(2) + '"';
	}
}
function convert_long_to_dms(value) {
	if (value == null) {
		return '';
	}
	value += 0.0000014; // Round (= 0.5 sec).
	var degrees = Math.floor(Math.abs(value));
	var minutes = Math.floor((Math.abs(value) - degrees) * 60);
	var seconds = (Math.abs(value) - degrees - minutes / 60) * 3600;
	if (value >= 0) {
		return "E " + degrees + "� " + minutes + "' " +
				(Math.floor(seconds*100)/100).toFixed(2) + '"';
	} else {
		return "W " + degrees + "� " + minutes + "' " +
				(Math.floor(seconds*100)/100).toFixed(2) + '"';
	}
}


///////////////////////////////

