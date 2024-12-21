var event = {

    getData : () => {
        
    },
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === "getQuickSearchGlobal") {
        chrome.storage.sync.get(["quickSearchGlobal"], result => { 
            var stringData = result.quickSearchGlobal;
            if(stringData === undefined){
                // 최초실행일경우(데이터가 없다)
                // self.saveInChromeStorage(initData);
                // stringData = JSON.stringify(initData);
                // 초기값 설정하기END
            }
            var jsonData = JSON.parse(stringData);
            sendResponse(jsonData);
        });
        return true; // sendResponse 비동기 처리 허용
    }
});