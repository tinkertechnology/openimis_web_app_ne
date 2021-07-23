import React, { Component, Fragment } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';

import {
    withModulesManager, formatMessageWithValues, formatDateFromISO, formatMessage,
    withHistory, 
    Searcher
} from "@openimis/fe-core";
import { fetchFeedbacks } from "../actions";
import FeedbackFilter from "./FeedbackFilter";


const FEEDBACK_SEARCHER_CONTRIBUTION_KEY = "webapp.FeedbackSearcher";

class FeedbackSearcher extends Component {

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
    

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.submittingMutation && !this.props.submittingMutation) {
            this.props.journalize(this.props.mutation);
            this.setState({ reset: this.state.reset + 1 });
        } else if (!prevProps.confirmed && this.props.confirmed) {
            this.state.confirmedAction();
        }
    }

    fetch = (prms) => {
        this.props.fetchFeedbacks(
            this.props.modulesManager,
            prms
        )
    }

    // rowIdentifier = (r) => r.id

    filtersToQueryParams = (state) => {
        let prms = Object.keys(state.filters)
            .filter(f => !!state.filters[f]['filter'])
            .map(f => state.filters[f]['filter']);
        // let prms = [];
        // prms.push(`title_Icontains: ${this.state.edited.title==null ? `""`: `"${this.state.edited.title}"`}`);
        prms.push( `first: ${this.state.pageSize}`);
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
            "webapp.feedback.name",
            "webapp.feedback.email",
            "webapp.feedback.mobile_number",
            "webapp.feedback.feedback_text",
            // "webapp.action"
        ];
        return h;
    }

    sorts = (filters) => {
        var results = [
            ['name', true],
            ['email', true],
            ['mobile_number', true],
            ['feedback_text', true],
        ];

        return results;
    }

    itemFormatters = (filters) => {
        var formatters = [
            feedback => feedback.id,
            feedback => feedback.fullname,
            feedback => feedback.emailAddress,
            feedback => feedback.mobileNumber,
            feedback => feedback.queries,
        ]

        return formatters;
    }


    render() {
        const { intl,
            feedbacks, feedbacksPageInfo, fetchingFeedbacks, fetchedFeedbacks, errorFeedbacks,
            filterPaneContributionsKey, cacheFiltersKey
        } = this.props;

        let count = feedbacksPageInfo.totalCount;

        return (
            <Fragment>
                <Searcher
                    module="webapp"
                    cacheFiltersKey={cacheFiltersKey}
                    FilterPane={FeedbackFilter}
                    filterPaneContributionsKey={filterPaneContributionsKey}
                    items={feedbacks}
                    itemsPageInfo={feedbacksPageInfo}
                    fetchingItems={fetchingFeedbacks}
                    fetchedItems={fetchedFeedbacks}
                    errorItems={errorFeedbacks}
                    contributionKey={FEEDBACK_SEARCHER_CONTRIBUTION_KEY}
                    tableTitle={formatMessageWithValues(intl, "webapp", "feedbacks", { count })}
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
    fetchingFeedbacks : state.webapp.fetchingFeedbacks,
    errorFeedbacks : state.webapp.errorFeedbacks,
    fetchedFeedbacks : state.webapp.fetchedFeedbacks,
    feedbacks : state.webapp.feedbacks,
    feedbacksPageInfo : state.webapp.feedbacksPageInfo
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({fetchFeedbacks}, dispatch);
};


export default withModulesManager(withHistory(connect(mapStateToProps, mapDispatchToProps)(injectIntl(FeedbackSearcher))));