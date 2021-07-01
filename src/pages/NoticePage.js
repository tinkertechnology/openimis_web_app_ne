import React, {Component} from "react"
import {withTheme, withStyles} from "@material-ui/core/styles";
import {Button, Grid} from "@material-ui/core";
import {TextInput, withModulesManager, withHistory, journalize, ProgressOrError} from "@openimis/fe-core";
import { connect } from "react-redux";
import {createNotice, updateNotice, getNotice} from "../actions"
import { injectIntl } from 'react-intl';
import { bindActionCreators } from "redux";



const styles = theme => ({
    page: theme.page
})

class NoticePage extends Component {
    state = {
        edited : {
            title: '',
            description: '',
        }
    }
    save = e => {
        if(!this.props.notice_id){
            this.props.createNotice(this.state.edited)
            return
        }
        
        this.props.updateNotice(this.state.edited, this.props.id)




        console.log("SAVEED");
    }

    setStateEdited =(e)=> {
        console.log('notice-page')
        console.log(this.props.notice_id);
        this.props.getNotice(this.props.notice_id);
        if(this.props.notice){
            console.log('edited value being updated')
            
            this.setState({
                edited : {
                     ...this.state.edited ,
                     title: this.props.notice.title,
                     description: this.props.notice.description,
                }
                //edited : { title : this.props.notice.title, description: this.props.notice.description},

            })
            console.log('65',this.state, this.props);
            
        }
    }
    jpt = e => {
        console.log(this.state.edited)
        console.log(this.state, this.props)
    }
    updateAttribute = (k,v) => {
        this.setState((state)=> ({
            edited: {...state.edited, [k]: v}
        }),
         e => console.log('STATE' +JSON.stringify(this.state))
        )
    }

    // componentDidUpdate(prevProps, prevState,)
    componentDidMount(){
        setInterval(this.setStateEdited, 2000);
        
    }
    render(){
        const {classes} = this.props;
        const {edited} = this.state;
        const {notice_id, notice, fetchingNotices, errorNotices} = this.props;
        console.log('ediredwwad',this.state.edited);
        return(
            
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
                    <Grid item>
                        <TextInput
                            module="my_module" label = "noticeForm.description"
                            value={edited.description}
                            required = {true}
                            inputProps={{
                                "maxLength": this.codeMaxLength,
                            }}
                            onChange={v=>this.updateAttribute("description", v)}
                        />
                    </Grid>
                    <br />
                    <Button onClick={this.save}>SAVE</Button>
                    <Button onClick={this.jpt}>JPT</Button>
                </Grid>
            </div>
        )

    }
}
function abc(x, m){
    
    console.log(m,x);
    return x;
}
const mapStateToProps = (state, props) => ({
   // submittingMutation : state.my_module.submittingMutation,
    //mutation : state.my_module.mutation,
    notice_id: props.match.params.notice_id,
    notice : state.my_module.notice, //get request of the notice detail
    fetchingNotices : state.my_module.fetchingNotices,
    errorNotices : state.my_module.errorNotices,
    s: abc(state, "state"),
    p : abc(props, "props")
}) 
const mapDispatchToProps = dispatch => {
    return bindActionCreators({createNotice, updateNotice, getNotice}, dispatch);
}


export default injectIntl(withModulesManager(withHistory(connect(mapStateToProps, mapDispatchToProps)(
    withTheme(withStyles(styles)(NoticePage))
))));