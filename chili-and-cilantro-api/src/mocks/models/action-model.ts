import {
  ActionType,
  IActionDetailsBase,
  IActionDocument,
  ModelName,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Types } from 'mongoose';
import { makeAction } from '../../fixtures/action';
import { BaseMockedModel, createBaseMockedModel } from './base';

export interface MockedActionModel
  extends BaseMockedModel<IActionDocument<Types.ObjectId, IActionDetailsBase>> {
  findByType: jest.MockedFunction<
    (
      type: ActionType,
    ) => Promise<IActionDocument<Types.ObjectId, IActionDetailsBase>[]>
  >;
}

const baseMockedModel = createBaseMockedModel<
  IActionDocument<Types.ObjectId, IActionDetailsBase>
>(ModelName.Action);

export const ActionModel: MockedActionModel = Object.assign(baseMockedModel, {
  create: jest
    .fn()
    .mockImplementation(
      async (
        actionData: Partial<
          IActionDocument<Types.ObjectId, IActionDetailsBase>
        >,
      ) => {
        const actionType = actionData.type || ActionType.CREATE_GAME;
        return makeAction(actionType, actionData);
      },
    ),

  findByType: jest.fn().mockImplementation(async (type: ActionType) => {
    // Implement the mock behavior for findByType
    return [];
  }),
});
