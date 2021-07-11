import React, {Component, Fragment} from "react"
import {withTheme, withStyles} from "@material-ui/core/styles";
import {connect} from "react-redux";
import { bindActionCreators } from "redux";
import {FormattedMessage,TextInput,PublishedComponent, ProgressOrError, withModulesManager, withHistory, Table, FakeInput} from "@openimis/fe-core";
import { fetchTemporaryRegistration } from "../actions";
import { injectIntl } from 'react-intl';
import {Keyboard, ScreenShare} from "@material-ui/icons";
import {
    IconButton, Paper, Grid, Typography, Container, FormLabel
} from "@material-ui/core";
import PageviewIcon from '@material-ui/icons/Pageview';
import CloseIcon from '@material-ui/icons/Close';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import { pink } from '@material-ui/core/colors';

import {
    Dialog, DialogTitle, Divider, Button,
    DialogActions, DialogContent, Link
} from "@material-ui/core";

const styles = theme => ({
    page: theme.page,
});

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

class RegistrationPage extends Component{

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

    componentDidMount(){
        // this.props.fetchNotices();
        this.query();
    }

    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     console.log('prevProps', prevProps)
    //     console.log('props', this.props)
    //     console.log('prevState', prevState)
    //     if( this.props.voucherPayments ){
    //         if(!prevProps.voucherPayments){
    //             console.log(' hello ')
    //             this.setState({
                    
    //                 //edited : { title : this.props.notice.title, description: this.props.notice.description},

    //             })
    //         }
    //     }
    //     return

    //     //ref:
    //     // if (prevProps.fetchedClaim !== this.props.fetchedClaim && !!this.props.fetchedClaim) {
    //     //     var claim = this.props.claim;
    //     //     this.setState(
    //     //         { claim, claim_uuid: this.props.claim.uuid, lockNew: false, newClaim: false },
    //     //         this.props.claimHealthFacilitySet(this.props.claim.healthFacility)
    //     //     );
    //     // }
    // }

    query = () => {
        let prms = [];
        // prms.push(`insuree_ChfId_Icontains: ${this.state.edited.chfid==null ? `""`: `"${this.state.edited.chfid}"`},
        //      insuree_OtherNames_Icontains: ${this.state.edited.insuree_name==null ? `""`: `"${this.state.edited.insuree_name}"`}`);
        // prms.push()
        // prms.push( `first: ${this.state.pageSize}`);
        if(!!this.state.afterCursor){
            prms.push(`after: "${this.state.afterCursor}"`)
        }
        if(!!this.state.beforeCursor){
            prms.push(`before: "${this.state.beforeCursor}"`)
        }
        prms.push(`orderBy: ["-created_at"]`);
        this.props.fetchTemporaryRegistration(prms);

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

    previewVoucher = c => { console.log('c',c); this.setState({iframesrc: `http://192.168.31.250:8000/api/webapp/temp_insuree_reg/?id=${c.id}`}); }
    previewVoucherCloseFn = c=> { console.log(c); this.setState({iframesrc: null}); }


    render(){

        const { fetchingTempRegs,classes, errorTempRegs, tempRegs, tempRegsPageInfo} = this.props;
        let headers = [
            "my_module.sn",
            "my_module.json",
            "my_module.action"
        ]
        let itemFormatters = [
        (e, idx) => <FakeInput
            readOnly={true}
            value={idx+1}
            
        />,
            (e) => e.id,
            // e => e.json,
             e => {
                return(
                    
                        <div>
                            <PageviewIcon  onClick={c => this.previewVoucher(e)} />
                        </div>
                
                );
            
            },
          
            
        ]
        var notice_header = "Registrations"+tempRegsPageInfo.totalCount;

        return (
        <div className={classes.page}>
                <ProgressOrError progress={fetchingTempRegs} error={errorTempRegs} />
            <AttachmentsDialogPreview iframesrc={this.state.iframesrc} hide={this.previewVoucherCloseFn}/>
            <Paper className={classes.paper}>
            <Grid container>

                    <Grid item xs={6} className={classes.item}>
                            <PublishedComponent pubRef="core.DatePicker"
                                value=""
                                module="my_module"
                                label="Submission Date"
                                onChange={d => this.dateChange([
                                    {
                                        id: 'visitDateFrom',
                                        value: d,
                                        filter: !!d ? `dateFrom: "${d}"` : null
                                    }
                                ])}
                            />
                        </Grid>
            </Grid>


              <Table
                  module = "my_module"
                  header = {notice_header}
                  headers = {headers}
                  itemFormatters = {itemFormatters}
                  items = {tempRegs}
                  withPagination={true}
                  page = {this.state.page}
                  pageSize = {this.state.pageSize}
                  count = {tempRegsPageInfo.totalCount }
                  onChangePage={this.onChangePage}
                  onChangeRowsPerPage={this.onChangeRowsPerPage}
              />
            </Paper>
        </div>
        )
    }
}
const mapStateToProps = state => ({
    fetchingTempRegs : state.my_module.fetchingTempRegs,
    errorTempRegs : state.my_module.errorTempRegs,
    fetchedTempRegs : state.my_module.fetchedTempRegs,
    tempRegs : state.my_module.tempRegs,
    tempRegsPageInfo : state.my_module.tempRegsPageInfo

})
const mapDispatchToProps = dispatch => {
    return bindActionCreators({fetchTemporaryRegistration}, dispatch);
}

export default injectIntl(withModulesManager(withHistory(connect(mapStateToProps, mapDispatchToProps)(
    withTheme(withStyles(styles)(RegistrationPage))
))));