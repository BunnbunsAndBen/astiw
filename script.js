var modal;
// var modal2;
var sessesAtLoad;

window.onload = function() {
	colors();
	document.getElementById('cssshade').style.display = 'none';
	var sb = document.getElementById('search');
	window.addEventListener('keydown', function(e) {
		if (e.keyCode == 27) {
			closeUserMenu();
			if (typeof modalS !== 'undefined') {
				modalS.style.display = 'none';
			}
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
	// modal2 = document.getElementById('menubox');
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
				if (usernameList[0] == 'Anon') {
					var stsbsiyaa = document.getElementsByClassName('noanon');
					for (ite = 0; ite < stsbsiyaa.length; ite++) {
						stsbsiyaa[ite].style.display = 'none';
					}
				}
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
	xmlHttp.addEventListener('error', function() {alert('Please connect to the internet and reload the page')});
	xmlHttp.open('get', 'https://api.stibarc.gq/checksess.sjs?sess=' + sess, true);
	xmlHttp.send();
};

function openUserMenu() {
	if (!sessHasChanged()) {
		var accounts = document.getElementById('accounts');
		accounts.innerHTML = '';
		var me = document.getElementById('currentUserName');
		var usernames = JSON.parse(localStorage.getItem('astiw_usernames'));
		document.getElementById('userMenuProfButton').href = 'user.html?id=' + encodeURIComponent(usernames[0]);
		me.innerHTML = usernames[0];
		var oof;
		for (i = 1; i < usernames.length; i++) {
			document.getElementById('accountSwitcher').style.display = '';
			oof = document.createElement('li');
			oof.innerHTML = '<a class="classic" href="javascript:switchUser(' + i.toString() + ')">' + usernames[i] + '</a>';
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

window.onclick = function(event) {
	if (event.target == modal) {
		modal.style.display = 'none';
	}
	/* if (event.target == modal2) {
		modal2.style.display = 'none';
	} */
	if (typeof modalS !== 'undefined' && event.target == modalS) {
		modalS.style.display = 'none';
	}
};

function closeSpecificModal() {
	modalS.style.display = 'none';
};

function openSpecificModal() {
	modalS.style.display = 'initial';
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

function addRecent(item, b) {
	var i = item.indexOf(':');
	var splits = [item.slice(0, i), item.slice(i + 1)];
	var main = document.getElementById('main');
	var el = document.createElement('a');
	el.id = 'postItem' + splits[0];
	el.href = 'post.html?id=' + splits[0];
	el.className = 'recentLinks';
	el.innerHTML = '<div class="recent' + (b ? ' bb' : '') + '"><span style="float:right;"><a class="classic" href="javascript:expand(' + splits[0] + ');">&#x25bc;</a></span><b class="theB"' + (localStorage.getItem('astiw_markread') != 'true' && localStorage.getItem('astiw_viewed' + splits[0]) == 'true' ? ' style="opacity:0.5;"' : '') + '>' + splits[1].replace(/</g, '&lt;').replace(/>/g, '&gt;') +'</b></div>';
	main.appendChild(el);
	if (typeof youreOnTheHomepage !== 'undefined' && youreOnTheHomepage == true) {
		lastid = splits[0];
	}
};

function expand(numb) {
	if (!sessHasChanged()) {
		var eliq = document.getElementById('postItem' + numb).getElementsByTagName('div')[0];
		var eliqSpan = eliq.getElementsByTagName('span')[0];
		var eliqB = eliq.getElementsByClassName('theB')[0];
		eliqSpan.innerHTML = '<a href="javascript:void(0)" style="text-decoration:none;">&#x25bc;</a>';
		var jason = 'https://api.stibarc.gq/getpost.sjs?id=' + numb;
		var expdr = new XMLHttpRequest();
		var expdrv = new XMLHttpRequest();
		var expdrc = new XMLHttpRequest();
		var metastuff;
		var poststuff;
		var exans;
		var menulist = [];
		var appendMe = document.createElement('div');
		appendMe.id = 'expanded' + numb;
		var newtitleiguess;
		expdr.addEventListener('load', function() {
			if (isSet(expdr.responseText)) {
				var tkos = JSON.parse(expdr.responseText);
				var currentUser = getCurrentUser();
				metastuff = '<p class="small">Posted by <a class="classic" ' + (tkos.poster == currentUser ? 'style="color:var(--you);" ' : '') + 'href="user.html?id=' + encodeURIComponent(tkos.poster) + '">' + tkos.poster + '</a><span class="ddverif" id="verified' + numb + '"> &#x2611;&#xFE0E;</span> at ' + tkos.postdate + (tkos.edited ? ' (edited)' : '') + '</p>';
				poststuff = '<p style="white-space:pre-wrap;">' + putLinksInText(tkos.content.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\r\n/g, '<br/>')) + '</p>';
				if (isSet(tkos.attachment) && tkos.attachment != 'none') {
					menulist.push('Image attached');
				}
				newtitleiguess = tkos.title.replace(/</g, '&lt;').replace(/>/g, '&gt;');
				var jasonv = 'https://api.stibarc.gq/checkverify.sjs?id=' + tkos.poster;
				expdrv.open('get', jasonv, true);
				expdrv.send();
			} else {
				appendMe.innerHTML = '<p style="text-align:center; color:var(--border);">This post does not exist</p>';
				eliq.appendChild(appendMe);
				eliqSpan.innerHTML = '<a class="classic" href="javascript:collapse(' + numb + ');">&#x25b2;</a>';
			}
		});
		expdrv.addEventListener('load', function() {
			exans = expdrv.responseText.split('\n')[0];
			var jasonc = 'https://api.stibarc.gq/getcomments.sjs?id=' + numb;
			expdrc.open('get', jasonc, true);
			expdrc.send();
		});
		expdrc.addEventListener('load', function() {
			if (isSet(expdrc.responseText) && expdrc.responseText != 'undefined\n') {
				var objComments = JSON.parse(expdrc.responseText);
				var counter = 0;
				for (key in objComments) {
					counter++;
				}
				if (counter == 1) {
					menulist.splice(0, 0, '1 comment');
				} else {
					menulist.splice(0, 0, counter.toString() + ' comments');
				}
			} else {
				menulist.splice(0, 0, '0 comments');
			}
			if (localStorage.getItem('astiw_markread') != 'true') {
				menulist.splice(1, 0, (localStorage.getItem('astiw_viewed' + numb) == 'true' ? '<a class="classic" id="prms' + numb + '" href="javascript:markPost(' + numb + ', false);">Mark unread</a>' : '<a class="classic" id="prms' + numb + '" href="javascript:markPost(' + numb + ', true);">Mark read</a>'))
			}
			appendMe.innerHTML = metastuff + poststuff + '<b><p class="small">' + menulist.join(' &#xb7; ') + '</p></b>';
			eliqB.innerHTML = newtitleiguess;
			eliq.appendChild(appendMe);
			if (exans == 'true') {
				document.getElementById('verified' + numb).style.display = 'initial';
			}
			eliqSpan.innerHTML = '<a class="classic" href="javascript:collapse(' + numb + ');">&#x25b2;</a>';
		});
		expdr.addEventListener('error', function() {alert('Please connect to the internet and reload the page')});
		expdrv.addEventListener('error', function() {alert('Please connect to the internet and reload the page')});
		expdrc.addEventListener('error', function() {alert('Please connect to the internet and reload the page')});
		expdr.open('get', jason, true);
		expdr.send();
	} else {
		sayToReload();
	}
};

function markPost(pn, whichOne) {
	localStorage.setItem('astiw_viewed' + pn, whichOne.toString());
	if (localStorage.getItem('astiw_viewed' + pn) == 'true') {
		document.getElementById('postItem' + pn).getElementsByTagName('b')[0].style.opacity = '0.5';
		document.getElementById('prms' + pn).innerHTML = '<a class="classic" id="prms' + pn + '" href="javascript:markPost(' + pn + ', false);">Mark unread</a>';
	} else {
		document.getElementById('postItem' + pn).getElementsByTagName('b')[0].style.opacity = '1';
		document.getElementById('prms' + pn).innerHTML = '<a class="classic" id="prms' + pn + '" href="javascript:markPost(' + pn + ', true);">Mark read</a>';
	}
};

function collapse(numb) {
	var eliq = document.getElementById('postItem' + numb).getElementsByTagName('div')[0];
	var eliqSpan = eliq.getElementsByTagName('span')[0];
	var appended = document.getElementById('expanded' + numb);
	eliq.removeChild(appended);
	eliqSpan.innerHTML = '<a class="classic" href="javascript:expand(' + numb + ');">&#x25bc;</a>';
};

function sayToReload() {
	alert('The selected account has changed, please reload the page');
};