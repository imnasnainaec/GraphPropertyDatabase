//	Copyright 2016 Danny Rorabaugh
//	For the Graph Property Database

var propID;

function initiate() {
	var querystring = window.location.search;
	var queryarray = querystring.split("=");
	if(queryarray.length<2) {
		propID = Math.floor(Math.random() * props.length); 
	} else {
		propID = Number(queryarray[1]); 
	};
	load(propID);
}

function load(n) {
	propID = n;
	closeModal();
	if(n>=0) {
		var P = props[n];
		
		var code = "&#9734; " + P[0] + "&nbsp;&nbsp;&nbsp;&nbsp;";
		document.getElementById("PROP").innerHTML = code;
		
		document.getElementById("DEF").innerHTML = P[1];
		
		var abrv;
		code = "";
		for(i=0, len=P[2].length; i<len; i++) {
			abrv = P[2][i];
			code += "<a href='javascript:keyModal(\"" + abrv + "\")'>" + keyDict[abrv] + "</a>";
			if((i + 1)<len) { code += ", "; };
		};
		document.getElementById("KEY").innerHTML = code;
		
		var clock = propSort(n);
		var m, imp,
			rel1 = ["&#8658;","&#8658;","&#8658;","&#191;&#8658;?","&#191;&#8658;?","<span class='bigger'>&#8655;</span>","<span class='bigger'>&#8655;</span>"],
			rel2 = ["&#8658;","<span class='bigger'>&#8655;</span>","&#191;&#8658;?","&#191;&#8658;?","&#8658;","&#8658;","<span class='bigger'>&#8655;</span>"],
			clockKey = ["EQUI","NEC1","NEC2","UNK","SUF2","SUF1","NOIMP"];
		for(i=0; i<7; i++) {
			code = "";
			for(j=0, len=clock[i].length; j<len; j++) {
				m = clock[i][j];
				code += "<li><div class='link'><a href='javascript:load(" + m + ")'>" + props[m][0] + "</a><div class='popup'>";
				
				imp = implies[n][m];
				if(i===0) {
					code += "&#9734; &hArr; &#8226; : " + reason[imp[1]] + citationCode(imp[2]);
				} else if(imp[0]<-1) {
					code += "Mutually exclusive: " + reason[imp[1]] + citationCode(imp[2]);
				} else {
					code += "&#9734; " + rel1[i] + " &#8226; : " + reason[imp[1]];
					if(i>4) { code += counterexampleCode(n,m); };
					code += citationCode(imp[2]);
					
					imp = implies[m][n];
					code += "<br>&#8226; " + rel2[i] + " &#9734; : " + reason[imp[1]];
					if( i==1 || i==6 ) { code += counterexampleCode(m,n); };
					code += citationCode(imp[2]);
				};
				
				code += "</div></div></li>";
			};
			document.getElementById(clockKey[i]).innerHTML = code;
		}
	}
}

function propSort(n) {
	var nm, mn, 
		clock = [[],[],[],[],[],[],[]];
	for(m=0, len=props.length; m<len; m++) {
		if(m!==n) {
			nm = implies[n][m];
			mn = implies[m][n];
			if(nm[0]==1) {
				if(mn[0]==1) {
					clock[0].push(m); // EQUI
				} else if(mn[0]<0) {
					clock[1].push(m); // NEC1
				} else {
					clock[2].push(m); // NEC2
				};
			} else if(nm[0]<0) {
				if(mn[0]==1) {
					clock[5].push(m); // SUF1
				} else if(mn[0]<0) {
					clock[6].push(m); // NOIMP
				} else {
					clock[4].push(m); // SUF2
				};
			} else if(nm[1]>0 || mn[1]>0) {
				clock[3].push(m); // UNK
			};
		};
	};
	return clock;
}

function counterexample(n,m) {
	for(var EX in exampDict) {
		if(exampDict[EX][1][n]==1 && exampDict[EX][1][m]==-1) {
			return EX;
		};
	};
	return null;
}
	
function counterexampleCode(n,m) {
	var EX = counterexample(n,m);
	var snippet = "";
	if(EX!=null) {
		var hogID = exampDict[EX][2];
		if(hogID>0) {
			snippet += " counterexample <a href='http://hog.grinvin.org/ViewGraphInfo.action?id=" + hogID + "' target='_blank'>" + EX + "<span class='popup'><br><embed src='http://hog.grinvin.org/GraphImage.action?id=" + hogID + "&size=80' /></span></a>";
		} else {
			snippet += " counterexample " + EX;
		};
	};
	return snippet;
}

function citationCode(refs) {
	var snippet = "";
	if(refs.length>0) {
		snippet += " <span>[" + refs + "]<span class='popup'>";
		var ref;
		for(k=0, len=refs.length; k<len; k++) {
			ref = cite[refs[k]];
			snippet += "<br>" + refs[k] + ": " + ref[0] + ", ";
			if(ref[3]!==null) {
				snippet += "<a href='" + ref[3] + "' target='_blank'>" + ref[1] + "</a>";
			} else {
				snippet += ref[1];
			};
			if(ref[2]!==null) {
				snippet += " (" + ref[2] + ")";
			};
			if(ref[4]!==null) {
				snippet += ", <a href='http://dx.doi.org/" + ref[4] + "' target='_blank'>doi:" + ref[4] + "</a>";
			};
			snippet += ".";
		}; 
		snippet += "</span></span>";
	};
	return snippet;
}

function keyModal(abrv) {
	var code = keyLister(abrv);
	document.getElementById("keyList").innerHTML = code;
	
	document.getElementById("keyHeader").innerHTML = keyDict[abrv];
	
	var items = [];
	for(n=0, len=props.length; n<len; n++) {
		if(props[n][2].indexOf(abrv)>=0) {
			items.push(n);
		};
	};
	code = propLister(items);
	document.getElementById("propList").innerHTML = code;
	
	document.getElementById("keywordModal").style.display = "block";
}

function propLister(items,n) {
	var r, snippet = "";
	for(i=0, len=items.length; i<len; i++) {
		r = items[i];
		if(r==propID) {
			snippet += "<li>" + props[r][0] + "</li>";
		} else {
			snippet += "<li><a href='javascript:load(" + r + ")'>" + props[r][0] + "</a></li>";
		};
	};
	return snippet;
}

function keyLister(abrv) {
	var snippet = "";
	for(var key in keyDict) {
		if(key==abrv) {
			snippet += keyDict[key] + "<br>";
		} else {
			snippet += "<a href='javascript:keyModal(\"" + key + "\")'>" + keyDict[key] + "</a><br>";
		};
	};
	return snippet + "<br>";
}

function closeModal() {
	document.getElementById("keywordModal").style.display = "none";
}