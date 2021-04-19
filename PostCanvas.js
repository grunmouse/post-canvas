/* PostCanvas - A PostScript interpreter for the Web
 * 
 * Copyright 2009 Michael Feiri, Christine Kochner
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License. 
 */
 
 
if(typeof Matrix === 'undefined' && typeof require === 'function'){
	var Matrix = require('./SquareMatrix.js');
}

function PostCanvas(target, source) {
	
	// public methods
	this.update = function(input) {
		
		var tokens;
		try {
			tokens = scan(bufferedInput+input+"\n");
			bufferedInput = "";
		} catch (e) {
			bufferedInput+=input+"\n";
			return e;
		}
		
		// todo: actually use the execStack for anything?
		//execStack.push(tokens);
		//execStack.push("-postcanvas-");
		
		return run(tokens);
	};
	
	
	// constructor
	opStack = new Array();
	execStack = new Array();
	dictStack = new Array();
	
	var currentX = 0;
	var currentY = 0;
	var CTMident = new Matrix(1,0,0, 0,1,0, 0,0,1); // [1,0,0,1,0,0];
	var CTMdelta = CTMident;
	var CTM = CTMident;
	var pathX;
	var pathY;
	
	userDict = new Object();
	systemDict = new Object();
	
	systemDict["["] = function() {
		opStack.push("[");
	};
	systemDict["]"] = function() {
		var arr = new Array();
		do {
			arr.unshift(opStack.pop());
		} while (arr[0]!="[")
		arr.shift();
		opStack.push(arr);
	};
	systemDict["="] = function() {
		alert(opStack.pop());
	};
	systemDict["=="] = function() {
		// todo: do more than "="?
		alert(opStack.pop());
	};
	systemDict["add"] = function() {
		a = parseFloat(opStack.pop());
		b = parseFloat(opStack.pop());
		opStack.push(a+b);
	};
	systemDict["arc"] = function() {
		angle2 = opStack.pop();
		angle1 = opStack.pop();
		r = opStack.pop();
		y = opStack.pop();
		x = opStack.pop();
		// todo: update currentpoint
		ctx.arc(x,-y,r,degToRad(angle1),degToRad(angle2),true);
	};
	systemDict["arcn"] = function() {
		angle2 = opStack.pop();
		angle1 = opStack.pop();
		r = opStack.pop();
		y = opStack.pop();
		x = opStack.pop();
		// todo: update currentpoint
		ctx.arc(x,-y,r,degToRad(angle1),degToRad(angle2),false);
	};
	systemDict["array"] = function() {
		var len = opStack.pop();
		opStack.push(new Array(len));
	};
	systemDict["begin"] = function() {
		dict = opStack.pop();
		dictStack.push(dict);
	};
	systemDict["bind"] = function() {
		var proc = opStack.pop();
		opStack.push(bind(proc));
	};
	systemDict["clippath"] = function() {
		// todo: for now, clippath can only be used to set a bgcolor which is its typicall use
		ctx.rect(0,0,canvasElement.width,-canvasElement.height);
	};
	systemDict["closepath"] = function() {
		ctx.closePath();
	};
	systemDict["copy"] = function() {
		// todo: this is unlikely to work for string objects and gstates
		var firstOp = opStack.pop();
		if (typeof firstOp == "object") {
			var secondOp = opStack.pop();
			for (i in secondOp) {
				firstOp[i]=secondOp[i];
			}
		} else {
			var arr = new Array();
			for (;firstOp>0;firstOp--) {
				arr.unshift(opStack.pop());
			}
			opStack = opStack.concat(arr).concat(arr);
		}
	};
	systemDict["currentflat"] = function() {
		// todo: flatness is not supported by HTML5 Canvas
		opStack.push("42");
	};
	systemDict["currentlinecap"] = function() {
		var lineCap = ctx.lineCap;
		if (lineCap=="square") {
			lineCap="2";
		} else if (lineCap=="round") {
			lineCap="1";
		} else {
			lineCap="0";
		}
		opStack.push(lineCap);
	};
	systemDict["currentlinejoin"] = function() {
		var linejoin = ctx.lineJoin;
		if (linejoin=="bevel") {
			linejoin="2";
		} else if (linejoin=="round") {
			linejoin="1";
		} else {
			linejoin="0";
		}
		opStack.push(linejoin);
	};
	systemDict["currentlinewidth"] = function() {
		opStack.push(ctx.lineWidth);
	};
	systemDict["currentmiterlimit"] = function() {
		opStack.push(ctx.miterLimit);
	};
	systemDict["currentpoint"] = function() {
		opStack.push(currentX);
		opStack.push(currentY);
	};
	systemDict["curveto"] = function() {
		currentY = parseFloat(opStack.pop());
		currentX = parseFloat(opStack.pop());
		y2 = opStack.pop();
		x2 = opStack.pop();
		y1 = opStack.pop();
		x1 = opStack.pop();
		// todo: update currentpoint
		ctx.bezierCurveTo(x1,-y1,x2,-y2,currentX,-currentY);
	};
	systemDict["cvx"] = function() {
		opStack.push(new Array.concat(opStack.pop()));
	};
	systemDict["def"] = function() {
		var val = opStack.pop();
		var key = opStack.pop();
		dictStack[dictStack.length-1][key] = val;
	};
	systemDict["dict"] = function() {
		size = opStack.pop();
		//opStack.push(new Array(parseInt(size)));
		opStack.push(new Object());
	};
	systemDict["div"] = function() {
		a = parseFloat(opStack.pop());
		b = parseFloat(opStack.pop());
		opStack.push(b/a);
	};
	systemDict["dup"] = function() {
		var a = opStack.pop();
		opStack.push(a);
		opStack.push(a);
	};
	systemDict["end"] = function() {
		dictStack.pop();
	};
	systemDict["eq"] = function() {
		a = opStack.pop();
		b = opStack.pop();
		opStack.push(b==a);
	};
	systemDict["exch"] = function() {
		a = opStack.pop();
		b = opStack.pop();
		opStack.push(a);
		opStack.push(b);
	};
	systemDict["exec"] = function() {
		run(opStack.pop());
	};
	systemDict["fill"] = function() {
		// todo: investigate discrepancies between postscript and canvas
		ctx.fill();
		ctx.beginPath();
		ctx.moveTo(currentX,-currentY);
	};
	systemDict["for"] = function() {
		var proc = opStack.pop();
		var lim = parseFloat(opStack.pop());
		var inc = parseFloat(opStack.pop());
		var ini = parseFloat(opStack.pop());
		if (inc>0) {
			for (var control=ini;control<=lim;control+=inc) {
				run(new Array(control.toString()).concat(proc));
			}
		} else {
			for (var control=ini;control>=lim;control+=inc) {
				run(new Array(control.toString()).concat(proc));
			}
		}
	};
	systemDict["forall"] = function() {
		var proc = opStack.pop();
		var what = opStack.pop();
		for(var i in what) {
			run(new Array(what[i].toString()).concat(proc));
		}
	};
	systemDict["ge"] = function() {
		a = opStack.pop();
		b = opStack.pop();
		opStack.push(b>=a);
	};
	systemDict["get"] = function() {
		dat = opStack.pop();
		idx = opStack.pop();
		opStack.push(dat[idx]);
	};
	systemDict["gsave"] = function() {
		ctx.save();
	};
	systemDict["grestore"] = function() {
		ctx.restore();
	};
	systemDict["grestoreall"] = function() {
		//todo
	};
	systemDict["gt"] = function() {
		a = opStack.pop();
		b = opStack.pop();
		opStack.push(b>a);
	};
	systemDict["identmatrix"] = function() {
		opStack.pop();
		run("[","1","0","0","1","0","0","]");
	};
	systemDict["if"] = function() {
		var proc = opStack.pop();
		var cond = opStack.pop();
		if (cond) {
			run(proc);
		}
	};
	systemDict["ifelse"] = function() {
		var proc2 = opStack.pop();
		var proc1 = opStack.pop();
		var cond = opStack.pop();
		if (cond) {
			run(proc1);
		} else {
			run(proc2);
		}
	};
	systemDict["index"] = function() {
		var indexN = opStack.pop();
		var arr = new Array();
		for(var x=0;x<=indexN;x++) {
			  arr.unshift(opStack.pop());
		}
		var dupme = arr.shift();
		arr.unshift(dupme);
		arr.push(dupme);
		opStack = opStack.concat(arr);
	};
	systemDict["itransform"] = function() {
		var firstOp = opStack.pop();
		var secondOp = opStack.pop();
		if (typeof firstOp == "object") {
			var thirdOp = opStack.pop();
			var iMAT = new Matrix(firstOp[0],firstOp[1],0, firstOp[2],firstOp[3],0, firstOp[4],firstOp[5],1).inverse();
			opStack.push(xUnderMatrix(thirdOp,secondOp,iMAT));
			opStack.push(yUnderMatrix(thirdOp,secondOp,iMAT));
		} else {
			var iCTM = CTM.inverse();
			opStack.push(xUnderMatrix(secondOp,firstOp,iCTM));
			opStack.push(yUnderMatrix(secondOp,firstOp,iCTM));
		}
	};
	systemDict["le"] = function() {
		a = opStack.pop();
		b = opStack.pop();
		opStack.push(b<=a);
	};
	systemDict["length"] = function() {
		var arr = opStack.pop();
		opStack.push(arr.length);
	};
	systemDict["lineto"] = function() {
		currentY = parseFloat(opStack.pop());
		currentX = parseFloat(opStack.pop());
		ctx.lineTo(currentX,-currentY);
		pathX=currentX;
		pathY=currentY;
		CTMdelta = CTMident;
	};
	systemDict["load"] = function() {
		var key = opStack.pop();
		var valu = inDictStack(key);
		if (typeof valu == "function") {
			opStack.push(new Array(key));
		} else {
			opStack.push(valu);
		}
	};
	systemDict["lt"] = function() {
		a = opStack.pop();
		b = opStack.pop();
		opStack.push(b<a);
	};
	systemDict["mark"] = function() {
		opStack.push("[");
	};
	systemDict["matrix"] = function() {
		run("[","1","0","0","1","0","0","]");
	};
	systemDict["moveto"] = function() {
		currentY = parseFloat(opStack.pop());
		currentX = parseFloat(opStack.pop());
		ctx.moveTo(currentX,-currentY);
		pathX=currentX;
		pathY=currentY;
		CTMdelta = CTMident;
	};
	systemDict["mul"] = function() {
		a = parseFloat(opStack.pop());
		b = parseFloat(opStack.pop());
		opStack.push(a*b);
	};
	systemDict["neg"] = function() {
		num = opStack.pop();
		opStack.push(num*(-1));
	};
	systemDict["newpath"] = function() {
		ctx.beginPath();
	};
	systemDict["pop"] = function() {
		opStack.pop();
	};
	systemDict["repeat"] = function() {
		var proc = opStack.pop();
		for (cnt=opStack.pop();cnt>0;cnt--) {
			run(proc);
		}
	};
	systemDict["restore"] = function() {
		//todo
		opStack.pop();
	};
	systemDict["rlineto"] = function() {
		// todo: not all of this is always necessary 
		var offY = parseFloat(opStack.pop());
		var offX = parseFloat(opStack.pop());
		pathY += yUnderMatrix(offX,offY,CTMdelta);
		pathX += xUnderMatrix(offX,offY,CTMdelta);
		var iCTMdelta = CTMdelta.inverse();
		currentX = xUnderMatrix(pathX,pathY,iCTMdelta);
		currentY = yUnderMatrix(pathX,pathY,iCTMdelta);
		ctx.lineTo(currentX,-currentY);
		pathX=currentX;
		pathY=currentY;
		CTMdelta = CTMident;
	};
	systemDict["roll"] = function() {
		//todo: verify and optimize
		var j = opStack.pop();
		var n = opStack.pop();
		var any = new Array();
		for(var x=0;x<n;x++) {
			  any.push(opStack.pop());
		}
		j=(j*1)+(2*n); // offset to positive and guard against concat
		for(var y=1;y<=n;y++) {
			  opStack.push(any[(j-y)%n]);
		}
	};
	systemDict["rotate"] = function() {
		var firstOp = opStack.pop();
		if (typeof firstOp == "object") {
			var secondOp = opStack.pop(); // todo: would it be necessary to resue the given object?
			run("[",Math.cos(degToRad(secondOp)),Math.sin(degToRad(secondOp)),Math.sin(degToRad(secondOp))*-1,Math.cos(degToRad(secondOp)),"0","0","]");
		} else {
			var rotM = new Matrix(Math.cos(degToRad(firstOp)),Math.sin(degToRad(firstOp)),0,Math.sin(degToRad(firstOp))*-1,Math.cos(degToRad(firstOp)),0,0,0,1);
			CTMupdate(rotM);
			ctx.rotate(-degToRad(firstOp));
		}
	};
	systemDict["round"] = function() {
		var num = opStack.pop();
		opStack.push(Math.round(num).toString());
	};
	systemDict["save"] = function() {
		//todo
		opStack.push(new Array());
	};
	systemDict["scale"] = function() {
		var firstOp = opStack.pop();
		var secondOp = opStack.pop();
		if (typeof firstOp == "object") {
			var thirdOp = opStack.pop();
			run("[",thirdOp.toString(),"0","0",secondOp.toString(),"0","0","]");
		} else {
			var scaleM = new Matrix(parseFloat(secondOp),0,0, 0,parseFloat(firstOp),0, 0,0,1);	
			CTMupdate(scaleM);
			ctx.scale(secondOp,firstOp);
		}
	};
	systemDict["setdash"] = function() {
		//todo: dashed lines are not supported by HTML5 Canavs
		opStack.pop();
		opStack.pop();
	};
	systemDict["setflat"] = function() {
		// todo: flatness is not supported by HTML5 Canvas
		opStack.pop();
	};
	systemDict["setgray"] = function() {
		// todo: implement saturation and better rounding
		var b = opStack.pop()*255;
		b = b.toString(16).slice(0,2);
		var colorcode="#";
		colorcode += (b.length<2) ? "0"+b : b;
		colorcode += (b.length<2) ? "0"+b : b;
		colorcode += (b.length<2) ? "0"+b : b;
		ctx.strokeStyle=colorcode;
		ctx.fillStyle=colorcode;
	};
	systemDict["setlinecap"] = function() {
		var lineCap = opStack.pop();
		if (lineCap=="2") {
			lineCap="square";
		} else if (lineCap=="1") {
			lineCap="round"
		} else {
			lineCap="butt"
		}
		ctx.lineCap=lineCap;
	};
	systemDict["setlinejoin"] = function() {
		var linejoin = opStack.pop();
		if (linejoin=="2") {
			linejoin="bevel";
		} else if (linejoin=="1") {
			linejoin="round"
		} else {
			linejoin="miter"
		}
		ctx.lineJoin=linejoin;
	};
	systemDict["setlinewidth"] = function() {
		ctx.lineWidth=opStack.pop();
	};
	systemDict["setmiterlimit"] = function() {
		ctx.miterLimit=opStack.pop();
	};
	systemDict["setrgbcolor"] = function() {
		// todo: implement saturation and better rounding
		var b = opStack.pop()*255;
		var g = opStack.pop()*255;
		var r = opStack.pop()*255;
		b = b.toString(16).slice(0,2);
		g = g.toString(16).slice(0,2);
		r = r.toString(16).slice(0,2);
		var colorcode="#";
		colorcode += (r.length<2) ? "0"+r : r;
		colorcode += (g.length<2) ? "0"+g : g;
		colorcode += (b.length<2) ? "0"+b : b;
		ctx.strokeStyle=colorcode;
		ctx.fillStyle=colorcode;
	};
	systemDict["showpage"] = function() {
		//todo
	};
	systemDict["stack"] = function() {
		alert(opStack);
	};
	systemDict["stroke"] = function() {
		// todo: investigate discrepancies between postscript and canvas
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(currentX,-currentY);
	};
	systemDict["sub"] = function() {
		a = parseFloat(opStack.pop());
		b = parseFloat(opStack.pop());
		opStack.push(b-a);
	};
	systemDict["transform"] = function() {
		var firstOp = opStack.pop();
		var secondOp = opStack.pop();
		if (typeof firstOp == "object") {
			var thirdOp = opStack.pop();
			opStack.push(xUnderMatrix(thirdOp,secondOp,firstOp));
			opStack.push(yUnderMatrix(thirdOp,secondOp,firstOp));
		} else {
			// todo: apply to canvas
			opStack.push(xUnderMatrix(secondOp,firstOp,CTM));
			opStack.push(yUnderMatrix(secondOp,firstOp,CTM));
		}
	};
	systemDict["translate"] = function() {
		var firstOp = opStack.pop();
		var secondOp = opStack.pop();
		if (typeof firstOp == "object") {
			var thirdOp = opStack.pop();
			run("[","1","0","0","1",thirdOp.toString(),secondOp.toString(),"]");
		} else {
			var translM = new Matrix(1,0,0, 0,1,0, parseFloat(secondOp),parseFloat(firstOp),1);
			CTMupdate(translM);
			ctx.translate(secondOp,-firstOp);
		}
	};
	systemDict["where"] = function() {
		key = opStack.pop();
		if (inDictStack(key)) {
			opStack.push(whichDictStack(key));
			opStack.push(true);
		} else {
			opStack.push(false);
		}
	};
	dictStack.push(systemDict);
	dictStack.push(userDict);

	var bufferedInput = "";
	var canvasElement = target;
	var ctx = canvasElement.getContext('2d');
	ctx.translate(0,canvasElement.height); // todo: handle change of canvasElement dimensions
	var src = source;
	if (src) this.update(src);
	
	
	// private methods
	function run(words) {
		
		var executionSuspended = 0;
		var startSuspension = 0;
		
		for (var i=0; i<words.length; i++) {
			var word = words[i];
						
			// first check for suspension of immdiate execution
			switch(word[0]) {
				case "{":
					if (executionSuspended==0) {
						startSuspension = (i*1)+1;
					}
					executionSuspended++;
					continue;
				case "}":
					if (executionSuspended>0) {
						executionSuspended--;
						if (executionSuspended==0) {
							opStack.push(words.slice(startSuspension,i));
						}
						continue;
					}
					return "} before {";
			}
			if (executionSuspended>0) continue;
		
			// numbers
			// todo: recognize special radix notation
			if (!isNaN(word)) {
				// unfortunately empty objects do pass as numbers
				// e.g. "1 2 6 { } for"
				// should these get catched at the start of run()?
				if (typeof word != "object") {
					opStack.push(word);
					continue;
				}
			}
			
			// literals
			switch(word[0]) {
				case "(":
				case "<":
					opStack.push(word.slice(1,-1));
					//opStack.push(word);
					continue;
				case "/":
					opStack.push(word.slice(1));
					continue;
			}
			
			// native and def'd function calls
			var foo = inDictStack(word);
			switch (typeof foo) {
				case "undefined":
					return "command not found: "+word;
				case "function":
					foo();
					break;
				default:
					// todo: is it safe to handle strings, numbers and arrays in this way?
					if (foo.length && isNaN(foo) && (typeof foo != "string")) {
						var res = run(foo);
						if (res!="OK") {
							return "runerror: "+foo+" = "+res;
						}
					} else {
						opStack.push(foo);
					}
			}
		}
		return "OK"
	}
	
	function scan(input) {
		// split: strings (...), hexdata <...>, comments %...\n\f, selfdelimiters []{}, words
		var tokens = input.match(/\([^\)]*\)|\<[^\>]*\>|%[^\n\f]*[\n\f]|[\[\]\{\}]|[^\s\}\{\[\]]+/g);
		
		// todo: recognize special \( and \) sequences in strings
		// todo: throw exception for incomplete/unbalanced composites ()<>{}
		for (var i = 0; i < tokens.length; i++) {
			if (tokens[i][0]=="%") {
				tokens.splice(i,1);
				i--;
			}
		}
		return tokens;
	}

	function bind(words) {
		var result = new Array();
		for (var i in words) {
			var word = words[i]
			var foo = inDictStack(word);
			if (typeof foo == "object") {
				word = bind(foo);
			}
			result = result.concat(word);
		}
		return result;
	}
	
	function whichDictStack(key) {
		for (var j=dictStack.length-1;j>=0;--j) {
			if (typeof dictStack[j][key] != "undefined") {
				return dictStack[j];
			}
		}
	}
	
	function inDictStack(key) {
		for (var j=dictStack.length-1;j>=0;--j) {
			if (typeof dictStack[j][key] != "undefined") {
				return dictStack[j][key];
			}
		}
	}
	
	function degToRad(degree) {
		return (Math.PI/180)*degree;
	}
	
	function xUnderMatrix(x,y,mat) {
		return mat.e[0][0]*x + mat.e[1][0]*y + mat.e[2][0];
		//return mat[0]*x + mat[2]*y + mat[4];
	}
	
	function yUnderMatrix(x,y,mat) {
		return mat.e[0][1]*x + mat.e[1][1]*y + mat.e[2][1];
		//return mat[1]*x + mat[3]*y + mat[5];
	}
	
	function CTMupdate(mat) {
		currentX = xUnderMatrix(currentX,currentY,mat);
		currentY = yUnderMatrix(currentX,currentY,mat);
		CTMdelta = CTMdelta.timesMatrix(mat);
		CTM = CTM.timesMatrix(mat);
	}

}

if(typeof module === 'object'){
	module.exports = PostCanvas;
}