var cpURL = window.location.href;
var rptn = 'bad';
if (cpURL == 'https://stibarc.gq/' || cpURL == 'https://stibarc.gq/index.html') {
	rptn = 'https://savaka2.github.io/astiw/';
} else if (cpURL.indexOf('https://stibarc.gq/post.html') == 0) {
	rptn = 'https://savaka2.github.io/astiw/post.html' + cpURL.substring(28);
} else if (cpURL == 'https://stibarc.gq/newpost.html') {
	rptn = 'https://savaka2.github.io/astiw/newpost.html';
} else if (cpURL.indexOf('https://stibarc.gq/editprofile.sjs') == 0) {
	rptn = 'https://savaka2.github.io/astiw/editprofile.html';
} else if (cpURL == 'https://stibarc.gq/search.html') {
	rptn = 'https://savaka2.github.io/astiw/search.html?q=' + encodeURIComponent(document.getElementById('q').value);
} else if (cpURL.indexOf('https://stibarc.gq/user.html') == 0) {
	rptn = 'https://savaka2.github.io/astiw/user.html' + cpURL.substring(28);
} else if (cpURL == 'https://stibarc.gq/login.html') {
	rptn = 'https://savaka2.github.io/astiw/login.html';
} else if (cpURL == 'https://stibarc.gq/register.html') {
	rptn = 'https://savaka2.github.io/astiw/register.html';
} else if (cpURL.indexOf('https://stibarc.gq/passwd.sjs') == 0) {
	rptn = 'https://savaka2.github.io/astiw/changepassword.html';
} else if (cpURL == 'https://messenger.stibarc.gq/' || cpURL == 'https://messenger.stibarc.gq/index.html') {
	rptn = 'https://savaka2.github.io/astiw/messenger.html';
} else if (cpURL == 'https://savaka2.github.io/astiw/' || cpURL == 'https://savaka2.github.io/astiw/index.html') {
	rptn = 'https://stibarc.gq/';
} else if (cpURL.indexOf('https://savaka2.github.io/astiw/post.html') == 0) {
	rptn = 'https://stibarc.gq/post.html' + cpURL.substring(41);
} else if (cpURL == 'https://savaka2.github.io/astiw/newpost.html') {
	rptn = 'https://stibarc.gq/newpost.html';
} else if (cpURL == 'https://savaka2.github.io/astiw/editprofile.html') {
	if (confirm('Cannot switch in this direction, go to STiBaRC home page?')) {
		rptn = 'https://stibarc.gq/';
	}
} else if (cpURL.indexOf('https://savaka2.github.io/astiw/search.html') == 0) {
	rptn = 'https://stibarc.gq/search.html';
} else if (cpURL.indexOf('https://savaka2.github.io/astiw/user.html') == 0) {
	rptn = 'https://stibarc.gq/user.html' + cpURL.substring(41);
} else if (cpURL == 'https://savaka2.github.io/astiw/login.html') {
	if (confirm('Target page may not be relevant, continue anyway?')) {
		rptn = 'https://stibarc.gq/login.html';
	}
} else if (cpURL == 'https://savaka2.github.io/astiw/register.html') {
	if (confirm('Target page may not be relevant, continue anyway?')) {
		rptn = 'https://stibarc.gq/register.html';
	}
} else if (cpURL == 'https://savaka2.github.io/astiw/changepassword.html') {
	if (confirm('Cannot switch in this direction, go to STiBaRC home page?')) {
		rptn = 'https://stibarc.gq/';
	}
}
if (rptn != 'bad') {
	window.location.href = rptn;
}