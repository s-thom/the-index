import { Router } from 'express';
import { Inject, Service } from 'typedi';
import * as Yup from 'yup';
import { GetV2TagsQueryParams, GetV2TagsResponse } from '../../../../api-types';
import ITagService from '../../../../app/Tags/service/TagService';
import TagServiceImpl from '../../../../app/Tags/service/TagServiceImpl';
import User from '../../../../app/Users/User';
import ILoggerService, { Logger } from '../../../../services/LoggerService/LoggerService';
import LoggerServiceImpl from '../../../../services/LoggerService/LoggerServiceImpl';
import asyncRoute from '../../middleware/asyncRoute';
import ITagController from './TagController';

@Service()
export default class TagControllerImpl implements ITagController {
  private readonly log: Logger;

  constructor(
    @Inject(() => LoggerServiceImpl) private readonly logger: ILoggerService,
    @Inject(() => TagServiceImpl) private readonly tagService: ITagService,
  ) {
    this.log = this.logger.child('TagController');
  }

  async getCommonlyUsedTags(user: User, queryParams: GetV2TagsQueryParams): Promise<GetV2TagsResponse> {
    const tags = await this.tagService.getUserTags(user, { blockList: queryParams.exclude });

    return {
      tags: tags.map((tag) => tag.name),
    };
  }

  router() {
    const router = Router();

    router.get(
      '/',
      asyncRoute<unknown, GetV2TagsResponse, unknown, GetV2TagsQueryParams>(
        {
          query: Yup.object()
            .shape({
              exclude: Yup.array()
                .transform((value: unknown, originalValue: unknown) => {
                  if (typeof originalValue === 'string') {
                    return [originalValue];
                  }
                  return originalValue;
                })
                .of(Yup.string().required())
                .notRequired(),
            })
            .defined(),
        },
        (req) => this.getCommonlyUsedTags(req.user, req.query),
      ),
    );

    return router;
  }
}
