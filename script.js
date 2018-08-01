var modal;
var modal2;

window.onload = function() {
	colors();
	var sb = document.getElementById('search');
	window.addEventListener('keydown', function(e) {
		if (e.keyCode == 27) {
			closeUserMenu();
			closeMenu();
		}
	});
	sb.addEventListener('keydown', function(e) {
		if (e.keyCode == 13) {
			window.location.href = 'search.html?q=' + sb.value;
		}
	});
	if (typeof importantLoad == 'function') {
		importantLoad();
	}
	modal = document.getElementById('usermenubox');
	modal2 = document.getElementById('menubox');
	var sesses = localStorage.getItem('astiw_sesses');
	var usernames = localStorage.getItem('astiw_usernames');
	if (isSet(sesses)) {
		var sessList = JSON.parse(sesses);
		var usernameList = JSON.parse(usernames);
		if (sessList.length == usernameList.length) {
			if (sessList.length > 0) {
				var ibs = document.getElementsByClassName('ib');
				var usermenu = document.getElementById('usermenu');
				usermenu.innerHTML = usernameList[0];
				for (i = 0; i < ibs.length; i++) {
					ibs[i].style.display = 'initial';
				}
				checkSess(sessList[0]);
			} else {
				notLoggedIn();
			}
		} else {
			localStorage.removeItem('astiw_sesses');
			localStorage.removeItem('astiw_usernames');
			window.location.reload();
		}
	} else {
		notLoggedIn();
	}
};

function colors() {
	var theme = localStorage.getItem('astiw_theme');
	var link = document.getElementById('themer');
	if (isSet(theme)) {
		link.href = theme;
	}
};

function chtheme(s) {
	localStorage.setItem('astiw_theme', s + '.css');
	colors();
};

function notLoggedIn() {
	var lbs = document.getElementsByClassName('lb');
	for (i = 0; i < lbs.length; i++) {
		lbs[i].style.display = 'initial';
	}
	load();
};

function isSet(thing) {
	return thing != undefined && thing != null && thing != '';
};

function checkSess(sess) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.addEventListener('load', function() {
		if (xmlHttp.responseText.split('\n')[0] == 'bad') {
			localStorage.removeItem('astiw_sesses');
			localStorage.removeItem('astiw_usernames');
			window.location.reload();
		} else {
			load();
		}
	});
	xmlHttp.addEventListener('error', function() {alert('Please connect to the internet and reload the page')});
	xmlHttp.open('get', 'https://api.stibarc.gq/checksess.sjs?sess=' + sess, true);
	xmlHttp.send();
};

function openUserMenu() {
	var accounts = document.getElementById('accounts');
	var usernames = JSON.parse(localStorage.getItem('astiw_usernames'));
	document.getElementById('userMenuProfButton').href = 'user.html?id=' + usernames[0];
	accounts.innerHTML = '<li><b>' + usernames[0] + '</b></li>';
	var oof;
	for (i = 1; i < usernames.length; i++) {
		oof = document.createElement('li');
		oof.innerHTML = '<a class="classic" href="javascript:switchUser(' + i.toString() + ')">' + usernames[i] + '</a>';
		oof.style.marginTop = '0.5em';
		accounts.appendChild(oof);
	}
	modal.style.display = 'initial';
};

function closeUserMenu() {
	modal.style.display = 'none';
};

function openMenu() {
	checkSettings();
	modal2.style.display = 'initial';
};

function checkSettings() {
	var dir = localStorage.getItem('astiw_dir') == 'true';
	var roi = localStorage.getItem('astiw_roi') == 'true';
	document.getElementById('toggleDir').innerHTML = (dir ? 'Default comment order: Oldest first' : 'Default comment order: Newest first');
	document.getElementById('toggleROI').innerHTML = (roi ? 'Requests on intervals: OFF' : 'Requests on intervals: ON');
};

function toggleSetting(setting) {
	var bool = localStorage.getItem('astiw_' + setting) == 'true';
	localStorage.setItem('astiw_' + setting, (!bool).toString());
	checkSettings();
};

function closeMenu() {
	modal2.style.display = 'none';
};

window.onclick = function(event) {
	if (event.target == modal) {
		modal.style.display = 'none';
	}
	if (event.target == modal2) {
		modal2.style.display = 'none';
	}
};

function switchUser(n) {
	var sesses = JSON.parse(localStorage.getItem('astiw_sesses'));
	var usernames = JSON.parse(localStorage.getItem('astiw_usernames'));
	var wantedSess = sesses[n];
	var wantedUsername = usernames[n];
	sesses.splice(n, 1);
	usernames.splice(n, 1);
	sesses.splice(0, 0, wantedSess);
	usernames.splice(0, 0, wantedUsername);
	localStorage.setItem('astiw_sesses', JSON.stringify(sesses));
	localStorage.setItem('astiw_usernames', JSON.stringify(usernames));
	window.location.reload();
};

function clearData() {
	if (confirm('Are you sure you want to clear local storage? This includes all signed in accounts, drafts, cached images, and settings')) {
		localStorage.clear();
		window.location.href = 'index.html';
	}
};

function getAllUrlParams(url) {
	var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
	var obj = {};
	if (queryString) {
		queryString = queryString.split('#')[0];
		var arr = queryString.split('&');
		for (var i = 0; i < arr.length; i++) {
			var a = arr[i].split('=');
			var paramNum = undefined;
			var paramName = a[0].replace(/\[\d*\]/, function (v) {
				paramNum = v.slice(1, -1);
				return '';
			});
			var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];
			paramName = paramName;
			paramValue = paramValue;
			if (obj[paramName]) {
				if (typeof obj[paramName] === 'string') {
					obj[paramName] = [obj[paramName]];
				}
				if (typeof paramNum === 'undefined') {
					obj[paramName].push(paramValue);
				}
				else {
					obj[paramName][paramNum] = paramValue;
				}
			}
			else {
				obj[paramName] = paramValue;
			}
		}
	}
	return obj;
};

function explanation() {
	alert('Some pages send a request every 0.5 seconds to check for new content and prompt you to reload to see new content if this setting is on');
};