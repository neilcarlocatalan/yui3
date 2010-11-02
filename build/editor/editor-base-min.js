YUI.add("editor-base",function(D){var C=function(){C.superclass.constructor.apply(this,arguments);},B=":last-child",A="body";D.extend(C,D.Base,{frame:null,initializer:function(){var E=new D.Frame({designMode:true,title:C.STRINGS.title,use:C.USE,dir:this.get("dir"),extracss:this.get("extracss"),linkedcss:this.get("linkedcss"),defaultblock:this.get("defaultblock"),host:this}).plug(D.Plugin.ExecCommand);E.after("ready",D.bind(this._afterFrameReady,this));E.addTarget(this);this.frame=E;this.publish("nodeChange",{emitFacade:true,bubbles:true,defaultFn:this._defNodeChangeFn});},destructor:function(){this.frame.destroy();this.detachAll();},copyStyles:function(H,G){if(H.test("a")){return;}var E=["color","fontSize","fontFamily","backgroundColor","fontStyle"],F={};D.each(E,function(I){F[I]=H.getStyle(I);});if(H.ancestor("b,strong")){F.fontWeight="bold";}if(H.ancestor("u")){if(!F.textDecoration){F.textDecoration="underline";}}G.setStyles(F);},_lastBookmark:null,_resolveChangedNode:function(I){var H=this.getInstance(),F,E,G;if(H&&I&&I.test("html")){F=H.one(A).one(B);while(!G){if(F){E=F.one(B);if(E){F=E;}else{G=true;}}else{G=true;}}if(F){if(F.test("br")){if(F.previous()){F=F.previous();}else{F=F.get("parentNode");}}if(F){I=F;}}}return I;},_defNodeChangeFn:function(R){var I=(new Date()).getTime();var P=this.getInstance(),H,S,O=P.Selection.DEFAULT_BLOCK_TAG;if(D.UA.ie){try{H=P.config.doc.selection.createRange();if(H.getBookmark){this._lastBookmark=H.getBookmark();}}catch(F){}}R.changedNode=this._resolveChangedNode(R.changedNode);switch(R.changedType){case"keydown":P.Selection.cleanCursor();break;case"tab":if(!R.changedNode.test("li, li *")&&!R.changedEvent.shiftKey){R.changedEvent.frameEvent.preventDefault();if(D.UA.webkit){this.execCommand("inserttext","\t");}else{H=new P.Selection();H.setCursor();S=H.getCursor();S.insert(C.TABKEY,"before");H.focusCursor();P.Selection.cleanCursor();}}break;}if(D.UA.webkit&&R.commands&&(R.commands.indent||R.commands.outdent)){var T=P.all(".webkit-indent-blockquote");if(T.size()){T.setStyle("margin","");}}var N=this.getDomPath(R.changedNode,false),E={},M,G,K=[],L="",J="";if(R.commands){E=R.commands;}D.each(N,function(Z){var V=Z.tagName.toLowerCase(),a=C.TAG2CMD[V];if(a){E[a]=1;}var Y=Z.currentStyle||Z.style;if((""+Y.fontWeight)=="bold"){E.bold=1;}if(Y.fontStyle=="italic"){E.italic=1;}if(Y.textDecoration=="underline"){E.underline=1;}if(Y.textDecoration=="line-through"){E.strikethrough=1;}var b=P.one(Z);if(b.getStyle("fontFamily")){var X=b.getStyle("fontFamily").split(",")[0].toLowerCase();if(X){M=X;}if(M){M=M.replace(/'/g,"").replace(/"/g,"");}}G=C.NORMALIZE_FONTSIZE(b);var W=Z.className.split(" ");D.each(W,function(c){if(c!==""&&(c.substr(0,4)!=="yui_")){K.push(c);}});L=C.FILTER_RGB(b.getStyle("color"));var U=C.FILTER_RGB(Y.backgroundColor);if(U!=="transparent"){if(U!==""){J=U;}}});R.dompath=P.all(N);R.classNames=K;R.commands=E;if(!R.fontFamily){R.fontFamily=M;}if(!R.fontSize){R.fontSize=G;}if(!R.fontColor){R.fontColor=L;}if(!R.backgroundColor){R.backgroundColor=J;}var Q=(new Date()).getTime();},getDomPath:function(G,E){var I=[],F,H=this.frame.getInstance();F=H.Node.getDOMNode(G);while(F!==null){if((F===H.config.doc.documentElement)||(F===H.config.doc)||!F.tagName){F=null;break;}if(!H.DOM.inDoc(F)){F=null;break;}if(F.nodeName&&F.nodeType&&(F.nodeType==1)){I.push(F);}if(F==H.config.doc.body){F=null;break;}F=F.parentNode;}if(I.length===0){I[0]=H.config.doc.body;}if(E){return H.all(I.reverse());}else{return I.reverse();}},_afterFrameReady:function(){var E=this.frame.getInstance();this.frame.on("dom:mouseup",D.bind(this._onFrameMouseUp,this));this.frame.on("dom:mousedown",D.bind(this._onFrameMouseDown,this));this.frame.on("dom:keydown",D.bind(this._onFrameKeyDown,this));if(D.UA.ie){this.frame.on("dom:activate",D.bind(this._onFrameActivate,this));this.frame.on("dom:keyup",D.throttle(D.bind(this._onFrameKeyUp,this),800));this.frame.on("dom:keypress",D.throttle(D.bind(this._onFrameKeyPress,this),800));}else{this.frame.on("dom:keyup",D.bind(this._onFrameKeyUp,this));this.frame.on("dom:keypress",D.bind(this._onFrameKeyPress,this));}E.Selection.filter();this.fire("ready");},_onFrameActivate:function(){if(this._lastBookmark){try{var G=this.getInstance(),F=G.config.doc.selection.createRange(),E=F.moveToBookmark(this._lastBookmark);F.select();this._lastBookmark=null;}catch(H){}}},_onFrameMouseUp:function(E){this.fire("nodeChange",{changedNode:E.frameTarget,changedType:"mouseup",changedEvent:E.frameEvent});},_onFrameMouseDown:function(E){this.fire("nodeChange",{changedNode:E.frameTarget,changedType:"mousedown",changedEvent:E.frameEvent});},_currentSelection:null,_currentSelectionTimer:null,_currentSelectionClear:null,_onFrameKeyDown:function(G){var F,E;if(!this._currentSelection){if(this._currentSelectionTimer){this._currentSelectionTimer.cancel();}this._currentSelectionTimer=D.later(850,this,function(){this._currentSelectionClear=true;});F=this.frame.getInstance();E=new F.Selection(G);this._currentSelection=E;}else{E=this._currentSelection;}F=this.frame.getInstance();E=new F.Selection();this._currentSelection=E;if(E&&E.anchorNode){this.fire("nodeChange",{changedNode:E.anchorNode,changedType:"keydown",changedEvent:G.frameEvent});if(C.NC_KEYS[G.keyCode]){this.fire("nodeChange",{changedNode:E.anchorNode,changedType:C.NC_KEYS[G.keyCode],changedEvent:G.frameEvent});this.fire("nodeChange",{changedNode:E.anchorNode,changedType:C.NC_KEYS[G.keyCode]+"-down",changedEvent:G.frameEvent});}}},_onFrameKeyPress:function(F){var E=this._currentSelection;if(E&&E.anchorNode){this.fire("nodeChange",{changedNode:E.anchorNode,changedType:"keypress",changedEvent:F.frameEvent});if(C.NC_KEYS[F.keyCode]){this.fire("nodeChange",{changedNode:E.anchorNode,changedType:C.NC_KEYS[F.keyCode]+"-press",changedEvent:F.frameEvent});}}},_onFrameKeyUp:function(F){var E=this._currentSelection;if(E&&E.anchorNode){this.fire("nodeChange",{changedNode:E.anchorNode,changedType:"keyup",selection:E,changedEvent:F.frameEvent});if(C.NC_KEYS[F.keyCode]){this.fire("nodeChange",{changedNode:E.anchorNode,changedType:C.NC_KEYS[F.keyCode]+"-up",selection:E,changedEvent:F.frameEvent});
}}if(this._currentSelectionClear){this._currentSelectionClear=this._currentSelection=null;}},execCommand:function(I,K){var F=this.frame.execCommand(I,K),H=this.frame.getInstance(),G=new H.Selection(),E={},J={changedNode:G.anchorNode,changedType:"execcommand",nodes:F};switch(I){case"forecolor":J.fontColor=K;break;case"backcolor":J.backgroundColor=K;break;case"fontsize":J.fontSize=K;break;case"fontname":J.fontFamily=K;break;}E[I]=1;J.commands=E;this.fire("nodeChange",J);return F;},getInstance:function(){return this.frame.getInstance();},render:function(E){this.frame.set("content",this.get("content"));this.frame.render(E);return this;},focus:function(E){this.frame.focus(E);return this;},show:function(){this.frame.show();return this;},hide:function(){this.frame.hide();return this;},getContent:function(){var E="",F=this.getInstance();if(F&&F.Selection){E=F.Selection.unfilter();}E=E.replace(/ _yuid="([^>]*)"/g,"");return E;}},{NORMALIZE_FONTSIZE:function(G){var E=G.getStyle("fontSize"),F=E;switch(E){case"-webkit-xxx-large":E="48px";break;case"xx-large":E="32px";break;case"x-large":E="24px";break;case"large":E="18px";break;case"medium":E="16px";break;case"small":E="13px";break;case"x-small":E="10px";break;}if(F!==E){G.setStyle("fontSize",E);}return E;},TABKEY:'<span class="tab">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>',FILTER_RGB:function(G){if(G.toLowerCase().indexOf("rgb")!=-1){var J=new RegExp("(.*?)rgb\\s*?\\(\\s*?([0-9]+).*?,\\s*?([0-9]+).*?,\\s*?([0-9]+).*?\\)(.*?)","gi");var F=G.replace(J,"$1,$2,$3,$4,$5").split(",");if(F.length==5){var I=parseInt(F[1],10).toString(16);var H=parseInt(F[2],10).toString(16);var E=parseInt(F[3],10).toString(16);I=I.length==1?"0"+I:I;H=H.length==1?"0"+H:H;E=E.length==1?"0"+E:E;G="#"+I+H+E;}}return G;},TAG2CMD:{"b":"bold","strong":"bold","i":"italic","em":"italic","u":"underline","sup":"superscript","sub":"subscript","img":"insertimage","a":"createlink","ul":"insertunorderedlist","ol":"insertorderedlist"},NC_KEYS:{8:"backspace",9:"tab",13:"enter",32:"space",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",46:"delete"},USE:["substitute","node","selector-css3","selection","stylesheet"],NAME:"editorBase",STRINGS:{title:"Rich Text Editor"},ATTRS:{content:{value:"<br>",setter:function(E){if(E.substr(0,1)==="\n"){E=E.substr(1);}if(E===""){E="<br>";}return this.frame.set("content",E);},getter:function(){return this.frame.get("content");}},dir:{writeOnce:true,value:"ltr"},linkedcss:{value:"",setter:function(E){if(this.frame){this.frame.set("linkedcss",E);}return E;}},extracss:{value:false,setter:function(E){if(this.frame){this.frame.set("extracss",E);}return E;}},defaultblock:{value:"p"}}});D.EditorBase=C;},"@VERSION@",{requires:["base","frame","node","exec-command","selection","editor-para"],skinnable:false});