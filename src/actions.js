import { graphql, formatPageQuery, formatMutation, formatPageQueryWithCount} from "@openimis/fe-core";

export function fetchNotices(prms){
    console.log(prms)
    $(!!prms.title_Icontains ? `"title_Icontains": "${prms.title_Icontains}"`: "")
    const payload = formatPageQueryWithCount(
        "notices",
        prms,
        ["title", "description"]
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


export function fetchPayments(prms){
    const payload = formatPageQueryWithCount(
        "notices",
        prms,
        ["title", "description"]
    );
    return graphql(payload, "FETCH_NOTICES")
}
