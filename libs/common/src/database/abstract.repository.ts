import { FilterQuery, UpdateQuery, Model, Types } from 'mongoose';
import { AbstractSchema } from './abstract.schema';
import { NotFoundException, LoggerService } from '@nestjs/common';

export abstract class AbstractRepository<TDocument extends AbstractSchema> {
  protected abstract logger: LoggerService;
  constructor(protected readonly model: Model<TDocument>) {}

  async find(filterQuery: FilterQuery<TDocument>): Promise<TDocument[]> {
    return this.model.find(filterQuery).lean<TDocument[]>(true);
  }

  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model
      .findOne(filterQuery)
      .lean<TDocument>()
      .exec();

    if (!document) {
      this.logger.error(
        `Document not found for query: ${JSON.stringify(filterQuery)}`,
      );
      throw new NotFoundException('Document not found');
    }

    return document;
  }

  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    const saved = await createdDocument.save();
    return saved.toObject() as TDocument; // ✅ safer than toJSON() + unknown cast
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    const document = await this.model
      .findOneAndUpdate(filterQuery, update, {
        new: true,
      })
      .lean<TDocument>()
      .exec();

    if (!document) {
      this.logger.error(
        `Document not found for query: ${JSON.stringify(filterQuery)}`,
      );
      throw new NotFoundException('Document not found');
    }

    return document;
  }

  async findOneAndDelete(
    filterQuery: FilterQuery<TDocument>,
  ): Promise<TDocument> {
    return this.model.findOneAndDelete(filterQuery).lean<TDocument>().exec();
  }
}
