import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import Feature from 'ol/Feature';
import Select from 'ol/interaction/Select.js';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import LineString from 'ol/geom/LineString';
import Map from 'ol/Map';
import {register} from 'ol/proj/proj4';
import {Stroke, Style} from 'ol/style.js';
import {Modify, Draw, Snap} from 'ol/interaction';
import {click} from 'ol/events/condition.js';
import proj4 from 'proj4';
import GeoJSON from 'ol/format/GeoJSON';
import {defaults as defaultControls, FullScreen} from 'ol/control.js';
import MousePosition from 'ol/control/MousePosition.js';
import {createStringXY} from 'ol/coordinate.js';
import {Coordinate} from '@shared/cui-controls/cui-data';
import {CoordinateReferenceSystem} from '@shared/cui-controls/cui-control/ol/line/cui-ol-line-control.component';

const LINE_COLOR = 'black';
const LINE_STRING = 'LineString';

@Component({
  selector: 'cui-ol-line-select',
  templateUrl: './cui-ol-line-select.component.html',
  styleUrls: ['../../../../css/full-screen-map.css'],
})
export class CuiOlLineSelectComponent implements OnInit, AfterViewInit {
  @ViewChild('mapElement') mapElement: ElementRef;

  @Input() public coordinatesOfLine: Coordinate[];

  @Input() public CRS: CoordinateReferenceSystem;

  @Output() public coordinatesOfLineChanged = new EventEmitter<Coordinate[]>();
  @Output() public hideModal = new EventEmitter<boolean>();

  public map: Map;

  public mousePositionControl: MousePosition;

  private baseLayer = new TileLayer({
    source: new OSM()
  });

  private source = new VectorSource();

  private lineStringLayer;

  private modifyInteraction = new Modify({source: this.source});

  private drawInteraction = new Draw({
    source: this.source,
    type: LINE_STRING
  });

  ngOnInit(): void {
    proj4.defs(this.CRS.code, this.CRS.proj4);
    register(proj4);

    this.mousePositionControl = new MousePosition({
      coordinateFormat: createStringXY(4),
      projection: this.CRS.code,
      target: document.getElementById('mouse-coordinates'),
      className: 'custom-mouse-position',
    });

    this.lineStringLayer = new VectorLayer({
      source: this.source,
      style: new Style({
        stroke: new Stroke({
          color: LINE_COLOR,
          width: 2
        }),
      }),
      format: new GeoJSON({
        defaultDataProjection: this.CRS.code,
        featureProjection: this.CRS.code
      })
    });

    this.map = new Map({
      target: 'map',
      controls: defaultControls({
        attributionOptions: {
          collapsible: false
        }
      }).extend([
        new FullScreen(),
        this.mousePositionControl
      ]),
      layers: [this.baseLayer, this.lineStringLayer],
      view: new View({
        zoom: 6,
        center: [0, 0],
        projection: this.CRS.code
      })
    });
  }

  ngAfterViewInit() {
    this.map.setTarget(this.mapElement.nativeElement.id);
    this.AddInteractions();
    if (this.coordinatesOfLine) {
      this.lineStringLayer.getSource().addFeature(
        new Feature({
          geometry: new LineString(
            this.coordinatesOfLine
          )
        })
      );
    }
  }

  AddInteractions() {
    this.map.addInteraction(this.drawInteraction);
    this.map.addInteraction(this.modifyInteraction);
    this.AddClickInteraction();
    if (this.coordinatesOfLine) {
      this.drawInteraction.setActive(false);
    }
  }

  AddClickInteraction() {
    const select = new Select({
      condition: click
    });

    select.on('select', function () {
      const readyLine = this.lineStringLayer.getSource().getFeatures()[0];
      if (readyLine) {
        this.drawInteraction.setActive(false);
      }
    }.bind(this));

    this.map.addInteraction(select);
  }

  ChangeValueOfCoordinatesInModel() {
    if (this.lineStringLayer.getSource().getFeatures()[0]) {
      this.coordinatesOfLine = this.lineStringLayer.getSource().getFeatures()[0].getGeometry().getCoordinates();
    }
    this.coordinatesOfLineChanged.emit(this.coordinatesOfLine);
  }

  ClearData() {
    this.lineStringLayer.getSource().removeFeature(this.lineStringLayer.getSource().getFeatures()[0]);
    this.coordinatesOfLine = null;
    this.drawInteraction.setActive(true);
  }

  HideModal() {
    this.hideModal.emit(true);
  }

}
