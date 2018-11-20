var modal;
var mobileModal;
var mobileSearchModal;
var sessesAtLoad;
var userBanned = false;
var onMobile;

window.onload = function() {
	colors();
	if (localStorage.getItem('astiw_checkeddevice') != 'true') {
		localStorage.setItem('astiw_onmobile', (screen.width <= 800 ? 'true' : 'false'));
		localStorage.setItem('astiw_checkeddevice', 'true');
	}
	onMobile = localStorage.getItem('astiw_onmobile') == 'true';
	if (onMobile) {
		var mobileStyler = document.createElement('link');
		mobileStyler.rel = 'stylesheet';
		mobileStyler.href = 'mobile.css';
		document.head.appendChild(mobileStyler);
	}
	document.getElementById('cssshade').style.display = 'none';
	var sb = document.getElementById('search');
	var msb = document.getElementById('mobileSearchBox');
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
	msb.addEventListener('keydown', function(e) {
		if (e.keyCode == 13) {
			if (isSet(msb.value)) {
				window.location.href = 'search.html?q=' + encodeURIComponent(msb.value);
			}
		}
	});
	if (typeof importantLoad == 'function') {
		importantLoad();
	}
	modal = document.getElementById('usermenubox');
	mobileModal = document.getElementById('mobileMenu');
	mobileSearchModal = document.getElementById('mobileSearch');
	window.addEventListener('click', function(e) {
		if (event.target == modal) {
			modal.style.display = 'none';
		}
		if (event.target == mobileModal) {
			mobileModal.style.display = 'none';
		}
		if (event.target == mobileSearchModal) {
			mobileSearchModal.style.display = 'none';
		}
	});
	if (localStorage.getItem('astiw_mac') == 'true') {
		document.getElementById('messengerButton').innerHTML = 'M';
	}
	if (localStorage.getItem('astiw_changetitlelink') == 'true') {
		document.getElementById('homeButton').style.display = '';
		document.getElementById('buttonsDivider').style.display = 'block';
		var newDest = localStorage.getItem('astiw_titlelink');
		if (isSet(newDest)) {
			document.getElementById('title').href = newDest;
		}
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
				mobileButtons(true);
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

function mobileButtons(buttonLogin) {
	if (onMobile) {
		document.getElementById('settingsButton').style.display = 'none';
		document.getElementById('messengerButton').style.display = 'none';
		document.getElementById('search').style.display = 'none';
		document.getElementById('mobileDivider').style.display = 'initial';
		document.getElementById('loginTitleButton').style.display = 'none';
		document.getElementById('usermenu').style.display = 'none';
		document.getElementById('mobileMenuButton').style.display = 'initial';
		document.getElementById('mobileSearchButton').style.display = 'initial';
		if (buttonLogin) {
			document.getElementById('mobileLogin').style.display = 'none';
			document.getElementById('mobileUserLink').innerHTML = document.getElementById('usermenu').innerHTML;
			if (document.getElementById('usermenu').innerHTML == 'Anon') {
				document.getElementById('mobileMessenger').style.display = 'none';
			}
		} else {
			document.getElementById('mobileIb').style.display = 'none';
			document.getElementById('mobileMessenger').style.display = 'none';
		}
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

function putLinksInText(inp, noot) {
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
			list[j] = '<a class="classic" ' + (noot || localStorage.getItem('astiw_newtab') != 'true' ? 'target="_blank" ' : '') + 'href="' + encodeURI(temp) + '">' + temp + '</a>';
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
	mobileButtons(false);
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
			if (xmlHttp.responseText == 'banned\n') {
				userBanned = true;
			}
			load();
		}
	});
	xmlHttp.addEventListener('error', function() {alert('Could not connect to STiBaRC, please reload the page and try again')});
	xmlHttp.open('get', 'https://api.stibarc.gq/v2/checksess.sjs?sess=' + sess, true);
	xmlHttp.send();
};

function openUserMenu() {
	if (!sessHasChanged()) {
		var me = document.getElementById('currentUserName');
		var showsess = localStorage.getItem('astiw_showsess') == 'true';
		var sesses = JSON.parse(localStorage.getItem('astiw_sesses'));
		var usernames = JSON.parse(localStorage.getItem('astiw_usernames'));
		document.getElementById('userMenuProfButton').href = 'user.html?id=' + encodeURIComponent(usernames[0]);
		me.innerHTML = usernames[0] + (showsess ? ' (' + sesses[0] + ')' : '');
		modal.style.display = 'initial';
	} else {
		sayToReload();
	}
};

function openMobileMenu() {
	mobileModal.style.display = 'initial';
};

function openMobileSearch() {
	if (window.location.href.indexOf('search.html') != -1) {
		document.getElementById('mobileSearchBox').value = term;
	} else {
		document.getElementById('mobileSearchBox').value = '';
	}
	mobileSearchModal.style.display = 'initial';
	document.getElementById('mobileSearchBox').focus();
};

function closeUserMenu() {
	modal.style.display = 'none';
};

function closeMobileMenu() {
	mobileModal.style.display = 'none';
};

function closeMobileSearch() {
	mobileSearchModal.style.display = 'none';
	document.getElementById('mobileSearchBox').value = '';
};

function logoutCurrentUser() {
	if (!sessHasChanged()) {
		window.location.href = 'logout.html';
	} else {
		sayToReload();
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

function addRecent(id, item) {
	var main = document.getElementById('main');
	var el = document.createElement('a');
	var menulist = [];
	var expandLink = '';
	var home = typeof youreOnTheHomepage !== 'undefined' && youreOnTheHomepage == true;
	if (home && !onMobile) {
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
	if (item.deleted == true) {
		el.style.display = 'none';
	} else if (localStorage.getItem('astiw_hidedownvoted') == 'true' && home && item.vote == 'down' && item.poster != myName) {
		el.style.display = 'none';
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
		menulist.push('<a class="classic" href="post.html?id=' + id + '&comment">' + (mac || onMobile ? 'Comment' : '&#x1f4ac;&#xfe0e;') + '</a>');
	} else {
		menulist.push('<a class="classic" href="post.html?id=' + id + '&comment">' + (mac || onMobile ? '' : '&#x1f4ac;&#xfe0e; ') + 'Comment</a>');
	}
	if (myName != 'Anon' && item.poster == myName && myRank != 'User')	 {
		menulist.push('<a class="classic" href="javascript:openEdit(' + id + ');">&#x270E;&#xFE0E;' + (view != 's' ? ' Edit' : '') + '</a>');
	}
	if (localStorage.getItem('astiw_markread') != 'true') {
		menulist.push(localStorage.getItem('astiw_viewed' + id) == 'true' ? '<a class="classic" id="prms' + id + '" href="javascript:markPost(' + id + ', false, ' + (view != 's').toString() + ');">' + markText(true, view != 's') + '</a>' : '<a class="classic" id="prms' + id + '" href="javascript:markPost(' + id + ', true, ' + (view != 's').toString() + ');">' + markText(false, view != 's') + '</a>');
	}
	if (isSet(item.attachment) && item.attachment != 'none') {
		menulist.push('Attachment');
	}
	var totalVotes = item.upvotes + item.downvotes;
	if (localStorage.getItem('astiw_percentinlist') != 'true') {
		var percentUpvotedItem = '<span id="percentUpvoted' + id + '">' + (totalVotes > 0 ? ' &#xb7; ' + Math.round((item.upvotes / totalVotes) * 100).toString() + '%' + (view != 's' ? ' upvoted' : '') : '') + '</span>';
	} else {
		var percentUpvotedItem = '';
	}
	var menulistFinal = menulist.join(' &#xb7; ') + percentUpvotedItem;
	var officialMark = '';
	if (item.poster == 'savaka' && item.title.substring(0, 7) == '[ASTiW]') {
		officialMark = ' <span style="color:var(--verified); line-height:1em;">&#x24b6;</span>';
		item.title = item.title.substring(7);
	}
	if (onMobile) {
		el.innerHTML = '<div class="recent"><p style="margin-top:0;" class="small">' + item.postdate + (item.edited ? ' (edited)' : '') + ' <b>&#xb7;</b> <a class="classic" ' + (item.poster == myName ? 'style="color:var(--you);" ' : '') + 'href="user.html?id=' + encodeURIComponent(item.poster) + '">' + item.poster + '</a>' + officialMark + '</p><b class="theB"' + (localStorage.getItem('astiw_markread') != 'true' && localStorage.getItem('astiw_viewed' + id) == 'true' ? ' style="opacity:0.5;"' : '') + '>' + trimTitle(item.title.replace(/</g, '&lt;').replace(/>/g, '&gt;')) +'</b><b><p class="small" style="margin-bottom:0;">' + menulistFinal + '</p></b></div>';
	} else {
		if (view == 'l') {
			el.innerHTML = '<div class="recentCard' + (bbbbbb ? ' bb' : '') + '"><p class="small" style="margin-top:0;">Posted by <a class="classic" ' + (item.poster == myName ? 'style="color:var(--you);" ' : '') + 'href="user.html?id=' + encodeURIComponent(item.poster) + '">' + item.poster + '</a>' + officialMark + ' at ' + item.postdate + (item.edited ? ' (edited)' : '') + '</p><b class="theB"' + (localStorage.getItem('astiw_markread') != 'true' && localStorage.getItem('astiw_viewed' + id) == 'true' ? ' style="opacity:0.5;"' : '') + '>' + trimTitle(item.title.replace(/</g, '&lt;').replace(/>/g, '&gt;')) +'</b><p id="cardText' + id + '" class="fadeOutText">' + putLinksInText(item.content.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\r\n/g, '<br/>'), false) + '</p><b><p class="small" style="margin-bottom:0;">' + expandLink + menulistFinal + '</p></b></div>';
		} else if (view == 's') {
			el.innerHTML = '<div class="recent' + (bbbbbb ? ' bb' : '') + '"><b><p class="small" style="margin:0 0 0 8px; float:right;">' + expandLink + menulistFinal + '</p></b><p class="small" style="margin-top:0; color:var(--content);"><a id="expander' + id + '" class="classic" href="javascript:expand(' + id + ', false)">&#x25bc;</a> <b class="theB"' + (localStorage.getItem('astiw_markread') != 'true' && localStorage.getItem('astiw_viewed' + id) == 'true' ? ' style="opacity:0.5;"' : '') + '>' + trimTitle(item.title.replace(/</g, '&lt;').replace(/>/g, '&gt;')) +'</b></p><p class="small" style="margin-bottom:0;">Posted by <a class="classic" ' + (item.poster == myName ? 'style="color:var(--you);" ' : '') + 'href="user.html?id=' + encodeURIComponent(item.poster) + '">' + item.poster + '</a>' + officialMark + ' at ' + item.postdate + (item.edited ? ' (edited)' : '') + '</p><p id="expanded' + id + '" style="margin-bottom:0; display:none;">' + putLinksInText(item.content.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\r\n/g, '<br/>'), false) + '</p></div>';
		} else {
			el.innerHTML = '<div class="recent' + (bbbbbb ? ' bb' : '') + '"><b class="theB"' + (localStorage.getItem('astiw_markread') != 'true' && localStorage.getItem('astiw_viewed' + id) == 'true' ? ' style="opacity:0.5;"' : '') + '>' + trimTitle(item.title.replace(/</g, '&lt;').replace(/>/g, '&gt;')) +'</b><p class="small">Posted by <a class="classic" ' + (item.poster == myName ? 'style="color:var(--you);" ' : '') + 'href="user.html?id=' + encodeURIComponent(item.poster) + '">' + item.poster + '</a>' + officialMark + ' at ' + item.postdate + (item.edited ? ' (edited)' : '') + '</p><b><p class="small" style="margin-bottom:0;">' + expandLink + menulistFinal + '</p></b><p id="expanded' + id + '" style="margin-bottom:0; display:none;">' + putLinksInText(item.content.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\r\n/g, '<br/>'), false) + '</p></div>';
		}
	}
	if (bbbbbb & el.style.display != 'none') {
		bbbbbb = false;
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
				var totalVotes = res.upvotes + res.downvotes;
				if (isSet(document.getElementById('percentUpvoted' + postid))) {
					document.getElementById('percentUpvoted' + postid).innerHTML = (totalVotes > 0 ? ' &#xb7; ' + Math.round((res.upvotes / totalVotes) * 100).toString() + '%' + (raw != 's' ? ' upvoted' : '') : '');
				}
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
		if (confirm('You must be logged in to do that; log in?')) {
			window.location.href = 'login.html';
		}
	}
};

function generateAttachmentElement(data, inEditor) {
	var type = data.split(':', 2)[1].split('/', 2)[0];
	var format = data.split('/', 2)[1].split(';', 2)[0];
	if (type == 'image') {
		var el = document.createElement('img');
		el.src = data;
	} else if (type == 'video' || (type == 'application' && format == 'mp4')) {
		var el = document.createElement('video');
		el.controls = true;
		if (!inEditor && localStorage.getItem('astiw_autoplayvideo') != 'off') {
			el.autoplay = true;
		}
		if (localStorage.getItem('astiw_autoplayvideo') != 'on' && localStorage.getItem('astiw_autoplayvideo') != 'off') {
			el.muted = true;
		}
		el.src = data;
	} else if (type == 'audio' || (type == 'application' && (format == 'mp3' || format == 'wav'))) {
		var el = document.createElement('audio');
		el.controls = true;
		if (localStorage.getItem('astiw_autoplayaudio') == 'true') {
			el.autoplay = true;
		}
		el.src = data;
	} else {
		var el = document.createElement('div');
		el.style.textAlign = 'center';
		el.style.width = 'fit-content';
		if (inEditor) {
			el.innerHTML = '<hr><p style="color:var(--red); margin-top:0;">This file type is not supported</p><p class="small" style="margin-bottom:0;">Only images, videos, and audio are supported.<br/>You can upload this file, but no preview will be shown, and it will not necessarily display correctly on clients other than ASTiW.</p><hr>';
		} else {
			el.innerHTML = '<hr><p style="color:var(--red); margin-top:0;">No preview available</p><a class="classic" target="_blank" href="' + data + '">View file</a><p class="small" style="margin-bottom:0;">If you cannot view the file by clicking the link, try right clicking the link and choosing "Open in new tab" (or equivalent)</p><hr>';
		}
	}
	el.style.display = 'block';
	if (!inEditor) {
		el.style.margin = 'auto';
	}
	el.style.maxWidth = '100%';
	return el;
}