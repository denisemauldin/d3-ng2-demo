import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { D3Service } from 'd3-ng2-service';
import * as Timeline from 'd3-timelines';

import { AppComponent } from './app.component';
import { BrushZoom2Component } from './d3-demos/brush-zoom-2/brush-zoom-2.component';
import { DragZoom2Component } from './d3-demos/drag-zoom-2/drag-zoom-2.component';
import { TimelineComponent} from './d3-demos/timeline/timeline.component';
import { VoronoiSpirals3Component } from './d3-demos/voronoi-spirals-3/voronoi-spirals-3.component';
import { WrapperBrushZoom2Component } from './d3-demos/wrapper-brush-zoom-2/wrapper-brush-zoom-2.component';
import { WrapperTimelineComponent } from './d3-demos/wrapper-timeline/wrapper-timeline.component';
import { WrapperDragZoom2Component } from './d3-demos/wrapper-drag-zoom-2/wrapper-drag-zoom-2.component';
import { WrapperVoronoiSpirals3Component } from './d3-demos/wrapper-voronoi-spirals-3/wrapper-voronoi-spirals-3.component';

@NgModule({
  declarations: [
    AppComponent,
    BrushZoom2Component,
	DragZoom2Component,
	TimelineComponent,
    VoronoiSpirals3Component,
    WrapperBrushZoom2Component,
	WrapperDragZoom2Component,
	WrapperTimelineComponent,
	WrapperVoronoiSpirals3Component
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    D3Service
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
