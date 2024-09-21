// ==UserScript==
// @name         Kemono.Party Blacklist
// @namespace    https://MeusArtis.ca
// @version      1.2.4
// @author       Meus Artis
// @description  Blacklists posts by Creator ID
// @icon         https://www.google.com/s2/favicons?domain=kemono.su
// @supportURL   https://t.me/kemonoparty
// @include      /^https:\/\/kemono\.(party|su)\/.*$/
// @include      /^https:\/\/nekohouse\.(party|su)\/.*$/
// @include      /^https:\/\/coomer\.(party|su)\/.*$/
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @license      CC BY-NC-SA 4.0
// @run-at       document-end
// @downloadURL https://update.sleazyfork.org/scripts/443899/KemonoParty%20Blacklist.user.js
// @updateURL https://update.sleazyfork.org/scripts/443899/KemonoParty%20Blacklist.meta.js
// ==/UserScript==
const BlacklistStorage = window.localStorage;
const BlacklistButton = document.createElement("BUTTON");
const BlacklistButtonArtist = document.createElement("BUTTON");
const Blacklisted = JSON.parse(localStorage.getItem("blacklist"));
const ButtonArea = document.querySelector('.post__actions');
const ButtonAreaArtist = document.querySelector('.user-header__actions');
const HeadMeta = document.querySelector("meta[name='user']");
const HeadMetaArtist = document.querySelector("meta[name='artist_name']");
const styleSheet = document.createElement("style");
const styles = `.creator__blacklist{color:#ddd;font-weight:700;text-shadow:#000 0 0 3px,#000 -1px -1px 0px,#000 1px 1px 0;background-color:transparent;border:transparent}.user-header__blacklist{box-sizing:border-box;font-weight:700;color:#fff;text-shadow:#000 0 0 3px,#000 -1px -1px 0px,#000 1px 1px 0;background-color:transparent;border:transparent;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}`;
if ("blacklist" in BlacklistStorage) {
	console.log("Blacklist Exists");
} else {
	alert("Blacklist does not exist, creating a new one");
	BlacklistStorage.setItem("blacklist", "[]");
}
var HeadMetaID = document.querySelector("meta[name='id']");
if (HeadMeta) {
	console.log("Blacklist Enabled (Post Page)");
	var HeadMetaID = HeadMeta.getAttribute("content");
	ButtonArea.appendChild(BlacklistButton);
} else if (HeadMetaArtist) {
	console.log("Blacklist Enabled (Artist Page)");
	var HeadMetaID = HeadMetaID.getAttribute("content");
	ButtonAreaArtist.appendChild(BlacklistButton);
} else {
	console.log("Blacklist Enabled (Recent Posts/Search Page)");
}
const UnBlacklist = Blacklisted.indexOf(HeadMetaID);
document.head.appendChild(styleSheet);
styleSheet.innerText = styles;
styleSheet.type = "text/css";
BlacklistButton.classList.add("creator__blacklist");
BlacklistButton.type = "button";
if (Blacklisted.indexOf(HeadMetaID) !== -1) {
	BlacklistButton.innerHTML = '<span class="creator__blacklist-icon">⛒</span><span>Blacklisted</span>';
	BlacklistButton.onclick = function () {
		Blacklisted.splice(UnBlacklist, 1);
		BlacklistStorage.setItem("blacklist", JSON.stringify(Blacklisted));
		alert("Creator Unblacklisted");
		location.reload();
	};
} else {
	BlacklistButton.innerHTML = '<span class="creator__blacklist-icon">⛔</span><span>Blacklist</span>';
	BlacklistButton.onclick = function () {
		Blacklisted.push(HeadMetaID);
		BlacklistStorage.setItem("blacklist", JSON.stringify(Blacklisted));
		alert("Creator Blacklisted");
		location.reload();
	};
}
Blacklisted.forEach(function (item) {
    $("article[data-user='" + item + "']").remove();
});

function waitForElementToDisplay(selector, callback, checkFrequencyInMs, timeoutInMs) {
  var startTimeInMs = Date.now();
  (function loopSearch() {
    if (document.querySelector(selector) != null) {
      callback();
      return;
    }
    else {
      setTimeout(function () {
        if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs)
          return;
        loopSearch();
      }, checkFrequencyInMs);
    }
  })();
};

waitForElementToDisplay("#paginator-top > menu",function(){
    window.addEventListener('hashchange', function(){
        Blacklisted.forEach(function (item) {
            $("a[href='/patreon/user/" + item + "']").remove(); //for recently updated
            $("a[href='/fanbox/user/" + item + "']").remove(); //this only works for the 100ms after a page load before it reloads itself (why?)
            $("a[href='/gumroad/user/" + item + "']").remove(); //i dont get paid for this, im not a developer, i dont know javascript, regex doesnt work, stop reading my comments, fuck you.
            $("a[href='/subscribestar/user/" + item + "']").remove();
            $("a[href='/dlsite/user/" + item + "']").remove();
            $("a[href='/discord/server/" + item + "']").remove();
            $("a[href='/fantia/user/" + item + "']").remove();
            $("a[href='/boosty/user/" + item + "']").remove();
            $("a[href='/afdian/user/" + item + "']").remove();
        });
    });
    Blacklisted.forEach(function (item) {
        $("a[href='/patreon/user/" + item + "']").remove(); //for recently updated
        $("a[href='/fanbox/user/" + item + "']").remove(); //this only works for the 100ms after a page load before it reloads itself (why?)
        $("a[href='/gumroad/user/" + item + "']").remove(); //i dont get paid for this, im not a developer, i dont know javascript, regex doesnt work, stop reading my comments, fuck you.
        $("a[href='/subscribestar/user/" + item + "']").remove();
        $("a[href='/dlsite/user/" + item + "']").remove();
        $("a[href='/discord/server/" + item + "']").remove();
        $("a[href='/fantia/user/" + item + "']").remove();
        $("a[href='/boosty/user/" + item + "']").remove();
        $("a[href='/afdian/user/" + item + "']").remove();
    });
},100,30000); //page takes longer than 30 seconds to load? (as it sometimes does), rip you then
