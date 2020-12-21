import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import Feature from 'ol/Feature';
import Select from 'ol/interaction/Select.js';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import Polygon from 'ol/geom/Polygon';
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
const POLYGON = 'Polygon';

@Component({
  selector: 'cui-ol-polygon-select',
  templateUrl: './cui-ol-polygon-select.component.html',
  styleUrls: ['../../../../css/full-screen-map.css'],
})
export class CuiOlPolygonSelectComponent implements OnInit, AfterViewInit {
  @ViewChild('mapElement') mapElement: ElementRef;

  @Input() public coordinatesOfPolygon: Coordinate[];

  @Input() public CRS: CoordinateReferenceSystem;

  @Output() public coordinatesOfPolygonChanged = new EventEmitter<Coordinate[]>();
  @Output() public hideModal = new EventEmitter<boolean>();

  public map: Map;

  public mousePositionControl: MousePosition;

  private baseLayer = new TileLayer({
    source: new OSM()
  });

  private source = new VectorSource();

  private polygonLayer;

  private modifyInteraction = new Modify({source: this.source});

  private drawInteraction = new Draw({
    source: this.source,
    type: POLYGON
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

    this.polygonLayer = new VectorLayer({
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
      controls: defaultControls({
        attributionOptions: {
          collapsible: false
        }
      }).extend([
        new FullScreen(),
        this.mousePositionControl
      ]),
      layers: [this.baseLayer, this.polygonLayer],
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
    if (this.coordinatesOfPolygon) {
      this.polygonLayer.getSource().addFeature(
        new Feature({
          geometry: new Polygon(
            this.coordinatesOfPolygon
          )
        })
      );
    }
  }

  AddInteractions() {
    this.map.addInteraction(this.drawInteraction);
    this.map.addInteraction(this.modifyInteraction);
    this.AddClickInteraction();
    if (this.coordinatesOfPolygon) {
      this.drawInteraction.setActive(false);
    }
  }

  AddClickInteraction() {
    const select = new Select({
      condition: click
    });

    select.on('select', function () {
      if (this.polygonLayer.getSource().getFeatures().length > 0) {
        this.drawInteraction.setActive(false);
      }
    }.bind(this));

    this.map.addInteraction(select);
  }

  ChangeValueOfCoordinatesInModel() {
    if (this.polygonLayer.getSource().getFeatures()) {
      this.coordinatesOfPolygon = this.polygonLayer.getSource().getFeatures()[0].getGeometry().getCoordinates();
    }
    this.coordinatesOfPolygonChanged.emit(this.coordinatesOfPolygon);
  }

  ClearData() {
    this.polygonLayer.getSource().clear();
    this.coordinatesOfPolygon = null;
    this.drawInteraction.setActive(true);
  }

  HideModal() {
    this.hideModal.emit(true);
  }

}
