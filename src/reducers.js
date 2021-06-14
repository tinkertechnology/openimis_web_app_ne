import {
    parseData, dispatchMutationReq, dispatchMutationResp, dispatchMutationErr,
    pageInfo, formatServerError, formatGraphQLError
} from '@openimis/fe-core';
function reducer(
    state = {
        fetchingNotices :false,
        errorNotices: null,
        fetchedNotices : false,
        notices : [],
        noticesPageInfo : {totalCount:0},
    },
 
    action,
    
){
    switch(action.type){
        case "FETCH_NOTICES_REQ":
           return{
                ...state,
                fetchingNotices: true,
                fetchedNotices: false,
                notices: [],
                noticesPageInfo : {totalCount:0},
                submittingMutation: false,
                mutation: {},
                errorNotices: null,
                
           }
        case "FETCH_NOTICES_RESP":
            return {
                ...state,
                fetchingNotices:false,
                fetchedNotices: true,
                notices : parseData(action.payload.data.notices),
                noticesPageInfo : pageInfo(action.payload.data.notices),
                errorNotices: formatGraphQLError(action.payload),
                

            }
        case "FETCH_NOTICES_ERR":
            {
                return {
                    ...state,
                    errorNotices: formatServerError(action.payload),
                }
            }
        default:
            return state;
    }
}

export default reducer;