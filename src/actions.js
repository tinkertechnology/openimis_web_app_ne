import { graphql, formatPageQuery, formatMutation, formatPageQueryWithCount} from "@openimis/fe-core";

export function fetchNotices(prms){
    const payload = formatPageQueryWithCount(
        "notices",
        prms,
        ["title", "description"]
    );
    return graphql(payload, "FETCH_NOTICES")
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
