import React, {Component} from "react"
import {withTheme, withStyles} from "@material-ui/core/styles";
import {Button, Grid} from "@material-ui/core";
import {TextInput, withModulesManager, withHistory, journalize, ProgressOrError} from "@openimis/fe-core";
import { connect } from "react-redux";
import {createNotice, updateNotice, getNotice} from "../actions"
import { injectIntl } from 'react-intl';
import { bindActionCreators } from "redux";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';



const useStyles = makeStyles((theme) => ({
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
  }));

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

        this.props.updateNotice(this.state.edited, this.props.notice_id)




        console.log("SAVEED");
    }

    setStateEdited =(e)=> {
        console.log('notice-page')
        console.log(this.props.notice_id);
        this.props.getNotice(this.props.notice_id);
    }

    componentDidMount(){
        if(this.props.notice_id){
            this.props.getNotice(this.props.notice_id);
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.submittingMutation && !this.props.submittingMutation){
            this.props.journalize(this.props.mutation);
        }
        console.log('prevProps', prevProps)
        console.log('props', this.props)
        console.log('prevState', prevState)
        if( this.props.notice ){
            if(!prevProps.notice){
                console.log(' hello ')
                this.setState({
                    edited : {
                         ...this.state.edited ,
                         id: this.props.notice.id,
                         title: this.props.notice.title,
                         description: this.props.notice.description,
                    }
                    //edited : { title : this.props.notice.title, description: this.props.notice.description},

                })
            }
        }
        return
    }
    
    updateAttribute = (k,v) => {
        this.setState((state)=> ({
            edited: {...state.edited, [k]: v}
        }),
         e => console.log('STATE' +JSON.stringify(this.state))
        )
    }

    
    render(){
        
        const {classes} = this.props;
        const {edited} = this.state;
        const {submittingMutation} = this.props;
        return(
            
            <div className={classes.root}>
                 <ProgressOrError progress={submittingMutation}  />

               <Grid container spacing={12}>
                    <Grid item  xs={4}>
                    <Paper className={classes.paper}>
                        <TextInput
                            module="webapp" label = "noticeForm.title"
                            value={edited.title}
                            required = {true}
                            inputProps={{
                                "maxLength": this.codeMaxLength,
                            }}
                            onChange={v=>this.updateAttribute("title", v)}
                        />
                        </Paper>
                    </Grid>
                    <Grid item  xs={4}>
                        <TextInput
                            module="webapp" label = "noticeForm.description"
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
                    {/* <Button onClick={e=>console.log(this)}>SAVE</Button> */}
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
   submittingMutation : state.webapp.submittingMutation,
    mutation : state.webapp.mutation,
    notice_id: props.match.params.notice_id,
    notice : state.webapp.notice, //get request of the notice detail

})
const mapDispatchToProps = dispatch => {
    return bindActionCreators({createNotice, updateNotice, getNotice, journalize}, dispatch);
}


export default injectIntl(withModulesManager(withHistory(connect(mapStateToProps, mapDispatchToProps)(
    withTheme(withStyles(styles)(NoticePage))
))));
