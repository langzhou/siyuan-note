(function () {
	'use strict';

	chrome.runtime.onInstalled.addListener((()=>{console.log("[crx3] background.js is running..."),console.log("background import success...");})),chrome.runtime.onMessage.addListener((function(n,s,e){n.msg&&e({msg:"后台收到！"+n.msg});}));

}());
