import React, { Component, Fragment } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';

import {
    withModulesManager, formatMessageWithValues, formatDateFromISO, formatMessage,
    withHistory, 
    Searcher
} from "@openimis/fe-core";
import { fetchPayments } from "../actions";
// import FeedbackFilter from "./FeedbackFilter";


const PAYMENT_SEARCHER_CONTRIBUTION_KEY = "webapp.FeedbackSearcher";

class PaymentSearcher extends Component {

    state = {
        open: false,
        id: null,
        confirmedAction: null,
        reset: 0,
    }

    constructor(props) {
        super(props);
        this.rowsPerPageOptions = props.modulesManager.getConf("fe-webapp", "paymentsFilter.rowsPerPageOptions", [10, 20, 50, 100]);
        this.defaultPageSize = props.modulesManager.getConf("fe-webapp", "paymentsFilter.defaultPageSize", 10);
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
        this.props.fetchPayments(
            this.props.modulesManager,
            prms
        )
    }

    // rowIdentifier = (r) => r.id

    // filtersToQueryParams = (state) => {
    //     let prms = Object.keys(state.filters)
    //         .filter(f => !!state.filters[f]['filter'])
    //         .map(f => state.filters[f]['filter']);
    //     // let prms = [];
    //     // prms.push(`insuree_ChfId_Icontains: ${this.state.edited.chfid==null ? `""`: `"${this.state.edited.chfid}"`},
    //     //          insuree_OtherNames_Icontains: ${this.state.edited.insuree_name==null ? `""`: `"${this.state.edited.insuree_name}"`}`);
    //     prms.push( `first: ${this.state.pageSize}`);
    //     if (!!state.afterCursor) {
    //         prms.push(`after: "${state.afterCursor}"`)
    //     }
    //     if (!!state.beforeCursor) {
    //         prms.push(`before: "${state.beforeCursor}"`)
    //     }
    //     if (!!state.orderBy) {
    //         // prms.push(`orderBy: ["${state.orderBy}"]`);
    //         prms.push(`orderBy: ["-created_at"]`);
    //     }
    //     return prms;
    // }

    updateAttribute = (k,v) => {
        console.log('STATE' +JSON.stringify(this.state))
        this.setState((state)=> ({
            edited: {...state.edited, [k]: v}
            
        }),
         e => this.query() 
         
         
        )
    }


    onChangeRowsPerPage=(count)=>{
        this.setState(
            {
                pageSize:count,
                page:0,
                afterCursor: null,
                beforeCursor: null
            },
            e => this.query()
        )
    }

    onChangePage =(page, nbr) =>{
        if(nbr > this.state.page){
            this.setState((state, props) => ({
                page: state.page+1,
                beforeCursor: null,
                afterCursor: props.PaymentsPageInfo.endCursor
            }),
            e=> this.query()
            )
        }
        else {
            if(nbr < this.state.page){
                this.setState( (state,props)=>({
                    page:state.page-1,
                    beforeCursor : props.PaymentsPageInfo.startCursor,
                    afterCursor : null
                } ),
                e => this.query()
                )
            }
        }
    }

    previewVoucher = c => { console.log(c); this.setState({previewAttachment: c}); }
    previewVoucherCloseFn = c=> { console.log(c); this.setState({previewAttachment: null}); }
    getName = c => {
        return c 
            ? c.insuree
                ? c.insuree.otherNames +' '+ c.insuree.lastName
                : ""
            :""; 
        
    }
    getInsuree = (c, k) => {
        return c 
            ? c.insuree
                ? c.insuree[k]
                : ""
            :""; 
        
    }

    headers = () => {
        var h = [
            "webapp.sn",
            "webapp.code",
            "webapp.name",
            "webapp.Insuree",
            "webapp.chfid",
            "webapp.action"
        ]
        return h;
    }

    // sorts = (filters) => {
    //     var results = [
    //         ['code', true],
    //         ['name', true],
    //         ['Insuree', true],
    //         ['chfid', true],
    //     ];

    //     return results;
    // }

    itemFormatters = (filters) => {
        var formatters = [
            // voucherPayments => voucherPayments.id,
            // voucher => voucher.voucher,
            // voucherPayments => voucherPayments.name,
            // voucherPayments => voucherPayments.Insuree,
            // voucherPayments => voucherPayments.chfid,
        ]

        return formatters;
    }


    render() {
        const { intl,
            voucherPayments, voucherPaymentsPageInfo, fetchingvoucherPayments, fetchedvoucherPayments, errorvoucherPayments,
            filterPaneContributionsKey, cacheFiltersKey
        } = this.props;

        let count = voucherPaymentsPageInfo.totalCount;

        return (
            <Fragment>
                <Searcher
                    module="webapp"
                    cacheFiltersKey={cacheFiltersKey}
                    // FilterPane={FeedbackFilter}
                    // filterPaneContributionsKey={filterPaneContributionsKey}
                    items={voucherPayments}
                    itemsPageInfo={voucherPaymentsPageInfo}
                    fetchingItems={fetchingvoucherPayments}
                    fetchedItems={fetchedvoucherPayments}
                    errorItems={errorvoucherPayments}
                    contributionKey={PAYMENT_SEARCHER_CONTRIBUTION_KEY}
                    tableTitle={formatMessageWithValues(intl, "webapp", "voucherPayments", { count })}
                    rowsPerPageOptions={this.rowsPerPageOptions}
                    defaultPageSize={this.defaultPageSize}
                    fetch={this.fetch}
                    filtersToQueryParams={this.filtersToQueryParams}
                    
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
    fetchingvoucherPayments : state.webapp.fetchingvoucherPayments,
    errorvoucherPayments : state.webapp.errorvoucherPayments,
    fetchedvoucherPayments : state.webapp.fetchedvoucherPayments,
    voucherPayments : state.webapp.voucherPayments,
    voucherPaymentsPageInfo : state.webapp.voucherPaymentsPageInfo
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({fetchPayments}, dispatch);
};


export default withModulesManager(withHistory(connect(mapStateToProps, mapDispatchToProps)(injectIntl(PaymentSearcher))));