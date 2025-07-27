import { Prop, Schema } from '@nestjs/mongoose';
import { Types, SchemaTypes } from 'mongoose';

@Schema()
export abstract class AbstractSchema {
  // Define common properties for all schemas here
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;
}
