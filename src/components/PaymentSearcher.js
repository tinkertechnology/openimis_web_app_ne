import React, { Component, Fragment } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import AttachIcon from "@material-ui/icons/AttachFile";
import {
    IconButton, Tooltip
} from "@material-ui/core";
import {
    withModulesManager, formatMessageWithValues, formatDateFromISO, formatMessage,
    withHistory,
    Searcher,
} from "@openimis/fe-core";

import { fetchPayments } from "../actions";

import PaymentFilter from "./PaymentFilter";

import Avatar from '@material-ui/core/Avatar';
import PageviewIcon from '@material-ui/icons/Pageview';
import SaveIcon from "@material-ui/icons/SaveAlt";
import DeleteIcon from "@material-ui/icons/Delete";
import FileIcon from "@material-ui/icons/Add";
import CloseIcon from '@material-ui/icons/Close';
import ArrowForwardRoundedIcon from '@material-ui/icons/ArrowForwardRounded';
import ArrowBackRoundedIcon from '@material-ui/icons/ArrowBackRounded';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import { pink } from '@material-ui/core/colors';

const NOTICE_SEARCHER_CONTRIBUTION_KEY = "webapp.NoticeSearcher";

class AttachmentsDialogPreview extends Component {
    attachments = [];
    state = {
        visible: false,
        i:0,
        scale: 0.5,

    }
    componentDidMount() {        
        var thisRef = this;
    }
    show(){
        //this.setState({visible: !this.state.visible})
        this.setState({visible: !this.state.visible})
    }
    hide(){
        this.props.hide()
        //this.setState({previewAttachment: null})
    }
    changeScale = (i) => {
        i = this.state.scale+i;
        i = (i < 0.1) ? 0.1 : i;
        i = (i > 1 ) ? 1 : i;
        this.setState({scale: i})
    }
    getUrl(attachment){
        console.log(attachment);
        return attachment.voucher;
        return 'https://picsum.photos/seed/1/1000/1000';
        var url = new URL(`${window.location.origin}${baseApiUrl}/claim/attach`);
        url.search = new URLSearchParams({ id: decodeId(attachment.id) });
        return url;
    }

     styles = {
        position: "fixed",
        width: "100vw",
        height: "100vh",
        top: "0",
        left: "0",
        background: "#000000dd",
        zIndex: "9999"
    };      

  render() {
      const {urls, attachments, previewAttachment} = this.props; //extract url from images
      //console.log('attachments', attachments);
      this.attachments = attachments;
      //console.log(urls, this.props);
    return <Fragment>
       { (previewAttachment !=null) && (
        <div style={this.styles}>

            
            <center>
               <img src={this.getUrl(previewAttachment)} style={{height:"80vh", width:"80vw", transform: `scale(${this.state.scale})`}}/> 
               </center>
               <Divider />
               
               <center>
                    <ZoomInIcon onClick={e => this.changeScale(0.1)} />
                    <ZoomOutIcon onClick={e => this.changeScale(-0.1)} />
                    <CloseIcon onClick={e => this.hide()} />  
               </center>  
        </div>
       )}
    
     </Fragment>
  }
}

class PaymentSearcher extends Component {

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
        this.props.fetchPayments(
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
            "webapp.payment.code",
            "webapp.payment.name",
            "webapp.Insuree",
            "webapp.chfid",
            "webapp.action"
        ];

        return h;
    }

    sorts = (filters) => {
        var results = [
            ['id', true],
            ['voucher', true],
            ['insuree_Chfid', true],
            ['insuree_LastName', true],
        ];

        return results;
    }

    itemFormatters = () => {
        var formatters = [
            e => e.id,
            e => e.voucher,
            e => this.getName(e),
            e => this.getInsuree(e, 'chfId'),
        ]

        // formatters.push(
        //     e => (
        //         <IconButton onClick={e => this.previewVoucher(e)} > <AttachIcon /></IconButton >
        //     )
        // )

        formatters.push(
            e => (
                <PageviewIcon  onClick={c => this.previewVoucher(e)} />
            )
        )

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
                    FilterPane={PaymentFilter}
                    filterPaneContributionsKey={filterPaneContributionsKey}
                    items={voucherPayments}
                    itemsPageInfo={voucherPaymentsPageInfo}
                    fetchingItems={fetchingvoucherPayments}
                    fetchedItems={fetchedvoucherPayments}
                    errorItems={errorvoucherPayments}
                    contributionKey={NOTICE_SEARCHER_CONTRIBUTION_KEY}
                    tableTitle={formatMessageWithValues(intl, "webapp", "paymentSummaries", { count })}
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