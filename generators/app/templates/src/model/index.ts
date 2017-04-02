import { IMain, IDatabase } from 'pg-promise';
import * as pgPromise from 'pg-promise';

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
};

pgp = pgPromise(options);

export const Model = <IDatabase<Extensions>&Extensions>pgp(pgConfig);

export interface Shared {
    id: string;
    create_time: Date;
}

// export interfaces here
