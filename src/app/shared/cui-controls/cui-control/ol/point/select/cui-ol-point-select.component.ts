import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

import Feature from 'ol/Feature';
import GeoJSON from 'ol/format/GeoJSON';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import Point from 'ol/geom/Point';
import Map from 'ol/Map';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import {Y_KEY, X_KEY, Z_KEY} from '../cui-ol-point-control.component';
import {CuiControlComponent} from '../../../cui-control.component';
import proj4 from 'proj4';
import {register} from 'ol/proj/proj4';
import {Coordinate} from '../../../../cui-data';
import {defaults as defaultControls, FullScreen, ScaleLine} from 'ol/control.js';
import MousePosition from 'ol/control/MousePosition.js';
import {createStringXY} from 'ol/coordinate.js';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {CoordinateReferenceSystem} from '@shared/cui-controls/cui-control/ol/line/cui-ol-line-control.component';
import {CuiModelHelper} from '@shared/cui-controls/services/cui/cui.helper';

let point: Coordinate;
let pointLayer: VectorLayer;

@Component({
  selector: 'cui-ol-point-select-control',
  templateUrl: './cui-ol-point-select.component.html',
  styleUrls: ['../../../../css/full-screen-map.css'],
})
export class CuiOlPointSelectComponent extends CuiControlComponent implements OnInit, AfterViewInit {
  @ViewChild('mapElement')
  mapElement: ElementRef;

  @Input() modalRef: BsModalRef;

  @Input() CRS: CoordinateReferenceSystem;

  @Output()
  public coordinatesOfPointChanged = new EventEmitter<any>();

  public point: Coordinate;
  public xKey: string;
  public yKey: string;
  public zKey: string;

  public map: Map;

  public mousePositionControl: MousePosition;

  constructor(public cuiModelHelper: CuiModelHelper) {
    super(cuiModelHelper);
  }

  ngOnInit(): void {
    super.ngOnInit();

    proj4.defs(this.CRS.code, this.CRS.proj4);
    register(proj4);

    this.mousePositionControl = new MousePosition({
      coordinateFormat: createStringXY(4),
      projection: this.CRS.code,
      target: document.getElementById('mouse-coordinates'),
      className: 'custom-mouse-position',
    });

    pointLayer = new VectorLayer({
      source: new VectorSource({
        format: new GeoJSON({
          defaultDataProjection: this.CRS.code,
          featureProjection: this.CRS.code
        })
      }),
    });

    this.xKey = this.key + '.' + X_KEY;
    this.yKey = this.key + '.' + Y_KEY;
    this.zKey = this.key + '.' + Z_KEY;

    point = this.getPointFromModel();
    pointLayer.getSource().addFeature(
      new Feature({
        geometry: new Point(
          point
        )
      })
    );

    this.map = new Map({
      controls: defaultControls({
        attributionOptions: {
          collapsible: false
        }
      }).extend([
        new FullScreen(),
        new ScaleLine(),
        this.mousePositionControl
      ]),
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        pointLayer
      ],
      view: new View({
        zoom: 6,
        center: point,
        projection: this.CRS.code
      })
    });
  }

  ngAfterViewInit() {
    this.map.setTarget(this.mapElement.nativeElement.id);
    this.map.on(
      'click',
      function (event: MapBrowserEvent) {
        pointLayer.getSource().clear();
        point = event.map.getCoordinateFromPixel(event.pixel);
        pointLayer.getSource().addFeature(
          new Feature({
            geometry: new Point(
              point
            )
          })
        );
      },
      {
        component: this
      }
    );
  }

  public getPointFromModel(): Coordinate {
    return [
      this.cuiModelHelper.GetModelValue(this.model, this.xKey) ? this.cuiModelHelper.GetModelValue(this.model, this.xKey) : 0,
      this.cuiModelHelper.GetModelValue(this.model, this.yKey) ? this.cuiModelHelper.GetModelValue(this.model, this.yKey) : 0,
      this.cuiModelHelper.GetModelValue(this.model, this.zKey) ? this.cuiModelHelper.GetModelValue(this.model, this.zKey) : 0
    ];
  }

  ChangeValueOfCoordinatesInModel() {
    if (point) {
      this.coordinatesOfPointChanged.emit({x: point[0], y: point[1], z: 0});
    }
  }

  HideModal() {
    this.modalRef.hide();
  }
}
