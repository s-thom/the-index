import { Request, Response, Router } from 'express';
import { Inject, Service } from 'typedi';
import { loginRoute } from '../../../../old/routes/auth';
import { addNewLinkRoute, getLinkByIdRoute } from '../../../../old/routes/links';
import { searchLinksByTags } from '../../../../old/routes/search';
import { getMostCommonTagsRoute } from '../../../../old/routes/tags';
import { checkTokenMiddleware } from '../../../../old/util/auth';
import ILogger, { Logger } from '../../../Logger/Logger';
import LoggerImpl from '../../../Logger/LoggerImpl';
import { IController } from '../Controller';

@Service()
export default class OldControllerImpl implements IController {
  private readonly log: Logger;

  constructor(@Inject(() => LoggerImpl) private readonly logger: ILogger) {
    this.log = this.logger.child('OldController');
  }

  router() {
    const router = Router();

    // Custom middleware
    router.use(checkTokenMiddleware);

    router.get('/', (req: Request, res: Response) => res.send('Hello World from app.ts!'));
    router.get('/links/:id', getLinkByIdRoute);
    router.post('/links', addNewLinkRoute);
    router.post('/search', searchLinksByTags);
    router.get('/tags', getMostCommonTagsRoute);
    router.post('/login', loginRoute);

    return router;
  }
}
