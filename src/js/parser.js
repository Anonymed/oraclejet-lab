define([], function(){
	function Parser(str){

		function init(str){ // parse input string to matrix
			if(typeof str != "string") throw "Invalide input data (should be a string)";
			str = str.trim();
			var instring = false, data = [], row = [];
			for(var i = 0, j = 0 ; i < str.length ; i++){
				var c = str[i];
				if(c == '\\'){
					if(instring){
						i++;
						continue;
					}
					if(str[i+1] == 'n'){
						row.push(str.substring(j, i));
						data.push(row);
						row = [];
					}else if(str[i+1] == 't'){
						row.push(str.substring(j, i));
					}
					j = ++i;
					j++;
				}else if(c == '\'') instring = !instring;
			}
			row.push(str.substring(j, i));
			data.push(row);
			return data;
		}

		function rotate(data){ // rotate a matrix
			var rdata = [];
			for(var i = 0 ; i < data[0].length ; i++) rdata.push(data.map(r=>r[i]));
			return rdata;
		}

		function convert(data){ //  convert non-string elements to float
			for(var i = 0; i < data.length ; i++){
				data[i].forEach((a, j, t)=>{
					if(a[0] != '\'' && a[a.length - 1] != '\'') t[j] = parseFloat(t[j]) || 0;
					else t[j] = t[j].replace(/^'/,'').replace(/'$/,'');
				});
			}
			return data;
		}

		function groups(data){ // identify group on string columns
			var grps = [];
			for(var i = 0; i < data.length ; i++){
				if(data[i].some((a)=>{return typeof a == "string" && a.length >= 2;})){ // string and not empty
					var grp = [];
					for(var j = 0; j < data[i].length ; j++) {
						if(data[i][j].length > 2 && data[i].indexOf(data[i][j], j + 1) != -1 && grp.indexOf(data[i][j]) == -1) {
							grp.push(data[i][j]);
						}
					}
					if(grp.length > 0) grps.push([i].concat(grp));
				}
			}
			return grps;
		}

		var _data = convert(init(str));
		var _data_r = rotate(_data);
		var _groups = groups(_data_r);

		this.console = function(){
			_data.map(a=>console.log("| "+ a.join(' | ') + " |"));
//			console.log(_data);
		}
		this.getdata = function(){
			return _data.map(a=>a.map(b=>b));
		}
		this.getgroups = function(){
			return _groups.map(a=>a.map(b=>b));
		}
		this.toscatter = function(opts){ // {columsIndexes: [....], groupIndex: 0}
			var g = _groups.filter(a=>a[0]==opts.gi)[0]; 
			var s = g.slice(1);
			var series = [];
			for(var i = 0 ; i < s.length ; i++){
				series.push({
					name:s[i], 
					items: _data.filter(a=>a[opts.gi]==s[i]).map((a)=>{
						return {x:a[opts.ci[0]],y:a[opts.ci[1]]};
					})
				});
			}
//			console.log(series);
			return {'series':series, groups:[]};
		}
		this.toboxplot = function(opts){
			var g = _groups.filter(a=>a[0]==opts.gi)[0]; 
			var s = g.slice(1); 
			var series = [];
			for(var i = 0 ; i < s.length ; i++){
				series.push({
					name:s[i], 
					items: opts.ci.map((ci)=>{
						var vec = _data.filter(a=>a[opts.gi]==s[i]).map(a=>a[ci]);
						vec = vec.sort((a,b)=>a-b);
						var inc = parseInt(vec.length / 4);
						return {low: vec[0], q1: vec[inc], q2: vec[inc*2], q3: vec[inc*3], high: vec[vec.length - 1]}; 
					})
				});
			}
			return {'series':series, groups:[]};
		}
	}

	return Parser;
});