export interface MockedModel {
  find: jest.Mock;
  findOne: jest.Mock;
  findById: jest.Mock;
  create: jest.Mock;
  updateOne: jest.Mock;
  deleteOne: jest.Mock;
  populate: jest.Mock;
  exec: jest.Mock;
  save: jest.Mock;
}
