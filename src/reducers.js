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
        notice: [],
        noticesPageInfo : {totalCount:0},

        fetchingPayments :false,
        errorPayments: null,
        fetchedPayments : false,
        payments : [],
        paymentsPageInfo : {totalCount:0},

        fetchingFeedbacks :false,
        errorFeedbacks: null,
        fetchedFeedbacks : false,
        feedbacks : [],
        feedbacksPageInfo : {totalCount:0},

        fetchingvoucherPayments : false,
        errorvoucherPayments: null,
        fetchedvoucherPayments: false,
        voucherPayments: {
        },
            
        
        voucherPaymentsPageInfo: {totalCount: 0}
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
            case "GET_NOTICE_REQ":
                return{
                     ...state,
                     fetchingNotices: true,
                     fetchedNotices: false,
                     notice: null,
                     errorNotices: null,
                     
                }
                         case "GET_NOTICE_RESP":
            console.log('GET_NOTICE_RESP',action.payload.data.notice, action.payload.data )
             //var notice = parseData(action.payload.data.notice);
                 return {
                     ...state,
                     fetchingNotices:false,
                     fetchedNotices: true,
                     notice : action.payload.data.notice,
                     errorNotices: formatGraphQLError(action.payload),
                     
     
                 }
             case "GET_NOTICE_ERR":
                 {
                     return {
                         ...state,
                         errorNotices: formatServerError(action.payload),
                     }
                 }

            case "FETCH_PAYMENTS_REQ":
                return{
                     ...state,
                     fetchingvoucherPayments: true,
                     fetchedvoucherPayments: false,
                     voucherPayments: {
                         
                     },
                     voucherPaymentsPageInfo : {totalCount:0},
                     errorvoucherPayments: null,
                     
                }
             case "FETCH_PAYMENTS_RESP":
                 return {
                     ...state,
                     fetchingvoucherPayments:false,
                     fetchedvoucherPayments: true,
                     voucherPayments : parseData(action.payload.data.voucherPayments),
                     voucherPaymentsPageInfo : pageInfo(action.payload.data.voucherPayments),
                     errorvoucherPayments: formatGraphQLError(action.payload),
                     
     
                 }
             case "FETCH_PAYMENTS_ERR":
                 {
                     return {
                         ...state,
                         errorvoucherPayments: formatServerError(action.payload),
                     }
                 }


            case "FETCH_FEEDBACKS_REQ":
                return{
                     ...state,
                     fetchingFeedbacks: true,
                     fetchedFeedbacks: false,
                     feedbacks: [],
                     feedbacksPageInfo : {totalCount:0},
                     errorNotices: null,
                     
                }
             case "FETCH_FEEDBACKS_RESP":
                 return {
                     ...state,
                     fetchingFeedbacks:false,
                     fetchedFeedbacks: true,
                     feedbacks : parseData(action.payload.data.feedbacks),
                     feedbacksPageInfo : pageInfo(action.payload.data.feedbacks),
                     errorFeedbacks: formatGraphQLError(action.payload),
                     
     
                 }
             case "FETCH_FEEDBACKS_ERR":
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