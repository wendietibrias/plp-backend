import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
const version: string = require('../../../package.json').version;

export class VersionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Attach the version to the response headers
    res.setHeader('X-App-Version', version);

    // Optionally, attach it to the response body if needed
    res.locals.version = version;

    next();
  }
}
