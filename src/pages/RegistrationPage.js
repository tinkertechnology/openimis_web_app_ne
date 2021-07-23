import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import { withTheme, withStyles } from "@material-ui/core/styles";
import { historyPush, withModulesManager, withHistory } from "@openimis/fe-core";
import RegistrationSearcher from "../components/RegistrationSearcher";


const styles = theme => ({
    page: theme.page,
    fab: theme.fab
});

//http://localhost:3000/webapp/registrations?previewDomain=http://localhost:8055

function getUrlParameterRegistrationPage(sParam) {
    console.log('getUrlParameter');
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
}

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
        var previewDomain=getUrlParameterRegistrationPage('previewDomain');
        if (previewDomain){ return previewDomain+attachment; }
        return attachment;

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


class RegistrationPage extends Component {

    // onDoubleClick = (i, newTab = false) => {
    //     historyPush(this.props.modulesManager, this.props.history, "webapp.route.notice", [i.id], newTab)
    // }

    // onAdd = () => {
    //     historyPush(this.props.modulesManager, this.props.history, "webapp.route.notice");
    // }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.page}>
                <RegistrationSearcher
                    cacheFiltersKey="webappFeedbackPageFiltersCache"
                    onDoubleClick={this.onDoubleClick}
                />
            </div >
        )
    }
}

const mapStateToProps = state => ({
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
})

export default injectIntl(withModulesManager(withHistory(connect(mapStateToProps)(withTheme(withStyles(styles)(RegistrationPage))))));