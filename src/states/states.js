import {createGlobalState} from 'react-hooks-global-state';
const {setGlobalState, useGlobalState} = createGlobalState({
    voteCountsIOS: 0,
    voteCountsWindows: 0
});


export {useGlobalState, setGlobalState};