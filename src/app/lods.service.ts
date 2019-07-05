import { Injectable } from '@angular/core';
import { loadModules } from 'esri-loader';
import esri = __esri;

@Injectable({
  providedIn: 'root'
})
export class LodsService {
  lods:esri.LOD[] = [];
  constructor() { 
    loadModules([    
      'esri/layers/support/LOD'])
      .then(([LOD]) => {
      this.lods = [
        new LOD(
        {
        "level": 0,
        "levelValue": "0",
        "resolution": 78271.51696399994,
        "scale": 295828763.795777
        }),
        new LOD(
        {
        "level": 1,
        "levelValue": "1",
        "resolution": 39135.75848200009,
        "scale": 147914381.897889
        }),
        new LOD(
        {
        "level": 2,
        "levelValue": "2",
        "resolution": 19567.87924099992,
        "scale": 73957190.948944
        }),
        new LOD(
        {
        "level": 3,
        "levelValue": "3",
        "resolution": 9783.93962049996,
        "scale": 36978595.474472
        }),
        new LOD(
        {
        "level": 4,
        "levelValue": "4",
        "resolution": 4891.96981024998,
        "scale": 18489297.737236
        }),
        new LOD(
        {
        "level": 5,
        "levelValue": "5",
        "resolution": 2445.98490512499,
        "scale": 9244648.868618
        }),
        new LOD(
        {
        "level": 6,
        "levelValue": "6",
        "resolution": 1222.992452562495,
        "scale": 4622324.434309
        }),
        new LOD(
        {
        "level": 7,
        "levelValue": "7",
        "resolution": 611.4962262813797,
        "scale": 2311162.217155
        }),
        new LOD(
        {
        "level": 8,
        "levelValue": "8",
        "resolution": 305.74811314055756,
        "scale": 1155581.108577
        }),
        new LOD(
        {
        "level": 9,
        "levelValue": "9",
        "resolution": 152.87405657041106,
        "scale": 577790.554289
        }),
        new LOD(
        {
        "level": 10,
        "levelValue": "10",
        "resolution": 76.43702828507324,
        "scale": 288895.277144
        }),
        new LOD(
        {
        "level": 11,
        "levelValue": "11",
        "resolution": 38.21851414253662,
        "scale": 144447.638572
        }),
        new LOD(
        {
        "level": 12,
        "levelValue": "12",
        "resolution": 19.10925707126831,
        "scale": 72223.819286
        }),
        new LOD(
        {
        "level": 13,
        "levelValue": "13",
        "resolution": 9.554628535634155,
        "scale": 36111.909643
        }),
        new LOD(
        {
        "level": 14,
        "levelValue": "14",
        "resolution": 4.77731426794937,
        "scale": 18055.954822
        }),
        new LOD(
        {
        "level": 15,
        "levelValue": "15",
        "resolution": 2.388657133974685,
        "scale": 9027.977411
        }),
        new LOD(
        {
        "level": 16,
        "levelValue": "16",
        "resolution": 1.1943285668550503,
        "scale": 4513.988705
        }),
        new LOD(
        {
        "level": 17,
        "levelValue": "17",
        "resolution": 0.5971642835598172,
        "scale": 2256.994353
        }),
        new LOD(
        {
        "level": 18,
        "levelValue": "18",
        "resolution": 0.29858214164761665,
        "scale": 1128.497176
        }),
        new LOD(
        {
        "level": 19,
        "levelValue": "19",
        "resolution": 0.14929107082380833,
        "scale": 564.248588
        }),
        new LOD(
        {
        "level": 20,
        "levelValue": "20",
        "resolution": 0.07464553541190416,
        "scale": 282.124294
        }),
        new LOD(
        {
        "level": 21,
        "levelValue": "21",
        "resolution": 0.03732276770595208,
        "scale": 141.062147
        }),
        new LOD(
        {
        "level": 22,
        "levelValue": "22",
        "resolution": 0.01866138385297604,
        "scale": 70.5310735
        })
        ]
      });
  }

}
