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