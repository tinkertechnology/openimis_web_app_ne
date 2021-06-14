import React, {Component} from "react"
import {withTheme, withStyles} from "@material-ui/core/styles";
import {connect} from "react-redux";
import { bindActionCreators } from "redux";
import {FormattedMessage, ProgressOrError, withModulesManager, withHistory, Table} from "@openimis/fe-core";
import { fetchNotices } from "../actions";
import { injectIntl } from 'react-intl';
import {Keyboard, ScreenShare} from "@material-ui/icons";


const styles = theme => ({
    page: theme.page,
});


class NoticesPage extends Component{

    state = {
        page: 0,
        pageSize : 10,
        afterCursor : null,
        beforeCursor : null,
    }

    componentDidMount(){
        this.props.fetchNotices();
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
        prms.push(`orderBy: ["id"]`);
        this.props.fetchNotices(prms);

    }

    render(){
        const {classes, fetchingNotices, errorNotices, notices, noticesPageInfo} = this.props;
        let headers = [
            "my_module.code",
            "my_module.name",
            "my_module.action"
        ]
        let itemFormatters = [
            e => e.title,
            e => e.description,
            e => {
                return(
                    <div>
                <div><Keyboard  onClick="" /></div>
                &nbsp;
                <div><Keyboard  onClick=""/></div>
                </div>
                
                );
            
            },
          
            
        ]
        var notice_header = "Published Notices"+noticesPageInfo.totalCount;

        return (
            <div className={classes.page}>
                <ProgressOrError progress={fetchingNotices} error={errorNotices} />
              <Table
                  module = "my_module"
                  header = {notice_header}
                  headers = {headers}
                  itemFormatters = {itemFormatters}
                  items = {notices}
                  page = {this.state.page}
                  pageSize = {this.state.pageSize}
                  count = {noticesPageInfo.totalCount }
              />
            </div>
        )
    }
}
const mapStateToProps = state => ({
    fetchingNotices : state.my_module.fetchingNotices,
    errorNotices : state.my_module.errorNotices,
    fetchedNotices : state.my_module.fetchedNotices,
    notices : state.my_module.notices,
    noticesPageInfo : state.my_module.noticesPageInfo

})
const mapDispatchToProps = dispatch => {
    return bindActionCreators({fetchNotices}, dispatch);
}

//export default withTheme(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(NoticesPage)))
export default injectIntl(withModulesManager(withHistory(connect(mapStateToProps, mapDispatchToProps)(
    withTheme(withStyles(styles)(NoticesPage))
))));