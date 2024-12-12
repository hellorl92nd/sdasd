// ==UserScript==
// @name         Kemono.Party Blacklist
// @namespace    https://MeusArtis.ca
// @version      KCN1.0
// @author       Meus Artis
// @description  Blacklists posts by Creator ID
// @icon         https://www.google.com/s2/favicons?domain=kemono.su
// @match        https://kemono.su/*/user/*
// @match        https://kemono.su/artists*
// @match        https://kemono.su/account/favorites/*
// @match        https://kemono.su/dms*
// @match        https://kemono.su
// @match        https://coomer.su/*/user/*
// @match        https://coomer.su/artists*
// @match        https://coomer.su/account/favorites/*
// @match        https://coomer.su/dms*
// @match        https://coomer.su
// @match        https://nekohouse.su/*/user/*
// @match        https://nekohouse.su/artists*
// @match        https://nekohouse.su/account/favorites/*
// @match        https://nekohouse.su/dms*
// @match        https://nekohouse.su
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @license      CC BY-NC-SA 4.0
// @run-at       document-end
// @downloadURL https://update.sleazyfork.org/scripts/443899/KemonoParty%20Blacklist.user.js
// @updateURL https://update.sleazyfork.org/scripts/443899/KemonoParty%20Blacklist.meta.js
// ==/UserScript==
// ChatGPT Go BRRRR, still no idea why it only works when pasting urls in new tabs, but not right click > open in new tab/window
(function () {
    const BlacklistStorage = window.localStorage;
    const styleSheet = document.createElement("style");
    const styles = `.creator__blacklist{color:#ddd;font-weight:700;text-shadow:#000 0 0 3px,#000 -1px -1px 0px,#000 1px 1px 0;background-color:transparent;border:transparent}.user-header__blacklist{box-sizing:border-box;font-weight:700;color:#fff;text-shadow:#000 0 0 3px,#000 -1px -1px 0px,#000 1px 1px 0;background-color:transparent;border:transparent;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}`;
    document.head.appendChild(styleSheet);
    styleSheet.innerText = styles;
    styleSheet.type = "text/css";
    if (!BlacklistStorage.getItem("blacklist")) {
        alert("Blacklist does not exist, creating a new one");
        BlacklistStorage.setItem("blacklist", JSON.stringify([]));
    }
    const Blacklisted = JSON.parse(BlacklistStorage.getItem("blacklist"));
    function applyBlacklist() {
        Blacklisted.forEach((item) => {
            $(`article[data-user='${item}']`).css({ display: "none" });
            $(`a[data-id='${item}']`).css({ display: "none" });
            $(`article.dm-card header a[href='/patreon/user/${item}']`).closest("article").css({ display: "none" });
        });
    }
    function setupBlacklistButtons() {
        const HeadMetaPost = document.querySelector("meta[name='user']");
        const HeadMetaArtist = document.querySelector("meta[name='artist_name']");
        const HeadMetaID = HeadMetaPost ? HeadMetaPost.getAttribute("content") : null;
        const HeadMetaArtistID = document.querySelector("meta[name='id']").getAttribute("content");
        const ButtonArea = document.querySelector('.post__actions');
        const ButtonAreaArtist = document.querySelector('.user-header__actions');
        const BlacklistButton = document.createElement("BUTTON");
        BlacklistButton.classList.add("creator__blacklist");
        BlacklistButton.type = "button";
        if (HeadMetaID) {
            const isBlacklisted = Blacklisted.includes(HeadMetaID);
            BlacklistButton.innerHTML = isBlacklisted
                ? '<span class="creator__blacklist-icon">⛒</span><span>Blacklisted</span>'
                : '<span class="creator__blacklist-icon">⛔</span><span>Blacklist</span>';
            BlacklistButton.onclick = () => {
                if (isBlacklisted) {
                    Blacklisted.splice(Blacklisted.indexOf(HeadMetaID), 1);
                    alert("Creator Unblacklisted");
                } else {
                    Blacklisted.push(HeadMetaID);
                    alert("Creator Blacklisted");
                }
                BlacklistStorage.setItem("blacklist", JSON.stringify(Blacklisted));
                history.back();
            };
            if (ButtonArea) {
                console.log("Post Page");
                ButtonArea.appendChild(BlacklistButton);
            }
        } else {
            const isBlacklisted = Blacklisted.includes(HeadMetaArtistID);
            BlacklistButton.innerHTML = isBlacklisted
                ? '<span class="creator__blacklist-icon">⛒</span><span>Blacklisted</span>'
                : '<span class="creator__blacklist-icon">⛔</span><span>Blacklist</span>';
            BlacklistButton.onclick = () => {
                if (isBlacklisted) {
                    Blacklisted.splice(Blacklisted.indexOf(HeadMetaArtistID), 1);
                    alert("Creator Unblacklisted");
                } else {
                    Blacklisted.push(HeadMetaArtistID);
                    alert("Creator Blacklisted");
                }
                BlacklistStorage.setItem("blacklist", JSON.stringify(Blacklisted));
                history.back();
            };
            if (ButtonAreaArtist) {
                console.log("Artist Page");
                ButtonAreaArtist.appendChild(BlacklistButton);
            }
        }
    }
    function observeUrlChange(callback) {
        let lastUrl = location.href;
        new MutationObserver(() => {
            const currentUrl = location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                callback();
            }
        }).observe(document.body, { childList: true, subtree: true });
    }
    function initializeScript() {
        setTimeout(() => {
            applyBlacklist();
            setupBlacklistButtons();
        }, 333);
    }
    window.addEventListener("DOMContentLoaded", initializeScript);
    observeUrlChange(initializeScript);
})();
