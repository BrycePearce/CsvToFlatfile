// user types
export type Field = {
    key: string;
    type: string;
    label: string;
};

export type Sheet = {
    name: string;
    slug: string;
    fields: Field[];
};

export type Action = {
    operation: string;
    mode: string;
    label: string;
    description: string;
    primary: boolean;
};

export type FlatfileWorkbook = {
    name: string;
    sheets: Sheet[];
    actions: Action[];
};

export type FormattedRecordData = {
    value: string;
    messages?: Message[];
    [key: string]: any; // we'll append any other values here into the record as well. An example might be "createdAt" or "updatedAt"
}


export type Message = {
    type: string; // the type of message displayed. Must be "info" | "error" | "warn"
    message: string; // This is an informational message about the 'year' field.
}

export type Record = {
    [key: string]: RecordData
};

export type RecordData = {
    messages?: Message[];
    value: string;
}

// api response types
export type WorkbookResponse = {
    data: {
        createdAt: string,
        id: string;
        labels: string[],
        spaceId: string;
        storage_strategy: string;
        updatedAt: string,
        sheets: Sheet & { id: string, workbookId: string }[]
    } & Omit<FlatfileWorkbook, 'sheets'>
};

export type InsertRecordResponse = {
    data: RecordCreationData;
}

type RecordCreationData = {
    success: boolean;
    records?: ResponseRecord[];
    counts?: Counts;
    versionId: string;
}

type Counts = {
    total: number;
    valid: number;
    error: number;
    errorsByField: ErrorsByField;
}

type ErrorsByField = {
    property1: number;
    property2: number;
}

type ResponseRecord = {
    links?: ResponseRecordLink[];
    value: string;
    valid?: boolean;
    messages?: ResponseMessage[];
    layer?: string;
    updatedAt?: string;
}

type ResponseRecordLink = {
    id: string;
    versionId: string;
    values: Values;
    valid: boolean;
    messages: ResponseMessage[];
    metadata: Metadata;
}
type Values = {
    property1: ResponseRecord;
    property2: ResponseRecord;
}


type ResponseMessage = {
    type: string[];
    source: string[];
    message: string;
}

type Metadata = {
    [key: string]: unknown;
}

