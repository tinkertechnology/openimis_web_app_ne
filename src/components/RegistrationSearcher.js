import React, { Component, Fragment } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import {
    withModulesManager, formatMessageWithValues, formatDateFromISO, formatMessage,
    withHistory, 
    Searcher, decodeId
} from "@openimis/fe-core";
import { fetchTemporaryRegistration } from "../actions";
import RegistrationFilter from "./RegistrationFilter";

import PageviewIcon from '@material-ui/icons/Pageview';
import CloseIcon from '@material-ui/icons/Close';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import { pink } from '@material-ui/core/colors';


const REGISTRATION_SEARCHER_CONTRIBUTION_KEY = "webapp.RegistrationSearcher";

//http://localhost:3000/webapp/registrations?previewDomain=http://localhost:8055

function getUrlParameterRegistrationPage(sParam) {
    console.log('getUrlParameter');
  
      var sPageURL = decodeURIComponent(window.location.search.substring(1)),
          sURLVariables = sPageURL.split('&'),
          sParameterName,
          i;
  
      for (i = 0; i < sURLVariables.length; i++) {
          sParameterName = sURLVariables[i].split('=');
  
          if (sParameterName[0] === sParam) {
              return sParameterName[1] === undefined ? true : sParameterName[1];
          }
      }
  }
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
          //this.setState({iframesrc: null})
      }
      changeScale = (i) => {
          i = this.state.scale+i;
          i = (i < 0.1) ? 0.1 : i;
          i = (i > 1 ) ? 1 : i;
          this.setState({scale: i})
      }
      getUrl(attachment){
          var previewDomain=getUrlParameterRegistrationPage('previewDomain');
          if (previewDomain){ return previewDomain+attachment; }
          return attachment;
  
          console.log(attachment);
          return attachment
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
        const {urls, attachments, iframesrc} = this.props; //extract url from images
        //console.log('attachments', attachments);
        this.attachments = attachments;
        //console.log(urls, this.props);
      return <Fragment>
         { (iframesrc !=null) && (
          <Container>
          <div style={this.styles}>
  
              
              <center>
              <iframe src={this.getUrl(iframesrc)} style={{height:"90vh", width:"90vw"}}/> 
              </center>
                 
                 {/* <iframe src="{this.getUrl(iframesrc)} style={{height:"80vh", width:"80vw", transform: `scale(${this.state.scale})`}}" /> */}
               
                 <Divider />
                 
                 <center>
                      <ZoomInIcon onClick={e => this.changeScale(0.1)} />
                      <ZoomOutIcon onClick={e => this.changeScale(-0.1)} />
                      <CloseIcon onClick={e => this.hide()} />  
                      <Grid item xs={6}>
                          <Paper>
                          <Grid container>
                              <Grid item>
                              <Button class="btn btn-primary">Approve</Button>
                              
                              </Grid>
                          </Grid>
                          </Paper>
                      </Grid>
                 </center>  
          </div>
  
  
          </Container>
         )}
      
       </Fragment>
    }
  }

class RegistrationSearcher extends Component {

    state = {
        iframesrc: null,
        page: 0,
        pageSize : 10,
        afterCursor : null,
        beforeCursor : null,
        edited: {
            date: null
        },
    }

    dateChange = d => {
        console.log(d);
        this.setState((state)=> ({
            edited: {...state.edited, ['date']: d}
            
        }),
         e => this.query() 
        )
    }


    constructor(props) {
        super(props);
        this.rowsPerPageOptions = props.modulesManager.getConf("fe-webapp", "registrationFilter.rowsPerPageOptions", [10, 20, 50, 100]);
        this.defaultPageSize = props.modulesManager.getConf("fe-webapp", "registrationFilter.defaultPageSize", 10);
    }
    

    componentDidUpdate(prevProps) {
        if (prevProps.submittingMutation && !this.props.submittingMutation) {
            this.props.journalize(this.props.mutation);
            this.setState({ reset: this.state.reset + 1 });
        } else if (!prevProps.confirmed && this.props.confirmed) {
            this.state.confirmedAction();
        }
    }

    fetch = (prms) => {
        this.props.fetchTemporaryRegistration(
            // this.props.modulesManager,
            prms
        )
    }

    // rowIdentifier = (r) => r.id

    filtersToQueryParams = (state) => {
        let prms = Object.keys(state.filters)
            .filter(f => !!state.filters[f]['filter'])
            .map(f => state.filters[f]['filter']);

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
                afterCursor: props.tempRegsPageInfo.endCursor
            }),
            e=> this.query()
            )
        }
        else {
            if(nbr < this.state.page){
                this.setState( (state,props)=>({
                    page:state.page-1,
                    beforeCursor : props.tempRegsPageInfo.startCursor,
                    afterCursor : null
                } ),
                e => this.query()
                )
            }
        }
    }

    previewVoucher = c => { 
        console.log(c); 
        var iDecodeId = decodeId(c.id);
        this.setState({iframesrc: `/api/webapp/temp_insuree_reg/?id=${c.id}&decodeId=${iDecodeId}`}); 
    }

    previewVoucherCloseFn = c=> { 
        console.log(c); 
        this.setState({iframesrc: null}); 
        this.query(); 
    }

    getStatus = (c) => {
        if(c.isApproved==true){
            return "Approved";
        }
        return "Pending"
    }

    headers = () => {
        var h = [
            // "webapp.sn",
            "webapp.registration.temp_id",
            "webapp.registration.phone",
            "webapp.registration.name",
            "webapp.registration.status",
            "webapp.registration.action"
        ]
        return h;
    }

    sorts = (filters) => {
        var results = [
            ['temp_id', true],
            ['phoneNumber', true],
            ['nameOfHead', true],
            ['status', true],
        ];

        return results;
    }

    itemFormatters = (filters) => {
        var formatters = [
            e => e.id,
            e => e.phoneNumber==null ? "N/A" : e.phoneNumber,
            e => e.nameOfHead==null ? "N/A" : e.nameOfHead,
            e => this.getStatus(e),
        ]

        formatters.push(
            e => (
                <PageviewIcon onClick={c => this.previewVoucher(e)} />
            )
        )

        return formatters;
    }


    render() {
        const { 
            intl,
            tempRegs, tempRegsPageInfo, fetchingTempRegs, fetchedTempRegs, errorTempRegs,
            filterPaneContributionsKey, cacheFiltersKey
        } = this.props;

        let count = tempRegsPageInfo.totalCount;

        return (
            <Fragment>
                {/* <ProgressOrError progress={fetchingTempRegs} error={errorTempRegs} /> */}
                <AttachmentsDialogPreview iframesrc={this.state.iframesrc} hide={this.previewVoucherCloseFn}/>
                <Searcher
                    module="webapp"
                    cacheFiltersKey={cacheFiltersKey}
                    FilterPane={RegistrationFilter}
                    filterPaneContributionsKey={filterPaneContributionsKey}
                    items={tempRegs}
                    itemsPageInfo={tempRegsPageInfo}
                    fetchingItems={fetchingTempRegs}
                    fetchedItems={fetchedTempRegs}
                    errorItems={errorTempRegs}
                    contributionKey={REGISTRATION_SEARCHER_CONTRIBUTION_KEY}
                    tableTitle={formatMessageWithValues(intl, "webapp", "registrationSummaries", { count })}
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
    fetchingTempRegs : state.webapp.fetchingTempRegs,
    errorTempRegs : state.webapp.errorTempRegs,
    fetchedTempRegs : state.webapp.fetchedTempRegs,
    tempRegs : state.webapp.tempRegs,
    tempRegsPageInfo : state.webapp.tempRegsPageInfo
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({fetchTemporaryRegistration}, dispatch);
};


export default withModulesManager(withHistory(connect(mapStateToProps, mapDispatchToProps)(injectIntl(RegistrationSearcher))));