import { IMain, IDatabase } from 'pg-promise';
import * as pgPromise from 'pg-promise';
import * as humps from 'humps';

// import repos here

import { pgConfig } from '../config';

export interface Extensions {
    // declare repos here
}

let pgp: IMain;

const options = {
    extend: (obj: any) => {
        // create repos here
    },
    receive: (data: any) => {
        camelizeColumnNames(data);
    },
};

function camelizeColumnNames(data: any) {
    const template = data[0];
    // tslint:disable-next-line:forin
    for (const prop in template) {
        const camel = humps.camelize(prop);
        if (!(camel in template)) {
            for (let i = 0; i < data.length; i += 1) {
                const d = data[i];
                d[camel] = d[prop];
                delete d[prop];
            }
        }
    }
}

pgp = pgPromise(options);

export const Model = <IDatabase<Extensions>&Extensions>pgp(pgConfig);

export interface Shared {
    id: string;
    createTime: Date;
}

// export interfaces here
