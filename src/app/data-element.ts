
    export interface SpatialReference {
        wkid: number;
        latestWkid: number;
    }

    export interface GeometryDef {
        avgNumPoints: number;
        geometryType: string;
        hasM: boolean;
        hasZ: boolean;
        spatialReference: SpatialReference;
        gridSize0: number;
    }

    export interface CodedValue {
        name: string;
        code: string;
    }

    export interface Domain {
        domainName: string;
        fieldType: string;
        mergePolicy: string;
        splitPolicy: string;
        description: string;
        owner: string;
        codedValues: CodedValue[];
    }

    export interface FieldArray {
        name: string;
        type: string;
        isNullable: boolean;
        length: number;
        precision: number;
        scale: number;
        required: boolean;
        editable: boolean;
        modelName: string;
        geometryDef: GeometryDef;
        aliasName: string;
        domain: Domain;
    }

    export interface Fields {
        fieldArray: FieldArray[];
    }

    export interface SpatialReference2 {
        wkid: number;
        latestWkid: number;
    }

    export interface GeometryDef2 {
        avgNumPoints: number;
        geometryType: string;
        hasM: boolean;
        hasZ: boolean;
        spatialReference: SpatialReference2;
        gridSize0: number;
    }

    export interface FieldArray2 {
        name: string;
        type: string;
        isNullable: boolean;
        length: number;
        precision: number;
        scale: number;
        required: boolean;
        editable: boolean;
        modelName: string;
        geometryDef: GeometryDef2;
        aliasName: string;
    }

    export interface Fields2 {
        fieldArray: FieldArray2[];
    }

    export interface IndexArray {
        name: string;
        isUnique: boolean;
        isAscending: boolean;
        fields: Fields2;
    }

    export interface Indexes {
        indexArray: IndexArray[];
    }

    export interface RelationshipClassNames {
        names: any[];
    }

    export interface ExtensionProperties {
        type: string;
        propertySetItems: any[];
    }

    export interface Extent {
        xmin: number;
        ymin: number;
        xmax: number;
        ymax: number;
    }

    export interface SpatialReference3 {
        wkid: number;
        latestWkid: number;
    }

    export interface DataElement {
        layerId: number;
        datasetType: string;
        requiredGeodatabaseClientVersion: string;
        hasOID: boolean;
        oidFieldName: string;
        fields: Fields;
        indexes: Indexes;
        clsId: string;
        extClsId: string;
        relationshipClassNames: RelationshipClassNames;
        aliasName: string;
        modelName: string;
        hasGlobalID: boolean;
        globalIdFieldName: string;
        rasterFieldName: string;
        extensionProperties: ExtensionProperties;
        controllerMemberships: any[];
        editorTrackingEnabled: boolean;
        creatorFieldName: string;
        createdAtFieldName: string;
        lastEditorFieldName: string;
        editedAtFieldName: string;
        featureType: string;
        shapeType: string;
        shapeFieldName: string;
        hasM: boolean;
        hasZ: boolean;
        hasSpatialIndex: boolean;
        extent: Extent;
        spatialReference: SpatialReference3;
        changeTracked: boolean;
        attributeRules: any[];
        fieldFilteringEnabled?: boolean;
    }

    export interface LayerDataElement {
        layerId: number;
        dataElement: DataElement;
    }

    export class LayerInfo {
        layerDataElements: LayerDataElement[];
    }

