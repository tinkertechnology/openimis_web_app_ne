import { graphql, formatPageQuery,formatQuery, formatMutation, formatPageQueryWithCount} from "@openimis/fe-core";

export function fetchNotices(prms){
    console.log(prms)
    $(!!prms.title_Icontains ? `"title_Icontains": "${prms.title_Icontains}"`: "")
    const payload = formatPageQueryWithCount(
        "notices",
        prms,
        ["title", "description", "id"]
    );
    return graphql(payload, "FETCH_NOTICES")
}

export function fetchFeedbacks(prms){
    console.log(prms)
    // $(!!prms.title_Icontains ? `"title_Icontains": "${prms.title_Icontains}"`: "")
    const payload = formatPageQueryWithCount(
        "feedbacks",
        prms,
        ["fullname", "emailAddress","mobileNumber", "queries"]
    );
    return graphql(payload, "FETCH_FEEDBACKS")
}

//mutations


export function getNotice(notice_id){
    var filters = []
    console.log('eeee', notice_id);
    filters.push(`id:"${notice_id}"`)
   const payload = formatQuery(
       "notice",
       [`id: "${notice_id}"`],
       ["id", "title", "description"]
      
   )
    return graphql(
        payload,
        "GET_NOTICE"
    )
}

export function createNotice(notice){
    let noticeGQL = `
    title: "${notice.title}"
    description: "${notice.description}"
    `
    let mutation = formatMutation("createNotice", noticeGQL);
    return graphql(
        mutation.payload,
        "CREATE_NOTICE",
        {
            
            
            
        }
    )
}

export function updateNotice(notice, id){
    console.log('notice', notice);
    console.log('id', id);
    let noticeGQL = `
    id: "${notice.id}"
    title: "${notice.title}"
    description: "${notice.description}"
    `
    
    let jptNoticeGQL = `
    title: "${notice.title}"
    description: "${notice.description}"
    `
    let mutation = formatMutation("updateNotice", noticeGQL);
    return graphql(
        mutation.payload,
        "UPDATE_NOTICE",
        {
            id: id
        }
    )
}



export function fetchPayments(prms){
    const payload = formatPageQueryWithCount(
        "voucherPayments",
        prms,
        ["voucher", "id"]
    );
    return graphql(payload, "FETCH_PAYMENTS")
}
