import React, {Component} from "react"
import {withTheme, withStyles} from "@material-ui/core/styles";
import {connect} from "react-redux";
import { bindActionCreators } from "redux";
import {FormattedMessage,TextInput, ProgressOrError, withModulesManager, withHistory, Table, FakeInput} from "@openimis/fe-core";
import { fetchFeedbacks } from "../actions";
import { injectIntl } from 'react-intl';
import {Keyboard, ScreenShare} from "@material-ui/icons";
import { IconButton, Paper, Grid, Typography } from "@material-ui/core";


const styles = theme => ({
    page: theme.page,
});


class FeedbackPage extends Component{

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
        this.query();
    }

    query = () => {
        let prms = [];
        // prms.push(`title_Icontains: ${this.state.edited.title==null? "": this.state.edited.title}`);
        prms.push( `first: ${this.state.pageSize}`);
        if(!!this.state.afterCursor){
            prms.push(`after: "${this.state.afterCursor}"`)
        }
        if(!!this.state.beforeCursor){
            prms.push(`before: "${this.state.beforeCursor}"`)
        }
        prms.push(`orderBy: ["-id"]`);
        this.props.fetchFeedbacks(prms);

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
                afterCursor: props.FeedbackPageInfo.endCursor
            }),
            e=> this.query()
            )
        }
        else {
            if(nbr < this.state.page){
                this.setState( (state,props)=>({
                    page:state.page-1,
                    beforeCursor : props.FeedbackPageInfo.startCursor,
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


    render(){
        const {edited} = this.state;

        const { fetchingFeedbacks,classes, errorFeedbacks, feedbacks, feedbacksPageInfo} = this.props;
        
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
            (e) => e.fullname,
            e => e.emailAddress,
            e=>e.mobileNumbeer,
            e=>e. queries,
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
        var notice_header = "Published Notices" //+FeedbackPageInfo.totalCount;

        return (
        <div className={classes.page}>
                <ProgressOrError progress={fetchingFeedbacks} error={errorFeedbacks} />
            
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
                  items = {feedbacks}
                  withPagination={true}
                  page = {this.state.page}
                  pageSize = {this.state.pageSize}
                  count = {feedbacksPageInfo.totalCount }
                  onChangePage={this.onChangePage}
                  onChangeRowsPerPage={this.onChangeRowsPerPage}
              />
            
        </div>
        )
    }
}
const mapStateToProps = state => ({
    fetchingFeedbacks : state.my_module.fetchingFeedbacks,
    errorFeedbacks : state.my_module.errorFeedbacks,
    fetchedFeedbacks : state.my_module.fetchedFeedbacks,
    feedbacks : state.my_module.feedbacks,
    feedbacksPageInfo : state.my_module.feedbacksPageInfo

})
const mapDispatchToProps = dispatch => {
    return bindActionCreators({fetchFeedbacks}, dispatch);
}

//export default withTheme(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(FeedbackPage)))
export default injectIntl(withModulesManager(withHistory(connect(mapStateToProps, mapDispatchToProps)(
    withTheme(withStyles(styles)(FeedbackPage))
))));