/**
 * @file saga
 */
import {effects} from 'redux-saga';
import * as Action from '../action/action';
import * as api from '../api';

const {fork, put, call, take, all, select} = effects;

function* getPageData() {
    try {
        // yield call(api.initProjects);
        // const [initConfig] = yield all([
        //     call(api.initProjects),
        // ]);
        // yield put(Action.actions.pageAction.renderPageData(initConfig));
        // yield put(Action.actions.userAction.renderUserInfo(api.initUserInfo()));
    } catch (e) {
        // yield put(console.log(e));
    }
}

function* initPage() {
    yield fork(getPageData);

}


export default function* root() {
    yield all([
        fork(initPage),
    ]);
}
