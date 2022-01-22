import { AUTH_FAIL, AUTH_START, AUTH_SUCCESS, LOGOUT_FAIL, LOGOUT_START, LOGOUT_SUCCESS } from '../constants';

export const authStart = (payload) => ({
    type: AUTH_START,
    payload,
});

export const authSuccess = (payload) => ({
    type: AUTH_SUCCESS,
    payload,
});

export const authFail = (payload) => ({
    type: AUTH_FAIL,
    payload,
});

export const logoutStart = () => ({
    type: LOGOUT_START,
});

export const logoutFail = () => ({
    type: LOGOUT_FAIL,
});

export const logoutSuccess = () => ({
    type: LOGOUT_SUCCESS,
});
