export class Feature {
    attributes: any;
    geometry: any;
    constructor(attributes: any, geometry?: any) {
        this.attributes = attributes;
        this.geometry = geometry;
    }
}
