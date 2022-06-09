import { AUTH, LOGOUT } from '../constants/actionTypes';

export default (state = null, action) => {
    switch (action.type) {
        case AUTH:
            localStorage.setItem('profile', JSON.stringify({ ...action?.payload }));
            return { state: action?.payload };
        case LOGOUT:
            localStorage.clear();
            return { state: null };
        default:
            return state;
    }
}