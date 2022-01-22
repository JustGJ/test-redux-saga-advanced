import { all, call, take, put, delay, fork, spawn, cancel } from 'redux-saga/effects';
import { AUTH_START, LOGOUT_START } from '../constants';
import { registerUser, loginUser, logoutUser } from '../../utils/api';
import { authFail, authSuccess, logoutFail, logoutSuccess } from '../actions/Auth.actions';

function* authenticate({ email, password, isRegister }) {
    try {
        let data;
        // Si l'user clique sur s'enregistrer, isRegistrer devient true
        if (isRegister) {
            data = yield call(registerUser, { email, password });
        } else {
            data = yield call(loginUser, { email, password });
        }
        yield put(authSuccess(data.user));
        return data.user.id;
    } catch (error) {
        yield put(authFail(error.message));
    }
}

function* longRunningYield() {
    yield delay(5000);
    console.log('HI');
}

function* throwErrorSaga() {
    yield delay(1000);
    yield call(() => {
        throw Error('New error from Saga');
    });
}

function* logout() {
    try {
        yield call(logoutUser);
        yield put(logoutSuccess());
    } catch (error) {
        yield put(logoutFail(error.message));
    }
}

export default function* authFlow() {
    while (true) {
        // Connexion
        const { payload } = yield take(AUTH_START); // const action = yield take(AUTH_START); clg --> {payload: {email, password, isRegistrer}, type: AUTH_START
        const uid = yield call(authenticate, payload);

        yield call(longRunningYield); // interrompt le flux normal de connexion. Si on se login puis logout rapidement, on sera déconnecté, mais isLoggin sera toujours sur true
        const forkedSaga = yield fork(longRunningYield); // S'éxecute séparemment du flux de la saga : Si on se login puis logout rapidement, il sera prit en compte

        yield fork(throwErrorSaga); // L'erreur retourné va bloqué le flux
        yield spawn(throwErrorSaga); // L'erreur retourné va s'afficher mais ne bloquera pas le flux : le messahe "HI" va s'afficher

        // Déconnexion
        if (uid) {
            yield take(LOGOUT_START);
            yield call(logout);
            yield cancel(forkedSaga); // Crée une description d'effet qui demande au middleware d'annuler la tâche précédente : on retire "HI"
        }
    }
}

export function* authSaga() {
    yield all([authFlow()]);
}
