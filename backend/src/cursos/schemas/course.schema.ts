import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Schema as MongooseSchema, Types } from 'mongoose';

export type CourseDocument = HydratedDocument<Course>;

@Schema({ timestamps: true, collection: 'Cursos' })
export class Course {
  _id!: Types.ObjectId;

  @Prop({ required: true })
  id!: string;

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  title!: any;

  @Prop({ type: MongooseSchema.Types.Mixed, required: false })
  career?: any;

  @Prop({ type: MongooseSchema.Types.Mixed, required: false })
  branch?: any;

  @Prop({ required: true })
  difficulty!: string;

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  duration!: any;

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  description!: any;

  @Prop({ type: MongooseSchema.Types.Mixed, required: false })
  intro?: any;

  @Prop({ required: true })
  thumbnail_url!: string;

  @Prop({ type: MongooseSchema.Types.Mixed, default: [] })
  tags!: any;

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  modules!: any[];
}

export const CourseSchema = SchemaFactory.createForClass(Course);
CourseSchema.index({ id: 1 }, { unique: true });
CourseSchema.index({ career: 1 });
CourseSchema.index({ branch: 1 });
