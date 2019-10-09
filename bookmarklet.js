var cpURL = window.location.href;
var rptn = 'bad';
if (cpURL == 'https://stibarc.com/' || cpURL == 'https://stibarc.com/index.html') {
	rptn = 'https://savaka2.github.io/astiw/';
} else if (cpURL.indexOf('https://stibarc.com/post.html') == 0) {
	rptn = 'https://savaka2.github.io/astiw/post.html' + cpURL.substring(28);
} else if (cpURL == 'https://stibarc.com/newpost.html') {
	rptn = 'https://savaka2.github.io/astiw/newpost.html';
} else if (cpURL.indexOf('https://stibarc.com/editprofile.html') == 0) {
	rptn = 'https://savaka2.github.io/astiw/editprofile.html';
} else if (cpURL == 'https://stibarc.com/search.html') {
	rptn = 'https://savaka2.github.io/astiw/search.html?q=' + encodeURIComponent(document.getElementById('q').value);
} else if (cpURL.indexOf('https://stibarc.com/user.html') == 0) {
	rptn = 'https://savaka2.github.io/astiw/user.html' + cpURL.substring(28);
} else if (cpURL == 'https://stibarc.com/login.html') {
	rptn = 'https://savaka2.github.io/astiw/login.html';
} else if (cpURL.indexOf('https://stibarc.com/passwd.html') == 0) {
	rptn = 'https://savaka2.github.io/astiw/changepassword.html';
} else if (cpURL == 'https://messenger.stibarc.com/' || cpURL == 'https://messenger.stibarc.com/index.html') {
	rptn = 'https://savaka2.github.io/astiw/messenger.html';
} else if (cpURL == 'https://savaka2.github.io/astiw/' || cpURL == 'https://savaka2.github.io/astiw/index.html') {
	rptn = 'https://stibarc.com/';
} else if (cpURL.indexOf('https://savaka2.github.io/astiw/post.html') == 0) {
	rptn = 'https://stibarc.com/post.html' + cpURL.substring(41);
} else if (cpURL == 'https://savaka2.github.io/astiw/newpost.html') {
	rptn = 'https://stibarc.com/newpost.html';
} else if (cpURL == 'https://savaka2.github.io/astiw/editprofile.html') {
	rptn = 'https://stibarc.com/editprofile.html';
} else if (cpURL.indexOf('https://savaka2.github.io/astiw/search.html') == 0) {
	rptn = 'https://stibarc.com/search.html';
} else if (cpURL.indexOf('https://savaka2.github.io/astiw/user.html') == 0) {
	rptn = 'https://stibarc.com/user.html' + cpURL.substring(41);
} else if (cpURL == 'https://savaka2.github.io/astiw/login.html') {
	if (confirm('Target page may not be relevant, continue anyway?')) {
		rptn = 'https://stibarc.com/login.html';
	}
} else if (cpURL == 'https://savaka2.github.io/astiw/changepassword.html') {
	if (confirm('Target page may not be relevant, continue anyway?')) {
		rptn = 'https://stibarc.com/passwd.html';
	}
} else if (cpURL == 'https://savaka2.github.io/astiw/messenger.html') {
	rptn = 'https://messenger.stibarc.com/';
}
if (rptn != 'bad') {
	window.location.href = rptn;
}