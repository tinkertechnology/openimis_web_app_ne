import React, { Component, Fragment } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';

import {
    withModulesManager, formatMessageWithValues, formatDateFromISO, formatMessage,
    withHistory,
    Searcher,
} from "@openimis/fe-core";
// import EnquiryDialog from "./EnquiryDialog";
// import { RIGHT_INSUREE_DELETE } from "../constants";
import { fetchNotices } from "../actions";

import NoticeFilter from "./NoticeFilter";

const NOTICE_SEARCHER_CONTRIBUTION_KEY = "webapp.NoticeSearcher";

class NoticeSearcher extends Component {

    state = {
        open: false,
        id: null,
        confirmedAction: null,
        reset: 0,
    }

    constructor(props) {
        super(props);
        this.rowsPerPageOptions = props.modulesManager.getConf("fe-webapp", "noticeFilter.rowsPerPageOptions", [10, 20, 50, 100]);
        this.defaultPageSize = props.modulesManager.getConf("fe-webapp", "noticeFilter.defaultPageSize", 10);
    }

    componentDidMount(){
        console.log("FilterNotice", this.props);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.submittingMutation && !this.props.submittingMutation) {
            this.props.journalize(this.props.mutation);
            this.setState({ reset: this.state.reset + 1 });
        } else if (!prevProps.confirmed && this.props.confirmed) {
            this.state.confirmedAction();
        }
    }

    fetch = (prms) => {
        this.props.fetchNotices(
            // this.props.modulesManager,
            prms
        )
    }

    rowIdentifier = (r) => r.id

    filtersToQueryParams = (state) => {
        let prms = Object.keys(state.filters)
            .filter(f => !!state.filters[f]['filter'])
            .map(f => state.filters[f]['filter']);
        // let prms = [];
        // prms.push(state.filters);
        console.log(prms);
        
        // prms.push(`title_Icontains: ${this.state.edited.title==null ? `""`: `"${this.state.edited.title}"`}`);
        // prms.push( `first: ${this.state.pageSize}`);

        prms.push( `first: 10`);
        if (!!state.afterCursor) {
            prms.push(`after: "${state.afterCursor}"`)
        }
        if (!!state.beforeCursor) {
            prms.push(`before: "${state.beforeCursor}"`)
        }
        if (!!state.orderBy) {
            prms.push(`orderBy: ["${state.orderBy}"]`);
        }
        return prms;
    }

    headers = () => {
        var h = [
            "webapp.sn",
            "webapp.notice.title",
            "webapp.notice.description",
            // "webapp.action"
        ];

        return h;
    }

    sorts = (filters) => {
        var results = [
            ['title', true],
            ['description', true],
        ];

        return results;
    }

    itemFormatters = (filters) => {
        var formatters = [
            notice => notice.id,
            notice => notice.title,
            notice => notice.description,
        ]

        return formatters;
    }


    render() {
        const { intl,
            notices, noticesPageInfo, fetchingNotices, fetchedNotices, errorNotices,
            filterPaneContributionsKey, cacheFiltersKey, onDoubleClick
        } = this.props;

        let count = noticesPageInfo.totalCount;

        return (
            <Fragment>
                <Searcher
                    module="webapp"
                    cacheFiltersKey={cacheFiltersKey}
                    FilterPane={NoticeFilter}
                    filterPaneContributionsKey={filterPaneContributionsKey}
                    items={notices}
                    itemsPageInfo={noticesPageInfo}
                    fetchingItems={fetchingNotices}
                    fetchedItems={fetchedNotices}
                    errorItems={errorNotices}
                    contributionKey={NOTICE_SEARCHER_CONTRIBUTION_KEY}
                    tableTitle={formatMessageWithValues(intl, "webapp", "notices", { count })}
                    rowsPerPageOptions={this.rowsPerPageOptions}
                    defaultPageSize={this.defaultPageSize}
                    fetch={this.fetch}
                    filtersToQueryParams={this.filtersToQueryParams}
                    defaultOrderBy="id"
                    headers={this.headers}
                    itemFormatters={this.itemFormatters}
                    sorts={this.sorts}
                    reset={this.state.reset}
                />
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    rights: !!state.core && !!state.core.user && !!state.core.i_user ? state.core.user.i_user.rights:[],
    fetchingNotices : state.webapp.fetchingNotices,
    errorNotices : state.webapp.errorNotices,
    fetchedNotices : state.webapp.fetchedNotices,
    notices : state.webapp.notices,
    noticesPageInfo : state.webapp.noticesPageInfo,
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({fetchNotices}, dispatch);
};


export default withModulesManager(withHistory(connect(mapStateToProps, mapDispatchToProps)(injectIntl(NoticeSearcher))));