import { Component, ChangeDetectionStrategy } from '@angular/core';
import { setAssetPath as setCalciteComponentsAssetPath } from '@esri/calcite-components/dist/components';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AppComponent {
  title = 'stormwater-manager';

}
