import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import Feature from 'ol/Feature';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import Polygon from 'ol/geom/Polygon';
import Map from 'ol/Map';
import {register} from 'ol/proj/proj4';
import {Stroke, Style, Fill} from 'ol/style.js';
import {Modify, Draw, Snap} from 'ol/interaction';
import proj4 from 'proj4';
import GeoJSON from 'ol/format/GeoJSON';
import {defaults as defaultControls, FullScreen} from 'ol/control.js';
import MousePosition from 'ol/control/MousePosition.js';
import {createStringXY} from 'ol/coordinate.js';
import {CuiControlComponent} from '@shared/cui-controls/cui-control/cui-control.component';
import {CoordinateReferenceSystem} from '@shared/cui-controls/cui-control/ol/line/cui-ol-line-control.component';
import {CuiModelHelper} from '@shared/cui-controls/services/cui/cui.helper';

const LINE_COLOR = 'black';
const POLYGON = 'Polygon';

@Component({
  selector: 'cui-ol-rectangle-select',
  templateUrl: './cui-ol-rectangle-select.component.html',
  styleUrls: ['../../../../css/full-screen-map.css'],
})
export class CuiOlRectangleSelectComponent extends CuiControlComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('mapElement') mapElement: ElementRef;

  @Input() public coordinatesOfRectangle: any;

  @Input() public CRS: CoordinateReferenceSystem;
  @Input() public viewCenter: [number, number];

  @Output() public coordinatesOfRectangleChanged = new EventEmitter<any>();
  @Output() public hideModal = new EventEmitter<boolean>();

  public rectangleFeatureCoordinates;

  public map: Map;

  public mousePositionControl: MousePosition;

  private baseLayer = new TileLayer({
    source: new OSM()
  });

  private source = new VectorSource();

  private rectangleLayer;

  private drawInteraction = new Draw({
    source: this.source,
    type: POLYGON,
    maxPoints: 3,
    minPoints: 3,
    geometryFunction: function(coordinates, opt_geometry) {
      const geometry = opt_geometry || new Polygon([[[Infinity, Infinity]]]);
      if (coordinates === undefined || coordinates[0].length <= 2) {
        if (this.rectangleLayer.getSource().getFeatures().length > 0) {
          this.drawInteraction.setActive(false);
        }

        return geometry
      }

      const thirdPoint = this.getThirdPoint(coordinates[0]);
      geometry.setCoordinates([[
        this.getFirstPoint(coordinates[0]),
        this.getSecondPoint(coordinates[0]),
        thirdPoint,
        this.getFourthPoint(coordinates[0], thirdPoint),
        this.getFirstPoint(coordinates[0])
      ]]);

      return geometry;
    }.bind(this)
  });

  public getFirstPoint(coordinates) {
    return coordinates[0]
  }

  public getSecondPoint(coordinates) {
    return coordinates[1]
  }

  public getThirdPoint(coordinates) {
    const absDiffX = Math.abs(coordinates[1][0] - coordinates[0][0]);
    const absDiffY = Math.abs(coordinates[1][1] - coordinates[0][1]);

    const diffXBetweenP1AndP0 = coordinates[1][0] - coordinates[0][0];
    const diffYBetweenP1AndP0 = coordinates[1][1] - coordinates[0][1];

    const distanceBetweenP1AndP0 = Math.pow(
      Math.pow(diffXBetweenP1AndP0, 2)
      + Math.pow(diffYBetweenP1AndP0, 2),
      0.5
    );

    const k = (coordinates[0][1] - coordinates[1][1]) / (coordinates[0][0] - coordinates[1][0]);
    const b = (coordinates[1][1] - k * coordinates[1][0]);

    const coefficientForNewX = absDiffY / (distanceBetweenP1AndP0);
    const coefficientForNewY = absDiffX / (distanceBetweenP1AndP0);

    const diffXBetweenP2AndP1 = coordinates[2][0] - coordinates[1][0];
    const diffYBetweenP2AndP1 = coordinates[2][1] - coordinates[1][1];

    const distanceBetweenP2AndP1 = Math.pow(
      Math.pow(diffXBetweenP2AndP1, 2)
      + Math.pow(diffYBetweenP2AndP1, 2),
      0.5
    );

    const targetY = k * coordinates[2][0] + b;
    const isPointAboveLine = targetY < coordinates[2][1];

    let x2 = 0;
    let y2 = 0;

    if (diffXBetweenP1AndP0 > 0 && diffYBetweenP1AndP0 > 0) {
      if (isPointAboveLine) {
        x2 = coordinates[1][0] - distanceBetweenP2AndP1 * coefficientForNewX;
        y2 = coordinates[1][1] + distanceBetweenP2AndP1 * coefficientForNewY;
      } else {
        x2 = coordinates[1][0] + distanceBetweenP2AndP1 * coefficientForNewX;
        y2 = coordinates[1][1] - distanceBetweenP2AndP1 * coefficientForNewY;
      }
    } else if (diffXBetweenP1AndP0 > 0 && diffYBetweenP1AndP0 < 0) {
      if (isPointAboveLine) {
        x2 = coordinates[1][0] + distanceBetweenP2AndP1 * coefficientForNewX;
        y2 = coordinates[1][1] + distanceBetweenP2AndP1 * coefficientForNewY;
      } else {
        x2 = coordinates[1][0] - distanceBetweenP2AndP1 * coefficientForNewX;
        y2 = coordinates[1][1] - distanceBetweenP2AndP1 * coefficientForNewY;
      }
    } else if (diffXBetweenP1AndP0 < 0 && diffYBetweenP1AndP0 < 0) {
      if (isPointAboveLine) {
        x2 = coordinates[1][0] - distanceBetweenP2AndP1 * coefficientForNewX;
        y2 = coordinates[1][1] + distanceBetweenP2AndP1 * coefficientForNewY;
      } else {
        x2 = coordinates[1][0] + distanceBetweenP2AndP1 * coefficientForNewX;
        y2 = coordinates[1][1] - distanceBetweenP2AndP1 * coefficientForNewY;
      }
    } else if (diffXBetweenP1AndP0 < 0 && diffYBetweenP1AndP0 > 0) {
      if (isPointAboveLine) {
        x2 = coordinates[1][0] + distanceBetweenP2AndP1 * coefficientForNewX;
        y2 = coordinates[1][1] + distanceBetweenP2AndP1 * coefficientForNewY;
      } else {
        x2 = coordinates[1][0] - distanceBetweenP2AndP1 * coefficientForNewX;
        y2 = coordinates[1][1] - distanceBetweenP2AndP1 * coefficientForNewY;
      }
    }

    return [x2 , y2];
  }

  public getFourthPoint(coordinates, thirdPoint) {
    return [
      thirdPoint[0] - (coordinates[1][0] - coordinates[0][0]),
      thirdPoint[1] - (coordinates[1][1] - coordinates[0][1])
    ];
  }

  constructor(public cuiModelHelper: CuiModelHelper) {
    super(cuiModelHelper);
  }

  ngOnInit(): void {
    proj4.defs(this.CRS.code, this.CRS.proj4);
    register(proj4);

    this.mousePositionControl = new MousePosition({
      coordinateFormat: createStringXY(4),
      projection: this.CRS.code,
      target: document.getElementById('mouse-coordinates'),
      className: 'custom-mouse-position',
    });

    this.rectangleLayer = new VectorLayer({
      source: this.source,
      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        }),
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
      layers: [this.baseLayer, this.rectangleLayer],
      view: new View({
        zoom: 12,
        center: this.viewCenter ? this.viewCenter : [0, 0],
        projection: this.CRS.code
      })
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (Object.entries(this.coordinatesOfRectangle).length !== 0) {
      this.rectangleFeatureCoordinates = this.TransformFromTwoPointAndWidthCoordinates(this.coordinatesOfRectangle);
    }
  }

  ngAfterViewInit() {
    this.map.setTarget(this.mapElement.nativeElement.id);
    this.AddInteractions();
    if (this.rectangleFeatureCoordinates) {
      const rectangle = new Feature({
        geometry: new Polygon(
          [this.rectangleFeatureCoordinates]
        )
      });

      this.rectangleLayer.getSource().addFeature(rectangle);
    }
  }

  AddInteractions() {
    this.map.addInteraction(this.drawInteraction);
  }

  ChangeValueOfCoordinatesInModel() {
    if (this.rectangleLayer.getSource().getFeatures()) {
      this.coordinatesOfRectangleChanged.emit(this.TransformToTwoPointAndWidthCoordinates(
        this.rectangleLayer.getSource().getFeatures()[0].getGeometry().getCoordinates()[0])
      );
    }
  }

  ClearData() {
    this.rectangleLayer.getSource().clear();
    this.rectangleFeatureCoordinates = [];
    this.drawInteraction.setActive(true);
  }

  HideModal() {
    this.hideModal.emit(true);
  }

  TransformToTwoPointAndWidthCoordinates(coordinates: any) {
    const OLCoordinates = coordinates;

    const x1 = (OLCoordinates[0][0] + OLCoordinates[3][0]) / 2;
    const y1 = (OLCoordinates[0][1] + OLCoordinates[3][1]) / 2;
    const x2 = (OLCoordinates[1][0] + OLCoordinates[2][0]) / 2;
    const y2 = (OLCoordinates[1][1] + OLCoordinates[2][1]) / 2;
    const width =
      Math.sqrt(Math.pow(OLCoordinates[0][0] - OLCoordinates[3][0], 2) + Math.pow(OLCoordinates[0][1] - OLCoordinates[3][1], 2)) / 2;

    return {
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2,
      width: width
    };
  }

  TransformFromTwoPointAndWidthCoordinates(data) {
    const x1 = data.x1;
    const y1 = data.y1;
    const x2 = data.x2;
    const y2 = data.y2;
    const width = data.width;
    const r = width;

    const R = Math.pow(
      Math.pow(x2 - x1, 2)
      + Math.pow(y2 - y1, 2),
      0.5
    );
    let cos = x2 - x1;
    let sin = y2 - y1;
    if ((sin > 0 && cos > 0) || (sin < 0 && cos < 0)) {
      cos = Math.abs(cos) / R;
    } else {
      cos = -Math.abs(cos) / R;
    }

    const P1 = [0, 0];
    const P2 = [0, 0];
    const P3 = [0, 0];
    const P4 = [0, 0];

    sin = Math.abs(sin) / R;
    P1[0] = x1 - r * sin;
    P1[1] = y1 + r * cos;
    P2[0]  = x2 - r * sin;
    P2[1]  = y2 + r * cos;
    P3[0]  = x2 + r * sin;
    P3[1]  = y2 - r * cos;
    P4[0]  = x1 + r * sin;
    P4[1]  = y1 - r * cos;

    return [P1, P2, P3, P4, P1];
  }
}
