type StatusEnumType = {
    [key: number]: string;
};

type StatusReverseEnumType = {
    [key: string]: number;
};

const statusReverseEnumType: StatusReverseEnumType = {
    Todo: 0,
    InProgress: 1,
    Done: 2,
  };

const statusEnumType: StatusEnumType = {
    0: "Todo",
    1: "InProgress",
    2: "Done",
};

export {statusEnumType, statusReverseEnumType};