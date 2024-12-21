// 해당부분의 적용을 확인하려면 확장프로그램을 다시로드해야함.
var quickSearchService = {
    selectedText : "",
    serviceArea: null,
    globalData: null,
    init: () => {
        var self = quickSearchService;
        self.loadInChromeStorage();
    },

    load: () => {
        var self = quickSearchService;
        if(self.globalData.floatingService){
            self.createElement();
        }
        if(self.globalData.useDrag){
            self.dragController();
            self.dragIFrameController();
            new MutationObserver(() => self.dragController()).observe(document.body, { childList: true, subtree: true });
            new MutationObserver(() => self.dragIFrameController()).observe(document.body, { childList: true, subtree: true });
        }
    },

    dragController: () => {
        document.addEventListener('selectstart', event => {
            event.stopPropagation();
        }, true);

        document.addEventListener('dragstart', (event) => {
            event.stopPropagation();
        }, true);

        document.addEventListener('contextmenu', (event) => {
            event.stopPropagation();
        },true);
      
        document.addEventListener('keydown', (event) => {
            if (event.key === 'F12' || (event.ctrlKey && event.shiftKey && event.key === 'I')) {
                event.stopPropagation();
            }
        },true);
      
        document.addEventListener('mousedown', (event) => {
            if (event.button === 2) { 
                event.stopPropagation();
            }
        },true);

        document.querySelectorAll('*').forEach((el) => {
            const style = window.getComputedStyle(el);
            if (style.userSelect === 'none') {
              el.style.userSelect = 'text';
            }
        });
    },

    dragIFrameController: () => {
        var iframes = document.querySelectorAll('iframe');
        iframes.forEach((iframe) => {
            try {
              iframe.contentWindow.document.addEventListener('contextmenu', (event) => {
                event.stopPropagation();
              }, true);
      
              iframe.contentWindow.document.addEventListener('selectstart', (event) => {
                event.stopPropagation();
              }, true);
              
              const overrideIframeUserSelect = () => {
                iframe.contentWindow.document.querySelectorAll('*').forEach((el) => {
                  const style = iframe.contentWindow.getComputedStyle(el);
                  if (style.userSelect === 'none') {
                    el.style.userSelect = 'text';
                  }
                });
              };
      
              overrideIframeUserSelect();
              new MutationObserver(() => overrideIframeUserSelect()).observe(iframe.contentWindow.document.body, { childList: true, subtree: true });
            } catch (e) {
              console.log('IFrame제어실패:', e);
            }
          });
    },

    createElement: () => {
        var elList = [
            {
                tag: "div",
                class: "quickSearchServiceArea",
                id: "quickSearchServiceArea",
                textContent: "",
                title: ""
            },
            {
                tag: "div",
                class: "quickSearchServiceBTN",
                id: "__QUICKSEARCH_copyBTN",
                textContent: "📎",
                title: "Copy"
            },
            {
                tag: "div",
                class: "quickSearchServiceBTN",
                id: "__QUICKSEARCH_translationBTN",
                textContent: "🔄",
                title: "Translation"
            },
            {
                tag: "div",
                class: "quickSearchServiceBTN",
                id: "__QUICKSEARCH_quickSearchText",
                textContent: "🔍",
                title: "Search"
            }
        ]
        for(var i = 0; i < elList.length; i++){
            var el = document.createElement(elList[i].tag);
            el.id = elList[i].id;
            el.className = elList[i].class;
            el.textContent = elList[i].textContent;

            if(elList[i].title != ""){
                el.title = elList[i].title;
            }

            if(i===0){
                document.body.appendChild(el);
            }else{
                var parent = document.getElementById(elList[0].id);
                if(parent){
                    parent.appendChild(el);
                }
            }
        }

    },

    copyText: () => {
        var self = quickSearchService;
        if (self.selectedText) {
            navigator.clipboard.writeText(self.selectedText).then(() => {
                
            });
        }
    },

    goURL: (URL) => {
        // 탭생성후 URL이동
        window.open(URL, '_blank');
    },

    loadInChromeStorage: () => {
        var self = quickSearchService;
        chrome.runtime.sendMessage({ action: "getQuickSearchGlobal"}, response => {
            self.globalData = response;
            self.load();
        });
    },

    hideServiceArea: () => {
        var self = quickSearchService;
        self.serviceArea = document.getElementById("quickSearchServiceArea");
        self.serviceArea.style.display = "none";
    },

    hideQuickSearchGuide : event => {
        var self = quickSearchService;
        var serviceArea = document.getElementById("quickSearchServiceArea");
        if (!serviceArea.contains(event.target)) {
            self.hideServiceArea();
        }
    },

    showQuickSearchGuide : (event) => {
        var self = quickSearchService;
        var selection = window.getSelection();
        var text = selection.toString().trim();
        var targetElement = event.target;
        
        if (targetElement.tagName === "INPUT" || targetElement.tagName === "TEXTAREA") {
            self.hideServiceArea();
            return;
        }

        if(text){
            self.selectedText = text;

            var range = selection.getRangeAt(0); // 선택 영역 가져오기
            var rect = range.getBoundingClientRect(); // 선택 영역의 위치 계산

            self.serviceArea = document.getElementById("quickSearchServiceArea");
            var serviceAreaWidth = 100; // 버튼의 가로 크기 (예: 100px)
            var serviceAreaHeight = 40; // 버튼의 세로 크기 (예: 40px)

            var serviceAreaX = rect.left + window.scrollX; // 버튼의 기본 X 위치
            var serviceAreaY = rect.top + window.scrollY - serviceAreaHeight - 25; // 버튼의 기본 Y 위치 (텍스트 위)

            var viewportWidth = window.innerWidth;
            // var viewportHeight = window.innerHeight;

            if (serviceAreaX + serviceAreaWidth > viewportWidth) {
                serviceAreaX = viewportWidth - serviceAreaWidth + 10; // 화면 오른쪽 밖으로 벗어나지 않게
            }
            if (serviceAreaX < 0) {
                serviceAreaX = 20; // 화면 왼쪽 밖으로 벗어나지 않게
            }
            if (serviceAreaY < 0) {
                serviceAreaY = rect.bottom + window.scrollY + 10; // 화면 위쪽 밖으로 벗어나면 텍스트 아래로 이동
            }

            self.serviceArea.style.left = `${serviceAreaX}px`;
            self.serviceArea.style.top = `${serviceAreaY}px`;
            self.serviceArea.style.display = "flex";
        } else {
            self.hideServiceArea();
        }
    }
}

quickSearchService.init();

document.addEventListener("mouseup", event => {
    quickSearchService.showQuickSearchGuide(event);
})

document.addEventListener("mousedown", event => {
    quickSearchService.hideQuickSearchGuide(event);
});

document.addEventListener('click', event => {
    var self = quickSearchService;
    if (event.target && event.target.id === '__QUICKSEARCH_copyBTN') {
        self.copyText();
    }else if (event.target && event.target.id === '__QUICKSEARCH_translationBTN'){
        if(self.globalData.usePapago === undefined){
            self.globalData.usePapago = false;
        }

        var link = `https://translate.google.co.kr/?sl=auto&tl=${self.globalData.UILanguage}&text=${self.selectedText}&op=translate`

        if(self.globalData.usePapago){
            link = `https://papago.naver.com/?sk=auto&tk=${self.globalData.UILanguage}&hn=0&st=${self.selectedText}`
        }
        // 
        self.goURL(link);
    }
    else if (event.target && event.target.id === '__QUICKSEARCH_quickSearchText'){
        var link = self.globalData.defaultSearchURL + self.selectedText;
        self.goURL(link);
    }
    // event.target.blur();
});