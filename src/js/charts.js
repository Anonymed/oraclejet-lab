define(['knockout'], function(ko){
	function ScatterChartModel() {
		this.scatterSeriesValue = ko.observableArray([]);
		this.scatterGroupsValue = ko.observableArray([]);

		this.update = function(s, g){
			this.scatterSeriesValue(s);
			this.scatterGroupsValue(g);
		}
	}

	function BoxplotChartModel(orientation) {

		if(!orientation) orientation = 'vertical';

		this.boxPlotSeriesValue = ko.observableArray([]);
		this.boxPlotGroupsValue = ko.observableArray([]);

		/* toggle buttons */
		this.orientationValue = ko.observable(orientation);

		this.update = function(s, g){
			this.boxPlotSeriesValue(s);
			this.boxPlotGroupsValue(g);
		}
	}

	return {scatter: ScatterChartModel, boxplot: BoxplotChartModel};
});