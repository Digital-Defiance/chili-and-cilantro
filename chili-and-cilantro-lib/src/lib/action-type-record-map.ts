import ActionType from "./enumerations/action-type";

export const ActionTypeRecordMap: Record<string, ActionType> = {
    [ActionType.CREATE_GAME]: ActionType.CREATE_GAME,
    [ActionType.END_GAME]: ActionType.END_GAME,
    [ActionType.END_ROUND]: ActionType.END_ROUND,
    [ActionType.EXPIRE_GAME]: ActionType.EXPIRE_GAME,
    [ActionType.FLIP_CARD]: ActionType.FLIP_CARD,
    [ActionType.JOIN_GAME]: ActionType.JOIN_GAME,
    [ActionType.MAKE_BID]: ActionType.MAKE_BID,
    [ActionType.MESSAGE]: ActionType.MESSAGE,
    [ActionType.PASS]: ActionType.PASS,
    [ActionType.PLACE_CARD]: ActionType.PLACE_CARD,
    [ActionType.QUIT_GAME]: ActionType.QUIT_GAME,
    [ActionType.START_BIDDING]: ActionType.START_BIDDING,
    [ActionType.START_GAME]: ActionType.START_GAME,
    [ActionType.START_NEW_ROUND]: ActionType.START_NEW_ROUND,
};