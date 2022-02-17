import demo from './demo'

// 安装完成后打开设置页面
chrome.runtime.onInstalled.addListener(() => {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('libs_options.html'));
  }

})


/* 接收消息 */
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.msg)
        sendResponse({msg: "后台收到！"+ request.msg});
    }
  );
  
