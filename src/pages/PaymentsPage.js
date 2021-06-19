import React, {Component} from "react"
import {withTheme, withStyles} from "@material-ui/core/styles";
import {connect} from "react-redux";
import { bindActionCreators } from "redux";
import {FormattedMessage, ProgressOrError, withModulesManager, withHistory, Table, FakeInput} from "@openimis/fe-core";
import { fetchPayments } from "../actions";
import { injectIntl } from 'react-intl';
import {Keyboard, ScreenShare} from "@material-ui/icons";
import { IconButton, Paper, Grid, Typography } from "@material-ui/core";


const styles = theme => ({
    page: theme.page,
});


class PaymentsPage extends Component{

    state = {
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
                <div><Keyboard  /></div>
                &nbsp;
                <div><Keyboard /></div>
                </div>
                
                );
            
            },
          
            
        ]
        var notice_header = "Published Notices"+voucherPaymentsPageInfo.totalCount;

        return (
        <div className={classes.page}>
                <ProgressOrError progress={fetchingvoucherPayments} error={errorvoucherPayments} />
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