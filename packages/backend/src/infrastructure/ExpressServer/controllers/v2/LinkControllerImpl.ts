import { Router } from 'express';
import { Inject, Service } from 'typedi';
import * as Yup from 'yup';
import { Link as ApiLink, PostV2LinksRequestBody, PostV2LinksResponse } from '../../../../api-types';
import Link from '../../../../app/Links/Link';
import LinkService from '../../../../app/Links/service/LinkService';
import LinkServiceImpl from '../../../../app/Links/service/LinkServiceImpl';
import User from '../../../../app/Users/User';
import ILogger, { Logger } from '../../../Logger/Logger';
import LoggerImpl from '../../../Logger/LoggerImpl';
import asyncRoute from '../../middleware/asyncRoute';
import LinkController from './LinkController';

@Service()
export default class LinkControllerImpl implements LinkController {
  private readonly log: Logger;

  constructor(
    @Inject(() => LoggerImpl) private readonly logger: ILogger,
    @Inject(() => LinkServiceImpl) private readonly linkService: LinkService,
  ) {
    this.log = this.logger.child('LinkController');
  }

  private serialiseLink(link: Link): ApiLink {
    return {
      id: link.reference,
      url: link.url,
      tags: link.tags,
      created: link.created?.toISOString(),
      user: {
        name: link.user.name,
      },
    };
  }

  async addLink(currentUser: User, body: PostV2LinksRequestBody): Promise<PostV2LinksResponse> {
    const link = await this.linkService.addLink(currentUser, body);
    return {
      link: this.serialiseLink(link),
    };
  }

  router() {
    const router = Router();

    router.post(
      '/',
      asyncRoute<PostV2LinksRequestBody, PostV2LinksResponse, unknown, unknown>(
        {
          body: Yup.object()
            .shape({
              url: Yup.string().required(),
              tags: Yup.array().of(Yup.string().required()).required(),
            })
            .defined(),
        },
        (req) => this.addLink(req.user, req.body),
      ),
    );

    return router;
  }
}
