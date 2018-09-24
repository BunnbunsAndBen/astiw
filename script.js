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
	if (localStorage.getItem('astiw_mac') == 'true') {
		document.getElementById('messengerButton').innerHTML = 'M';
	}
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

function addRecentBasic(item, b) {
	var i = item.indexOf(':');
	var splits = [item.slice(0, i), item.slice(i + 1)];
	var id = splits[0];
	var title = splits[1];
	var main = document.getElementById('main');
	var el = document.createElement('a');
	el.id = 'postItem' + id;
	el.href = 'post.html?id=' + id;
	el.className = 'recentLinks';
	el.innerHTML = '<div class="recent' + (b ? ' bb' : '') + '"><b class="theB"' + (localStorage.getItem('astiw_markread') != 'true' && localStorage.getItem('astiw_viewed' + id) == 'true' ? ' style="opacity:0.5;"' : '') + '>' + trimTitle(title.replace(/</g, '&lt;').replace(/>/g, '&gt;')) +'</b></div>';
	main.appendChild(el);
}

function addRecent(id, item, b) {
	var main = document.getElementById('main');
	var el = document.createElement('a');
	var menulist = [];
	var expandLink = '';
	var home = typeof youreOnTheHomepage !== 'undefined' && youreOnTheHomepage == true;
	if (home) {
		var view = (isSet(raw) ? raw : 'm');
	} else {
		var view = 'm';
	}
	el.id = 'postItem' + id;
	el.href = 'post.html?id=' + id;
	el.className = 'recentLinks';
	var upStyle = '';
	var downStyle = '';
	if (isSet(item.vote) && myName != 'Anon') {
		if (item.vote == 'up') {
			upStyle = 'color:var(--verified)';
		} else {
			downStyle = 'color:var(--red)';
		}
	}
	if (view == 'l') {
		expandLink = '<span style="display:none;" id="expanderContain' + id + '"><a id="expander' + id + '" class="classic" href="javascript:expand(' + id + ', true)">&#x25bc; Expand</a> | </span>';
	} else if (view == 'm') {
		expandLink = '<a id="expander' + id + '" class="classic" href="javascript:expand(' + id + ', true)">&#x25bc; Expand</a> | ';
	}
	var mac = localStorage.getItem('astiw_mac') == 'true';
	menulist.push('<span id="upvote' + id + '"><a class="classic" style="' + upStyle + '" href="javascript:vote(' + id + ', true)">' + (mac ? '&uarr;' : '&#x21e7;&#xfe0e;') + ' ' + item.upvotes.toString() + '</a></span>');
	menulist.push('<span id="downvote' + id + '"><a class="classic" style="' + downStyle + '" href="javascript:vote(' + id + ', false)">' + (mac ? '&darr;' : '&#x21e9;&#xfe0e;') + ' ' + item.downvotes.toString() + '</a></span>');
	if (view == 's') {
		menulist.push('<a class="classic" href="post.html?id=' + id + '&comment">' + (mac ? 'Comment' : '&#x1f4ac;&#xfe0e;') + '</a>');
	} else {
		menulist.push('<a class="classic" href="post.html?id=' + id + '&comment">' + (mac ? '' : '&#x1f4ac;&#xfe0e; ') + 'Comment</a>');
	}
	if (myName != 'Anon' && item.poster == myName && myRank != 'User')	 {
		menulist.push('<a class="classic" href="javascript:openEdit(' + id + ');">&#x270E;&#xFE0E;' + (view != 's' ? ' Edit' : '') + '</a>');
	}
	if (localStorage.getItem('astiw_markread') != 'true') {
		menulist.push(localStorage.getItem('astiw_viewed' + id) == 'true' ? '<a class="classic" id="prms' + id + '" href="javascript:markPost(' + id + ', false, ' + (view != 's').toString() + ');">' + markText(true, view != 's') + '</a>' : '<a class="classic" id="prms' + id + '" href="javascript:markPost(' + id + ', true, ' + (view != 's').toString() + ');">' + markText(false, view != 's') + '</a>');
	}
	if (isSet(item.attachment) && item.attachment != 'none') {
		menulist.push(view == 's' ? 'Image' : 'Image attached');
	}
	if (view == 'l') {
		el.innerHTML = '<div class="recentCard' + (b ? ' bb' : '') + '"><p class="small" style="margin-top:0;">Posted by <a class="classic" ' + (item.poster == myName ? 'style="color:var(--you);" ' : '') + 'href="user.html?id=' + encodeURIComponent(item.poster) + '">' + item.poster + '</a> at ' + item.postdate + (item.edited ? ' (edited)' : '') + '</p><b class="theB"' + (localStorage.getItem('astiw_markread') != 'true' && localStorage.getItem('astiw_viewed' + id) == 'true' ? ' style="opacity:0.5;"' : '') + '>' + trimTitle(item.title.replace(/</g, '&lt;').replace(/>/g, '&gt;')) +'</b><p id="cardText' + id + '" class="fadeOutText">' + putLinksInText(item.content.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\r\n/g, '<br/>'))+ '</p><b><p class="small" style="margin-bottom:0;">' + expandLink + menulist.join(' &#xb7; ') + '</p></b></div>';
	} else if (view == 's') {
		el.innerHTML = '<div class="recent' + (b ? ' bb' : '') + '"><b><p class="small" style="margin:0 0 0 8px; float:right;">' + expandLink + menulist.join(' &#xb7; ') + '</p></b><p class="small" style="margin-top:0; color:var(--content);"><a id="expander' + id + '" class="classic" href="javascript:expand(' + id + ', false)">&#x25bc;</a> <b class="theB"' + (localStorage.getItem('astiw_markread') != 'true' && localStorage.getItem('astiw_viewed' + id) == 'true' ? ' style="opacity:0.5;"' : '') + '>' + trimTitle(item.title.replace(/</g, '&lt;').replace(/>/g, '&gt;')) +'</b></p><p class="small" style="margin-bottom:0;">Posted by <a class="classic" ' + (item.poster == myName ? 'style="color:var(--you);" ' : '') + 'href="user.html?id=' + encodeURIComponent(item.poster) + '">' + item.poster + '</a> at ' + item.postdate + (item.edited ? ' (edited)' : '') + '</p><p id="expanded' + id + '" style="margin-bottom:0; display:none;">' + putLinksInText(item.content.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\r\n/g, '<br/>'))+ '</p></div>';
	} else {
		el.innerHTML = '<div class="recent' + (b ? ' bb' : '') + '"><b class="theB"' + (localStorage.getItem('astiw_markread') != 'true' && localStorage.getItem('astiw_viewed' + id) == 'true' ? ' style="opacity:0.5;"' : '') + '>' + trimTitle(item.title.replace(/</g, '&lt;').replace(/>/g, '&gt;')) +'</b><p class="small">Posted by <a class="classic" ' + (item.poster == myName ? 'style="color:var(--you);" ' : '') + 'href="user.html?id=' + encodeURIComponent(item.poster) + '">' + item.poster + '</a> at ' + item.postdate + (item.edited ? ' (edited)' : '') + '</p><b><p class="small" style="margin-bottom:0;">' + expandLink + menulist.join(' &#xb7; ') + '</p></b><p id="expanded' + id + '" style="margin-bottom:0; display:none;">' + putLinksInText(item.content.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\r\n/g, '<br/>'))+ '</p></div>';
	}
	main.appendChild(el);
	if (view == 'l') {
		var cardText = document.getElementById('cardText' + id);
		if (cardText.scrollHeight > cardText.offsetHeight) {
			document.getElementById('expanderContain' + id).style.display = '';
		}
	}
	if (home) {
		lastid = id;
	}
};

function openEdit(id) {
	if (!sessHasChanged()) {
		window.location.href = 'post.html?id=' + id + '&edit';
	} else {
		sayToReload();
	}
};

function trimTitle(trimMe) {
	if (trimMe.length > 300) {
		return trimMe.substring(0, 300) + '&#x2026;';
	} else {
		return trimMe;
	}
};

function expand(numb, showtext) {
	if (raw == 'l') {
		if (document.getElementById('cardText' + numb).className == 'fadeOutText') {
			document.getElementById('cardText' + numb).className = '';
			document.getElementById('expander' + numb).innerHTML = '&#x25b2;' + (showtext ? ' Collapse' : '');
		} else {
			document.getElementById('cardText' + numb).className = 'fadeOutText';
			document.getElementById('expander' + numb).innerHTML = '&#x25bc;' + (showtext ? ' Expand' : '');
		}
	} else {
		if (document.getElementById('expanded' + numb).style.display == 'none') {
			document.getElementById('expanded' + numb).style.display = '';
			document.getElementById('expander' + numb).innerHTML = '&#x25b2;' + (showtext ? ' Collapse' : '');
		} else {
			document.getElementById('expanded' + numb).style.display = 'none';
			document.getElementById('expander' + numb).innerHTML = '&#x25bc;' + (showtext ? ' Expand' : '');
		}
	}
};

function markPost(pn, whichOne, fulltext) {
	localStorage.setItem('astiw_viewed' + pn, whichOne.toString());
	if (localStorage.getItem('astiw_viewed' + pn) == 'true') {
		document.getElementById('postItem' + pn).getElementsByClassName('theB')[0].style.opacity = '0.5';
		document.getElementById('prms' + pn).innerHTML = '<a class="classic" id="prms' + pn + '" href="javascript:markPost(' + pn + ', false, ' + fulltext.toString() + ');">' + markText(true, fulltext) + '</a>';
	} else {
		document.getElementById('postItem' + pn).getElementsByClassName('theB')[0].style.opacity = '1';
		document.getElementById('prms' + pn).innerHTML = '<a class="classic" id="prms' + pn + '" href="javascript:markPost(' + pn + ', true, ' + fulltext.toString() + ');">' + markText(false, fulltext) + '</a>';
	}
};

function markText(dir, full) {
	if (full) {
		return (dir ? 'Mark unread' : 'Mark read');
	} else {
		return (dir ? 'Unread' : 'Read');
	}
};

function switchView(value) {
	localStorage.setItem('astiw_view', value);
	window.location.reload();
};

function setupViewBar() {
	if (isSet(raw)) {
		var view = raw;
	} else {
		var view = 'm';
	}
	document.getElementById('view-s').innerHTML = (view == 's' ? 'Small' : '<a class="classic" href="javascript:switchView(\'s\');">Small</a>');
	document.getElementById('view-m').innerHTML = (view == 'm' ? 'Medium' : '<a class="classic" href="javascript:switchView(\'m\');">Medium</a>');
	document.getElementById('view-l').innerHTML = (view == 'l' ? 'Large' : '<a class="classic" href="javascript:switchView(\'l\');">Large</a>');
	document.getElementById('viewBar').style.display = 'block';
};

function sayToReload() {
	alert('The selected account has changed, please reload the page');
};

function scrollToTop() {
	window.scrollTo(0, 0);
};

function vote(postid, dir) {
	var currentUsername = getCurrentUser();
	if (isSet(currentUsername) && currentUsername != 'Anon') {
		if (!sessHasChanged()) {
			var upvote = document.getElementById('upvote' + postid);
			var downvote = document.getElementById('downvote' + postid);
			var upvoteLink = upvote.getElementsByTagName('a')[0];
			var downvoteLink = downvote.getElementsByTagName('a')[0];
			upvoteLink.href = 'javascript:void(0)';
			downvoteLink.href = 'javascript:void(0)';
			upvoteLink.className = 'loadingVotes';
			downvoteLink.className = 'loadingVotes';
			upvoteLink.style = '';
			downvoteLink.style = '';
			var qsp = 'id=' + postid + '&sess=' + JSON.parse(localStorage.getItem('astiw_sesses'))[0];
			var jsonurlvote = 'https://api.stibarc.gq/' + (dir ? 'up' : 'down') + 'vote.sjs';
			var jsonurlp = 'https://api.stibarc.gq/v2/getpost.sjs?' + qsp;
			var rvote = new XMLHttpRequest();
			var rp = new XMLHttpRequest();
			rvote.addEventListener('load', function() {
				rp.open('get', jsonurlp, true);
				rp.send();
			});
			rp.addEventListener('load', function() {
				var res = JSON.parse(rp.responseText);
				var upStyle = '';
				var downStyle = '';
				if (isSet(res.vote)) {
					if (res.vote == 'up') {
						upStyle = 'color:var(--verified)';
					} else {
						downStyle = 'color:var(--red)';
					}
				}
				upvoteLink.className = 'classic';
				downvoteLink.className = 'classic';
				upvoteLink.style = upStyle;
				downvoteLink.style = downStyle;
				var mac = localStorage.getItem('astiw_mac') == 'true';
				upvoteLink.innerHTML = (mac ? '&uarr;' : '&#x21e7;&#xfe0e;') + ' ' + res.upvotes.toString();
				downvoteLink.innerHTML = (mac ? '&darr;' : '&#x21e9;&#xfe0e;') + ' ' + res.downvotes.toString();
				upvoteLink.href = 'javascript:vote(' + postid + ', true)';
				downvoteLink.href = 'javascript:vote(' + postid + ', false)';
			});
			rvote.addEventListener('error', function() {alert('Could not connect to STiBaRC, please reload the page and try again')});
			rp.addEventListener('error', function() {alert('Could not connect to STiBaRC, please reload the page and try again')});
			rvote.open('post', jsonurlvote, true);
			rvote.send(qsp);
		} else {
			sayToReload();
		}
	} else {
		if (confirm('You must be logged in to do that; login?')) {
			window.location.href = 'login.html';
		}
	}
};
