import React, {Component} from "react"
import {withTheme, withStyles} from "@material-ui/core/styles";
import {connect} from "react-redux";
import { bindActionCreators } from "redux";
import {FormattedMessage,TextInput, ProgressOrError, withModulesManager, withHistory, historyPush,  Table, FakeInput} from "@openimis/fe-core";
import { fetchNotices } from "../actions";
import { injectIntl } from 'react-intl';
import {Keyboard, ScreenShare,Loyalty } from "@material-ui/icons";
import { IconButton, Paper, Grid, Typography } from "@material-ui/core";


const styles = theme => ({
    page: theme.page,
});


class NoticesPage extends Component{
    
    state = {
        page: 0,
        pageSize : 10,
        afterCursor : null,
        beforeCursor : null,
        edited: {
            title: null
        }
    }

    componentDidMount(){
        // this.props.fetchNotices();
        console.log(this.props)
        this.query();
    }

    query = () => {
        let prms = [];
        prms.push(`title_Icontains: ${this.state.edited.title==null ? `""`: `"${this.state.edited.title}"`}`);
        prms.push( `first: ${this.state.pageSize}`);
        if(!!this.state.afterCursor){
            prms.push(`after: "${this.state.afterCursor}"`)
        }
        if(!!this.state.beforeCursor){
            prms.push(`before: "${this.state.beforeCursor}"`)
        }
        prms.push(`orderBy: ["-created_at"]`);
        this.props.fetchNotices(prms);

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
                afterCursor: props.noticesPageInfo.endCursor
            }),
            e=> this.query()
            )
        }
        else {
            if(nbr < this.state.page){
                this.setState( (state,props)=>({
                    page:state.page-1,
                    beforeCursor : props.noticesPageInfo.startCursor,
                    afterCursor : null
                } ),
                e => this.query()
                )
            }
        }
    }

    updateAttribute = (k,v) => {
        this.setState((state)=> ({
            edited: {...state.edited, [k]: v}
        }),
         e => this.query() //console.log('STATE' +JSON.stringify(this.state))
         
        )
    }

    editNotice = c => historyPush(this.props.modulesManager, this.props.history, "my_module.route.notice_edit", [c.id])

    render(){
        const {edited} = this.state;
        const { fetchingNotices,classes, errorNotices, notices, noticesPageInfo} = this.props;
        
        let headers = [
            "my_module.sn",
            "my_module.notice.title",
            "my_module.notice.description",
            "my_module.action"
        ]
        let itemFormatters = [
        (e, idx) => <FakeInput
            readOnly={true}
            value={idx+1}
            
        />,
            (e) => e.title,
            e => e.description,
            e => {
                return(
                    
                        <div>
                            <Loyalty  onClick={c => this.editNotice(e)} />
                        </div>
                
                );
            
            },
          
            
        ]
        var notice_header = "Published Notices"+noticesPageInfo.totalCount;

        return (
        <div className={classes.page}>
                <ProgressOrError progress={fetchingNotices} error={errorNotices} />
            
            <Grid container>
                    <Grid item>
                        <TextInput
                            module="my_module" label = "noticeForm.title"
                            value={edited.title}
                            required = {true}
                            inputProps={{
                                "maxLength": this.codeMaxLength,
                            }}
                            onChange={v=>this.updateAttribute("title", v)}
                        />
                    </Grid>
            </Grid>
            
            
              <Table
                  module = "my_module"
                  header = {notice_header}
                  headers = {headers}
                  itemFormatters = {itemFormatters}
                  items = {notices}
                  withPagination={true}
                  page = {this.state.page}
                  pageSize = {this.state.pageSize}
                  count = {noticesPageInfo.totalCount }
                  onChangePage={this.onChangePage}
                  onChangeRowsPerPage={this.onChangeRowsPerPage}
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
    noticesPageInfo : state.my_module.noticesPageInfo,
    

})
const mapDispatchToProps = dispatch => {
    return bindActionCreators({fetchNotices}, dispatch);
}

//export default withTheme(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(NoticesPage)))
export default injectIntl(withModulesManager(withHistory(connect(mapStateToProps, mapDispatchToProps)(
    withTheme(withStyles(styles)(NoticesPage))
))));