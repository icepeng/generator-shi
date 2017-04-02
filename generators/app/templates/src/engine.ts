import { Router, Request, Response, NextFunction } from './yoshi';
import * as Config from './config';
import * as Controllers from './controllers';
import * as Policies from './policies';

const allowedMethods = ['get', 'post', 'delete', 'put', 'patch'];

export class Engine {
    router: Router;
    config: any;

    constructor(config: any) {
        this.config = config;
        this.router = Router();
        this.run();
    }

    parseRouteKey(str: string) {
        const [method, url] = str.split(' ');
        return [method.toLowerCase(), url];
    }

    assertMethod(method: string) {
        if (!allowedMethods.some(x => x === method)) {
            throw new Error('RouteConfigError: Invalid method');
        }
    }

    parseRouteValue(str: string) {
        return Config.routes[str].split('.');
    }

    buildPolicies(controllerName: string, funcName: string) {
        const controllerPolicy = Config.policies[controllerName];
        if (!controllerPolicy) {
            console.log(`No policy found for ${controllerName}, skipping..`);
            return [];
        }

        const funcPolicies = controllerPolicy[funcName];
        if (!funcPolicies) {
            console.log(`No policy found for ${controllerName}.${funcName}, skipping..`);
            return [];
        }

        return funcPolicies.map((item: string) => {
            if (!Policies[item]) {
                throw new Error('PolicyConfigError: Invalid policy name');
            }
            return Policies[item];
        });
    }

    getControllerFunc(controllerName: string, funcName: string) {
        const controller = Controllers[controllerName];
        if (!controller) {
            throw new Error('RouteConfigError: Invalid contoller');
        }

        const controllerFunc = controller[funcName];
        if (!controllerFunc) {
            throw new Error('RouteConfigError: Invalid contoller function');
        }

        return controllerFunc;
    }

    run() {
        Object.keys(Config.routes).forEach(key => {
            try {
                const [method, url] = this.parseRouteKey(key);
                const [controller, func] = this.parseRouteValue(key);
                this.assertMethod(method);
                const funcToRun = this.getControllerFunc(controller, func);
                const policy = this.buildPolicies(controller, func);
                this.router[method](url, policy, funcToRun);
            } catch (err) {
                console.error(err);
                console.error(`Error Occured while processing - '${key}': '${Config.routes[key]}'`);
                process.exit(-1);
            }
        });
    }
}

export default new Engine(Config).router;
