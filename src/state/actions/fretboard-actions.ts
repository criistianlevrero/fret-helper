

export type RegisterPageUnloaded = {
    type: 'REGISTER_PAGE_UNLOADED';
};

export type RegisterPageOtro = {
    type: 'REGISTER_PAGE_OTRO';
    payload?: number;
};

type Action = RegisterPageUnloaded | RegisterPageOtro

export default Action