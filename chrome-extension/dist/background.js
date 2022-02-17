(function () {
	'use strict';

	chrome.runtime.onInstalled.addListener((()=>{chrome.runtime.openOptionsPage?chrome.runtime.openOptionsPage():window.open(chrome.runtime.getURL("libs_options.html"));})),chrome.runtime.onMessage.addListener((function(e,n,o){e.msg&&o({msg:"后台收到！"+e.msg});}));

}());
