import React, {Component} from "react"
import {withTheme, withStyles} from "@material-ui/core/styles";
import {Button, Grid} from "@material-ui/core";
import {TextInput, withModulesManager, withHistory, journalize} from "@openimis/fe-core";
import { connect } from "react-redux";
import {createNotice, updateNotice, getNotice} from "../actions"
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
        if(!this.props.notice_id){
            this.props.createNotice(this.state.edited)
            return
        }

        this.props.updateNotice(this.state.edited, this.props.notice_id)




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
        console.log(this.props.notice_id);
        this.props.getNotice(this.props.notice_id);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
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

        //ref:
        // if (prevProps.fetchedClaim !== this.props.fetchedClaim && !!this.props.fetchedClaim) {
        //     var claim = this.props.claim;
        //     this.setState(
        //         { claim, claim_uuid: this.props.claim.uuid, lockNew: false, newClaim: false },
        //         this.props.claimHealthFacilitySet(this.props.claim.healthFacility)
        //     );
        // }
    }

    render(){
        const {classes} = this.props;
        const {edited} = this.state;
        const {notice_id, notice} = this.props;

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
                    <Button onClick={e=>console.log(this)}>SAVE</Button>
                </Grid>
            </div>
        )

    }
}

const mapStateToProps = (state, props) => ({
    submittingMutation : state.my_module.submittingMutation,
    mutation : state.my_module.mutation,
    notice_id: props.match.params.notice_id,
    notice : state.my_module.notice, //get request of the notice detail

})
const mapDispatchToProps = dispatch => {
    return bindActionCreators({createNotice, updateNotice, getNotice}, dispatch);
}


export default injectIntl(withModulesManager(withHistory(connect(mapStateToProps, mapDispatchToProps)(
    withTheme(withStyles(styles)(NoticePage))
))));
