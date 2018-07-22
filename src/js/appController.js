/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your application specific code will go here
 */
define(['ojs/ojcore', 'knockout', 'parser', 'charts', 'ojs/ojknockout', 
	'ojs/ojdatagrid', 'ojs/ojarraydatagriddatasource', 'ojs/ojmessages', 
	'ojs/ojmessage', 'ojs/ojinputtext', 'ojs/ojchart', 
	'ojs/ojbutton', 'ojs/ojtoolbar', 'ojs/ojmenu'],
		function(oj, ko, parser, charts) {

	function ControllerViewModel() {
		this.defaults = {
				groupIndex:2,
				groups:[4,7],
				gridselection:[
					{startIndex:{row: 0, column: 4},endIndex:{row: -1, column: 4}},
					{startIndex:{row: 0, column: 7},endIndex:{row: -1, column: 7}}
					],
				boxplot: 'vertical',
				griddata:[]
		};
		this.message = ko.observable();
		this.scatterchart = new charts.scatter();
		this.boxplotchart = new charts.boxplot(this.defaults.boxplot);
		this.inputstring = '';
		this.datasource = new oj.ArrayDataGridDataSource(this.defaults.griddata);
		this.groups = ko.observableArray();
		this.group = ko.observable(this.defaults.groupIndex);
		this.gridselection = ko.observableArray(this.defaults.gridselection);
		this.visualize = (()=>{
			var p = new parser(this.inputstring);
			var g = p.getgroups().map((a)=>{return {id:a[0], label:a[1]}; });
			this.groups(g);
			groupSet.refresh();
			datagrid.data = new oj.ArrayDataGridDataSource(p.getdata());
			datagrid.selection = this.defaults.gridselection;
			var params = {ci:this.defaults.groups, gi:this.defaults.groupIndex};
			var sdata = p.toscatter(params);
			this.scatterchart.update(sdata.series, sdata.groups);
			var bdata = p.toboxplot(params);
			this.boxplotchart.update(bdata.series, bdata.groups);
		});
		this.group.subscribe((a)=>{
			this.defaults.groupIndex = a;
			this.visualize();
		});
		this.refresh = (()=>{
			var sel = datagrid.selection;
			if(sel.length != 2){
				this.message({"severity": "error", "summary": "123", "detail": "hello 123"});
				return;
			}
			this.defaults.groups = sel.map(a=>a.endIndex.column);
			this.defaults.gridselection = sel;
			this.visualize();
		});
	}

	return new ControllerViewModel();
}
);
