import React, {Component, Fragment} from "react"
import {withTheme, withStyles} from "@material-ui/core/styles";
import {connect} from "react-redux";
import { bindActionCreators } from "redux";
import {FormattedMessage, ProgressOrError, withModulesManager, withHistory, Table, FakeInput} from "@openimis/fe-core";
import { fetchPayments } from "../actions";
import { injectIntl } from 'react-intl';
import {Keyboard, ScreenShare} from "@material-ui/icons";
import {
    IconButton, Paper, Grid, Typography
} from "@material-ui/core";
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
        scale: 0.5
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

class PaymentsPage extends Component{

    state = {
        previewAttachment: null,
        page: 0,
        pageSize : 10,
        afterCursor : null,
        beforeCursor : null,
    }

    componentDidMount(){
        // this.props.fetchNotices();
        this.query();
    }

    query = () => {
        let prms = [];
        prms.push( `first: ${this.state.pageSize}`);
        if(!!this.state.afterCursor){
            prms.push(`after: "${this.state.afterCursor}"`)
        }
        if(!!this.state.beforeCursor){
            prms.push(`before: "${this.state.beforeCursor}"`)
        }
        prms.push(`orderBy: ["-created_at"]`);
        this.props.fetchPayments(prms);

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
    render(){

        const { fetchingvoucherPayments,classes, errorvoucherPayments, voucherPayments, voucherPaymentsPageInfo} = this.props;
        
        let headers = [
            "my_module.sn",
            "my_module.code",
            "my_module.name",
            "my_module.action"
        ]
        let itemFormatters = [
        (e, idx) => <FakeInput
            readOnly={true}
            value={idx+1}
            
        />,
            (e) => e.id,
            e => e.voucher,
             e => {
                return(
                    
                        <div>
                            <PageviewIcon  onClick={c => this.previewVoucher(e)} />
                        </div>
                
                );
            
            },
          
            
        ]
        var notice_header = "Published Notices"+voucherPaymentsPageInfo.totalCount;

        return (
        <div className={classes.page}>
                <ProgressOrError progress={fetchingvoucherPayments} error={errorvoucherPayments} />
            <AttachmentsDialogPreview previewAttachment={this.state.previewAttachment} hide={this.previewVoucherCloseFn}/>
            <Paper className={classes.paper}>
              <Table
                  module = "my_module"
                  header = {notice_header}
                  headers = {headers}
                  itemFormatters = {itemFormatters}
                  items = {voucherPayments}
                  withPagination={true}
                  page = {this.state.page}
                  pageSize = {this.state.pageSize}
                  count = {voucherPaymentsPageInfo.totalCount }
                  onChangePage={this.onChangePage}
                  onChangeRowsPerPage={this.onChangeRowsPerPage}
              />
            </Paper>
        </div>
        )
    }
}
const mapStateToProps = state => ({
    fetchingvoucherPayments : state.my_module.fetchingvoucherPayments,
    errorvoucherPayments : state.my_module.errorvoucherPayments,
    fetchedvoucherPayments : state.my_module.fetchedvoucherPayments,
    voucherPayments : state.my_module.voucherPayments,
    voucherPaymentsPageInfo : state.my_module.voucherPaymentsPageInfo

})
const mapDispatchToProps = dispatch => {
    return bindActionCreators({fetchPayments}, dispatch);
}

//export default withTheme(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(PaymentsPage)))
export default injectIntl(withModulesManager(withHistory(connect(mapStateToProps, mapDispatchToProps)(
    withTheme(withStyles(styles)(PaymentsPage))
))));