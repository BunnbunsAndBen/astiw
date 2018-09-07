var modal;
var sessesAtLoad;

window.onload = function() {
	colors();
	document.getElementById('cssshade').style.display = 'none';
	var sb = document.getElementById('search');
	window.addEventListener('keydown', function(e) {
		if (e.keyCode == 27) {
			closeUserMenu();
		}
	});
	sb.addEventListener('keydown', function(e) {
		if (e.keyCode == 13) {
			if (isSet(sb.value)) {
				window.location.href = 'search.html?q=' + encodeURIComponent(sb.value);
			}
		}
	});
	if (typeof importantLoad == 'function') {
		importantLoad();
	}
	modal = document.getElementById('usermenubox');
	window.addEventListener('click', function(e) {
		if (event.target == modal) {
			modal.style.display = 'none';
		}
	});
	var sesses = localStorage.getItem('astiw_sesses');
	var usernames = localStorage.getItem('astiw_usernames');
	if (isSet(sesses)) {
		var sessList = JSON.parse(sesses);
		var usernameList = JSON.parse(usernames);
		if (sessList.length == usernameList.length) {
			if (sessList.length > 0) {
				sessesAtLoad = sessList;
				var ibs = document.getElementsByClassName('ib');
				var usermenu = document.getElementById('usermenu');
				usermenu.innerHTML = usernameList[0];
				for (i = 0; i < ibs.length; i++) {
					ibs[i].style.display = 'initial';
				}
				if (usernameList[0] == 'Anon') {
					var stsbsiyaa = document.getElementsByClassName('noanon');
					for (ite = 0; ite < stsbsiyaa.length; ite++) {
						stsbsiyaa[ite].style.display = 'none';
					}
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

function sessHasChanged() {
	var sessesStorage = localStorage.getItem('astiw_sesses');
	return (isSet(sessesAtLoad) && isSet(sessesAtLoad[0]) ? sessesAtLoad[0] : '') != (isSet(sessesStorage) && isSet(JSON.parse(sessesStorage)[0]) ? JSON.parse(sessesStorage)[0] : '');
};

function getCurrentUser() {
	var lsu = localStorage.getItem('astiw_usernames');
	if (isSet(lsu) && JSON.parse(lsu).length > 0) {
		return JSON.parse(lsu)[0];
	} else {
		return '';
	}
};

function putLinksInText(inp) {
	var list = inp.split(/( |<br\/>)/g);
	var temp;
	var temptwo;
	var tempName;
	var currentUser = getCurrentUser();
	for (j = 0; j < list.length; j++) {
		if (list[j].substring(0,7) == 'http://' || list[j].substring(0,8) == 'https://') {
			temp = list[j];
			if (localStorage.getItem('astiw_replacesl') == 'true') {
				temptwo = switchta(temp);
				if (temptwo != 'bad') {
					temp = temptwo;
				}
			}
			list[j] = '<a class="classic" target="_blank" href="' + encodeURI(temp) + '">' + temp + '</a>';
		} else if (list[j][0] == '@' && list[j].length >= 2) {
			temp = list[j];
			tempName = list[j].substring(1);
			list[j] = '<a class="classic" ' + (tempName == currentUser ? 'style="color:var(--you);" ' : '') + 'href="user.html?id=' + encodeURIComponent(tempName) + '">' + temp + '</a>';
		}
	}
	return list.join('');
};

function switchta(cpURL) {
	var rptn = 'bad';
	if (cpURL.indexOf('https://stibarc.gq/post.html') == 0) {
		rptn = 'post.html' + cpURL.substring(28);
	} else if (cpURL == 'https://stibarc.gq/newpost.html') {
		rptn = 'newpost.html';
	} else if (cpURL == 'https://stibarc.gq/search.html') {
		rptn = 'search.html';
	} else if (cpURL.indexOf('https://stibarc.gq/user.html') == 0) {
		rptn = 'user.html' + cpURL.substring(28);
	} else if (cpURL == 'https://stibarc.gq/login.html') {
		rptn = 'login.html';
	} else if (cpURL == 'https://stibarc.gq/register.html') {
		rptn = 'register.html';
	}
	return rptn;
};

function colors() {
	var theme = localStorage.getItem('astiw_theme');
	var link = document.getElementById('themer');
	if (isSet(theme)) {
		if (theme == 'custom') {
			var customTheme = localStorage.getItem('astiw_customtheme');
			if (isSet(customTheme)) {
				link.href = customTheme;
			} else {
				link.href = 'themes/dark.css';
			}
		} else {
			link.href = 'themes/' + theme;
		}
	}
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
	xmlHttp.addEventListener('error', function() {alert('Could not connect to STiBaRC, please reload the page and try again')});
	xmlHttp.open('get', 'https://api.stibarc.gq/v2/checksess.sjs?sess=' + sess, true);
	xmlHttp.send();
};

function openUserMenu() {
	if (!sessHasChanged()) {
		var accounts = document.getElementById('accounts');
		accounts.innerHTML = '';
		var me = document.getElementById('currentUserName');
		var showsess = localStorage.getItem('astiw_showsess') == 'true';
		var sesses = JSON.parse(localStorage.getItem('astiw_sesses'));
		var usernames = JSON.parse(localStorage.getItem('astiw_usernames'));
		document.getElementById('userMenuProfButton').href = 'user.html?id=' + encodeURIComponent(usernames[0]);
		me.innerHTML = usernames[0] + (showsess ? ' (' + sesses[0] + ')' : '');
		var oof;
		for (i = 1; i < usernames.length; i++) {
			document.getElementById('accountSwitcher').style.display = '';
			document.getElementById('lobut').innerHTML = 'Log out this account';
			oof = document.createElement('li');
			oof.innerHTML = '<a class="classic" href="javascript:switchUser(' + i.toString() + ')">' + usernames[i] + '</a>' + (showsess ? ' (' + sesses[i] + ')' : '');
			oof.style.marginTop = '0.5em';
			accounts.appendChild(oof);
		}
		modal.style.display = 'initial';
	} else {
		sayToReload();
	}
};

function closeUserMenu() {
	modal.style.display = 'none';
};

function logoutCurrentUser() {
	if (!sessHasChanged()) {
		window.location.href = 'logout.html';
	} else {
		sayToReload();
	}
};

function switchUser(n) {
	var sessesStorage = JSON.parse(localStorage.getItem('astiw_sesses'));
	var sessesHaveChanged = false;
	if (!(sessesStorage.length == sessesAtLoad.length)) {
		sessesHaveChanged = true;
	} else {
		for (i = 0; i < sessesAtLoad.length; i++) {
			if (sessesAtLoad[i] != sessesStorage[i]) {
				sessesHaveChanged = true;
			}
		}
	}
	if (!sessesHaveChanged) {
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
	} else {
		alert('The logged in accounts have changed, please reload the page');
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
			var paramName = a[0].replace(/\[\d*\]/, function(v) {
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

function addRecent(id, item, b) {
	var main = document.getElementById('main');
	var el = document.createElement('a');
	var menulist = [];
	var home = typeof youreOnTheHomepage !== 'undefined' && youreOnTheHomepage == true;
	var card = home && localStorage.getItem('astiw_cardview') == 'true';
	el.id = 'postItem' + id;
	el.href = 'post.html?id=' + id;
	el.className = 'recentLinks';
	menulist.push((card ? '' : '<a id="expander' + id + '" class="classic" href="javascript:expand(' + id + ')">&#x25bc; Expand</a> | ') + '<a class="classic" href="post.html?id=' + id + '&comment">&#x1f4ac;&#xfe0e; Comment</a>');
	if (localStorage.getItem('astiw_markread') != 'true') {
		menulist.push(localStorage.getItem('astiw_viewed' + id) == 'true' ? '<a class="classic" id="prms' + id + '" href="javascript:markPost(' + id + ', false);">Mark unread</a>' : '<a class="classic" id="prms' + id + '" href="javascript:markPost(' + id + ', true);">Mark read</a>');
	}
	if (isSet(item.attachment) && item.attachment != 'none') {
		menulist.push('Image attached');
	}
	if (card) {
		el.innerHTML = '<div class="recentCard' + (b ? ' bb' : '') + '"><p class="small" style="margin-top:0;">Posted by <a class="classic" ' + (item.poster == getCurrentUser() ? 'style="color:var(--you);" ' : '') + 'href="user.html?id=' + encodeURIComponent(item.poster) + '">' + item.poster + '</a> at ' + item.postdate + (item.edited ? ' (edited)' : '') + '</p><b class="theB"' + (localStorage.getItem('astiw_markread') != 'true' && localStorage.getItem('astiw_viewed' + id) == 'true' ? ' style="opacity:0.5;"' : '') + '>' + trimTitle(item.title.replace(/</g, '&lt;').replace(/>/g, '&gt;')) +'</b><p class="fadeOutText" style="max-height:11em;">' + putLinksInText(item.content.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\r\n/g, '<br/>'))+ '</p><b><p class="small" style="margin-bottom:0;">' + menulist.join(' &#xb7; ') + '</p></b></div>';
	} else {
		el.innerHTML = '<div class="recent' + (b ? ' bb' : '') + '"><b class="theB"' + (localStorage.getItem('astiw_markread') != 'true' && localStorage.getItem('astiw_viewed' + id) == 'true' ? ' style="opacity:0.5;"' : '') + '>' + trimTitle(item.title.replace(/</g, '&lt;').replace(/>/g, '&gt;')) +'</b><p class="small">Posted by <a class="classic" ' + (item.poster == getCurrentUser() ? 'style="color:var(--you);" ' : '') + 'href="user.html?id=' + encodeURIComponent(item.poster) + '">' + item.poster + '</a> at ' + item.postdate + (item.edited ? ' (edited)' : '') + '</p><b><p class="small" style="margin-bottom:0;">' + menulist.join(' &#xb7; ') + '</p></b><p id="expanded' + id + '" style="margin-bottom:0; display:none;">' + putLinksInText(item.content.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\r\n/g, '<br/>'))+ '</p></div>';
	}
	main.appendChild(el);
	if (home) {
		lastid = id;
	}
};

function trimTitle(trimMe) {
	if (trimMe.length > 300) {
		return trimMe.substring(0, 300) + '&#x2026;';
	} else {
		return trimMe;
	}
};

function expand(numb) {
	if (document.getElementById('expanded' + numb).style.display == 'none') {
		document.getElementById('expanded' + numb).style.display = '';
		document.getElementById('expander' + numb).innerHTML = '&#x25b2; Collapse';
	} else {
		document.getElementById('expanded' + numb).style.display = 'none';
		document.getElementById('expander' + numb).innerHTML = '&#x25bc; Expand';
	}
};

function markPost(pn, whichOne) {
	localStorage.setItem('astiw_viewed' + pn, whichOne.toString());
	if (localStorage.getItem('astiw_viewed' + pn) == 'true') {
		document.getElementById('postItem' + pn).getElementsByClassName('theB')[0].style.opacity = '0.5';
		document.getElementById('prms' + pn).innerHTML = '<a class="classic" id="prms' + pn + '" href="javascript:markPost(' + pn + ', false);">Mark unread</a>';
	} else {
		document.getElementById('postItem' + pn).getElementsByClassName('theB')[0].style.opacity = '1';
		document.getElementById('prms' + pn).innerHTML = '<a class="classic" id="prms' + pn + '" href="javascript:markPost(' + pn + ', true);">Mark read</a>';
	}
};

function sayToReload() {
	alert('The selected account has changed, please reload the page');
};
