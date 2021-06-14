import React, {Component} from "react"
import {withTheme, withStyles} from "@material-ui/core/styles";
import {Button, Grid} from "@material-ui/core";
import {TextInput, withModulesManager, withHistory, journalize} from "@openimis/fe-core";
import { connect } from "react-redux";
import {createNotice} from "../actions"
import { injectIntl } from 'react-intl';
import { bindActionCreators } from "redux";



const styles = theme => ({
    page: theme.page
})

class NoticePage extends Component {
    state = {
        edited : {}
    }
    save = e => {
        this.props.createNotice(this.state.edited, `creating ${this.state.edited.title}`)
        console.log("SAVEED");
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
        console.log('notice-page')
    }
    render(){
        const {classes} = this.props;
        const {edited} = this.state;
    
        return(
            <div className={classes.page}>
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
                </Grid>
            </div>
        )

    }
}

const mapStateToProps = state => ({
    submittingMutation : state.my_module.submittingMutation,
    mutation : state.my_module.mutation,

}) 
const mapDispatchToProps = dispatch => {
    return bindActionCreators({createNotice}, dispatch);
}


export default injectIntl(withModulesManager(withHistory(connect(mapStateToProps, mapDispatchToProps)(
    withTheme(withStyles(styles)(NoticePage))
))));