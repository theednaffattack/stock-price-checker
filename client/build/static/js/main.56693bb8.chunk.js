(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{16:function(e,t,n){e.exports=n.p+"static/media/logo.5d5d9eef.svg"},19:function(e,t,n){e.exports=n(48)},25:function(e,t,n){},47:function(e,t,n){},48:function(e,t,n){"use strict";n.r(t);var o=n(0),a=n.n(o),s=n(11),r=n.n(s),c=(n(25),n(2)),l=n.n(c),i=n(3),p=n(12),u=n(13),m=n(17),k=n(14),h=n(18),f=n(15),d=n.n(f),g=n(16),v=n.n(g),E=(n(47),function(e){function t(){var e,n;Object(p.a)(this,t);for(var o=arguments.length,a=new Array(o),s=0;s<o;s++)a[s]=arguments[s];return(n=Object(m.a)(this,(e=Object(k.a)(t)).call.apply(e,[this].concat(a)))).state={response:"",responseToo:[],post:{stock:"",like:!1},post2:{stock1:"",like1:!1,stock2:"",like2:!1},hello:"",responseToPost:""},n.callApi=function(){var e=Object(i.a)(l.a.mark(function e(t){var o,a,s,r,c;return l.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t.preventDefault(),o=encodeURIComponent,a=Object.keys(n.state.post).map(function(e){return o(e)+"="+o(n.state.post[e])}).join("&"),console.log(a),s="/api/stock-prices?"+a,e.next=7,fetch(s);case 7:return r=e.sent,e.next=10,r.json();case 10:if(c=e.sent,200===r.status){e.next=13;break}throw Error(c.message);case 13:return console.log("data return from `callApi`"),console.log(c),n.setState({response:c}),e.abrupt("return",c);case 17:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),n.callApiToo=function(){var e=Object(i.a)(l.a.mark(function e(t){var o,a,s,r;return l.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return console.log("WHERE ARE MY LOGS?"),t.preventDefault(),o=encodeURIComponent,a=Object.keys(n.state.post2).map(function(e){return o(e)+"="+o(n.state.post2[e])}).join("&"),s=a.replace(/\d/g,""),console.log("query"),console.log(a.replace(/\d/g,"")),e.next=9,d.a.get("/api/stock-prices?".concat(s));case 9:if(200===(r=e.sent).status){e.next=12;break}throw Error(r.message);case 12:return console.log("ALL THAT SWEET DATA"),console.log(r.data.stockData),n.setState({responseToo:r.data.stockData}),e.abrupt("return",r);case 16:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),n.handleSubmit=function(){var e=Object(i.a)(l.a.mark(function e(t){var o,a;return l.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t.preventDefault(),e.next=3,fetch("/api/world",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({post:n.state.post})});case 3:return o=e.sent,e.next=6,o.text();case 6:a=e.sent,n.setState({responseToPost:a});case 8:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),n}return Object(h.a)(t,e),Object(u.a)(t,[{key:"render",value:function(){var e=this;return a.a.createElement("div",{className:"App"},a.a.createElement("header",{className:"App-header"},a.a.createElement("img",{src:v.a,className:"App-logo",alt:"logo"}),a.a.createElement("p",null,"Edit ",a.a.createElement("code",null,"src/App.js")," and save to reload."),a.a.createElement("a",{className:"App-link",href:"https://reactjs.org",target:"_blank",rel:"noopener noreferrer"},"Learn React")),a.a.createElement("pre",null,JSON.stringify(this.state,null,2)),a.a.createElement("form",{name:"stock_form",id:"stock_form",onSubmit:this.callApi},a.a.createElement("input",{value:this.state.post.stock,type:"text",name:"stock",id:"stock",onChange:function(t){return e.setState({post:{stock:t.target.value,likes:!1}})}}),a.a.createElement("input",{value:this.state.post.like,type:"checkbox",name:"like",id:"like",checked:this.state.post.like,onChange:function(t){return e.setState(function(e){return{post:{stock:e.post.stock,like:!e.post.like}}})}}),a.a.createElement("p",null,this.state.response.stockSymbol),a.a.createElement("p",null,this.state.response.lastRefreshed),a.a.createElement("p",null,this.state.response.timeZone),a.a.createElement("p",null,this.state.response.dailyHigh),a.a.createElement("button",{type:"submit"},"SUBMIT")),a.a.createElement("form",{name:"two_stocks_form",id:"two_stocks_form",onSubmit:this.callApiToo},a.a.createElement("input",{name:"stock1",value:this.state.post2.stock1,onChange:function(t){t.preventDefault();var n=t.target.value;e.setState(function(e,t){return{post2:{stock1:n,like1:e.post2.like1,stock2:e.post2.stock2,like2:e.post2.like2}}})},id:"stock1",type:"text"}),a.a.createElement("input",{name:"stock2",value:this.state.post2.stock2,onChange:function(t){t.preventDefault();var n=t.target.value;e.setState(function(e,t){return{post2:{stock1:e.post2.stock1,like1:e.post2.like1,stock2:n,like2:e.post2.like2}}})},id:"stock1",type:"text"}),a.a.createElement("input",{value:this.state.post2.like2,type:"checkbox",name:"like_both",id:"like_both",checked:this.state.post2.like2,onChange:function(t){return e.setState(function(e){return{post2:{stock1:e.post2.stock1,like1:!e.post2.like1,stock2:e.post2.stock2,like2:!e.post2.like2}}})}}),a.a.createElement("button",{type:"submit"},"SUBMIT")),a.a.createElement("form",{name:"hello_form",id:"hello_form",onSubmit:this.handleSubmit},a.a.createElement("p",null,a.a.createElement("strong",null,"Post to Server:")),a.a.createElement("input",{type:"text",name:"hello",id:"hello",value:this.state.hello,onChange:function(t){return e.setState({hello:t.target.value})}}),a.a.createElement("button",{type:"submit"},"Submit")),a.a.createElement("p",null,this.state.responseToPost))}}]),t}(o.Component));Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(a.a.createElement(E,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[19,1,2]]]);
//# sourceMappingURL=main.56693bb8.chunk.js.map