export class FieldInfo {
    layers: Layer[];
}
export class CodedValue {
    name: string;
    code: string;
}

export class Domain {
    domainName: string;
    fieldType: string;
    description: string;
    codedValues?: CodedValue[];
}

export class Field {
    name: string;
    aliasName: string;
    type: string;
    length: number;
    isNullable: boolean;
    domain?: Domain;
}

export class Layer {
    layerId: number;
    fields: Field[];
}
