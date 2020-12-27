import { ExtSnowflakeGenerator } from 'extended-snowflake';
import { Service } from 'typedi';
import IIdentifierService from './IdentifierService';

@Service()
export default class IdentifierServiceImpl implements IIdentifierService {
  private readonly idGenerator = new ExtSnowflakeGenerator(0);

  next() {
    return this.idGenerator.next();
  }
}
