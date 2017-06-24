/**
 * This component is an adaptation of the "Days Timeline" Example provided by
 * Denise Mauldin at https://denisemauldin.github.io/d3-timeline/examples/days.html
 */

import { Component, ElementRef, NgZone, OnDestroy, OnInit } from '@angular/core';
import * as Timeline from 'd3-timelines';

import {
  D3Service,
  D3,
  Axis,
  BrushBehavior,
  BrushSelection,
  D3BrushEvent,
  ScaleLinear,
  ScaleOrdinal,
  Selection,
  Transition
} from 'd3-ng2-service';


@Component({
  selector: 'app-timeline',
  template: '<svg width="960" height="600"></svg>',
  styles: [`
    .axis text {
	  display: none;
    }
    .textlabels {
      font-size: 12pt;
      font-family: Helvetica;
    }
    .textnumbers {
      font-size: 18pt;
      font-family: Helvetica;
    }
 `]
})
export class TimelineComponent implements OnInit, OnDestroy {
  //original
  private d3: D3;
  private parentNativeElement: any;
  private d3Svg: Selection<SVGSVGElement, any, null, undefined>;
  //timeline
  private host;        // D3 object referencing host dom object
  private svg;         // SVG in which we will print our chart
  private margin;      // Space between the svg borders and the actual chart graphic
  private width;       // Component width
  private height;      // Component height
  private xScale;      // D3 scale in X
  private yScale;      // D3 scale in Y
  private xAxis;       // D3 X Axis
  private yAxis;       // D3 Y Axis
  private colorScale;
  private htmlElement: HTMLElement; // Host HTMLElement

  constructor(element: ElementRef, private ngZone: NgZone, d3Service: D3Service) {
    // original
    this.d3 = d3Service.getD3();
    this.parentNativeElement = element.nativeElement;
    // timeline
    this.htmlElement = element.nativeElement;
    this.host = this.d3.select(this.htmlElement);
  }

  ngOnDestroy() {
    if (this.d3Svg.empty && !this.d3Svg.empty()) {
      this.d3Svg.selectAll('*').remove();
    }
  }

  ngOnInit() {
    this.setup();
    this.buildSVG();
    this.draw();
  }

  setup() {
    this.margin = { top: 20, right: 20, bottom: 40, left: 40 };
    this.width = this.htmlElement.firstElementChild.clientWidth - this.margin.left - this.margin.right;
    console.log("this.htmlElement", this.htmlElement);
    console.log("this child element", this.htmlElement.firstElementChild);
    console.log("this.htmlElement.clientWidth", this.htmlElement.clientWidth);
    console.log("width is ", this.width);
    this.height = this.width * 0.5 - this.margin.top - this.margin.bottom;
  } 

   /* Will build the SVG Element */
  private buildSVG(): void {
    this.host.html('');
    this.svg = this.host.append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }
  
  private draw(): void {
    let d3 = this.d3;
  	let timepoints = [];
    function timelineHover(svg) {
    	let width = 500;
        let colorScale = d3.scaleOrdinal().range(['#ffffff']);
        let data = [
          {times:[
          	{"id": "day1", "label": "DAY", "labelNumber": "1", "starting_time": 1, "ending_time": 86400},
            {"id": "day2", "label": "DAY", "labelNumber": "2", "starting_time": 86400, "ending_time": 86400*2},
            {"id": "day3", "label": "DAY", "labelNumber": "3", "starting_time": 86400*2, "ending_time": 86400*3},
            {"id": "day4", "label": "DAY", "labelNumber": "4", "starting_time": 86400*3, "ending_time": 86400*4},
            {"id": "day5", "label": "DAY", "labelNumber": "5", "starting_time": 86400*4, "ending_time": 86400*5}
          ]},
        ];

		var chart = Timeline.timeline()
			.linearTime()
			.itemHeight(60)
			.labelFloat(25) // move DAY up 25 pixels
			.itemMargin(0)
			.colors(colorScale)
			.showBorderLine()
			.showBorderFormat({marginTop: 30, marginBottom: 0, width: 3, color: 'black'})
			.margin({left:10, right:30, top:30, bottom:0})
			.click(function (d, i, datum, labelElement, rectElement, duration) {
				var ele = d3.select(rectElement);
				var labelEle = d3.select(labelElement);
				rectElement.duration = duration;
				if (timepoints.includes(rectElement)) {
					ele.style("fill", "#ffffff");
					labelEle.style("fill", "#000000");
					var index = timepoints.indexOf(rectElement);
					timepoints.splice(index, 1);
				} else {
					timepoints.push(rectElement);
					labelEle.style("fill", "#ffffff");
					ele.style("fill", "#e2ae79");
				}
			})
			.rotateTicks(45);
			
			svg.attr("width", width).datum(data).call(chart);
		} // end timelineHover    
		timelineHover(this.svg);
  } // end draw

  example() {
    let self = this;
    let d3 = this.d3;
    let d3ParentElement: Selection<HTMLElement, any, null, undefined>;
    let d3Svg: Selection<SVGSVGElement, any, null, undefined>;
    let d3G: Selection<SVGGElement, any, null, undefined>;
    let width: number;
    let height: number;
    let random: () => number;
    let sqrt3: number;
    let points0: Array<[number, number, number]>;
    let points1: Array<[number, number, number]>;
    let points2: Array<[number, number, number]>;
    let points: Array<[number, number, number]>;
    let k: number;
    let x0: [number, number];
    let y0: [number, number];
    let x: ScaleLinear<number, number>;
    let y: ScaleLinear<number, number>;
    let z: ScaleOrdinal<number, string>;
    let xAxis: Axis<number>;
    let yAxis: Axis<number>;
    let brush: BrushBehavior<any>;
    let idleTimeout: number | null;
    let idleDelay: number;

    function brushended(this: SVGGElement) {
      let e = <D3BrushEvent<any>>d3.event;
      let s: BrushSelection = e.selection;
      if (!s) {
        if (!idleTimeout) {
          self.ngZone.runOutsideAngular(() => {
            idleTimeout = window.setTimeout(idled, idleDelay);
          });
          return idleTimeout;
        }
        x.domain(x0);
        y.domain(y0);
      } else {
        x.domain([s[0][0], s[1][0]].map(x.invert, x));
        y.domain([s[1][1], s[0][1]].map(y.invert, y));
        d3Svg.select<SVGGElement>('.brush').call(brush.move, null);
      }
      zoom();
    }

    function idled() {
      idleTimeout = null;
    }

    function zoom() {
      let t: Transition<SVGSVGElement, any, null, undefined> = d3Svg.transition().duration(750);
      d3Svg.select<SVGGElement>('.axis--x').transition(t).call(xAxis);
      d3Svg.select<SVGGElement>('.axis--y').transition(t).call(yAxis);
      d3Svg.selectAll<SVGCircleElement, [number, number, number]>('circle').transition(t)
        .attr('cx', function (d) { return x(d[0]); })
        .attr('cy', function (d) { return y(d[1]); });
    }


    if (this.parentNativeElement !== null) {

      d3ParentElement = d3.select(this.parentNativeElement);
      d3Svg = this.d3Svg = d3ParentElement.select<SVGSVGElement>('svg');

      width = +d3Svg.attr('width');
      height = +d3Svg.attr('height');

      d3G = d3Svg.append<SVGGElement>('g');
      random = d3.randomNormal(0, 0.2);
      sqrt3 = Math.sqrt(3);
      points0 = d3.range(300).map(function (): [number, number, number] { return [random() + sqrt3, random() + 1, 0]; });
      points1 = d3.range(300).map(function (): [number, number, number] { return [random() - sqrt3, random() + 1, 1]; });
      points2 = d3.range(300).map(function (): [number, number, number] { return [random(), random() - 1, 2]; });
      points = d3.merge([points0, points1, points2]);


      k = height / width;
      x0 = [-4.5, 4.5];
      y0 = [-4.5 * k, 4.5 * k];
      x = d3.scaleLinear().domain(x0).range([0, width]);
      y = d3.scaleLinear().domain(y0).range([height, 0]);
      z = d3.scaleOrdinal<number, string>(d3.schemeCategory10);

      xAxis = d3.axisTop<number>(x).ticks(12);
      yAxis = d3.axisRight<number>(y).ticks(12 * height / width);

      brush = d3.brush().on('end', brushended);
      idleDelay = 350;

      d3Svg.selectAll<SVGCircleElement, any>('circle')
        .data(points)
        .enter().append<SVGCircleElement>('circle')
        .attr('cx', function (d) { return x(d[0]); })
        .attr('cy', function (d) { return y(d[1]); })
        .attr('r', 2.5)
        .attr('fill', function (d) { return z(d[2]); });

      d3Svg.append<SVGGElement>('g')
        .attr('class', 'axis axis--x')
        .attr('transform', 'translate(0,' + (height - 10) + ')')
        .call(xAxis);

      d3Svg.append<SVGGElement>('g')
        .attr('class', 'axis axis--y')
        .attr('transform', 'translate(10,0)')
        .call(yAxis);

      d3Svg.selectAll('.domain')
        .style('display', 'none');

      d3Svg.append<SVGGElement>('g')
        .attr('class', 'brush')
        .call(brush);

    }

  }

}
