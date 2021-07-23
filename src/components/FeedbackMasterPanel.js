import React from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Paper, Grid, Typography } from "@material-ui/core";
import {
    FormattedMessage, FormPanel, 
    Contributions, withModulesManager
} from "@openimis/fe-core";

const styles = theme => ({
    paper: theme.paper.paper,
    tableTitle: theme.table.title,
    item: theme.paper.item,
    fullHeight: {
        height: "100%"
    },
});

const WEBAPP_FEEDBACK_CONTRIBUTION_KEY = "webapp.Feedback"
const WEBAPP_FEEDBACK_PANELS_CONTRIBUTION_KEY = "webapp.Feedback.panels"

class FeedbackMasterPanel extends FormPanel {

    constructor(props) {
        super(props);
        // this.chfIdMaxLength = props.modulesManager.getConf("fe-insuree", "insureeForm.chfIdMaxLength", 12);
    }

    render() {
        const {
            intl, classes, edited,
            title = "Feedback List", titleParams = { label: "" },
            readOnly = true,
            actions
        } = this.props;
        return (
            <Grid container>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Grid container className={classes.tableTitle}>
                            <Grid item xs={3} className={classes.tableTitle}>
                                <Typography>
                                    <FormattedMessage module="feedback" id={title} values={titleParams} />
                                </Typography>
                            </Grid>
                            
                            {/* // RIGHT SIDE OF NOTICE TITLE //
                            <Grid item xs={9}>
                                <Grid container justify="flex-end">
                                    <TextInput
                                    autoFocus={true}
                                    module="webapp"
                                    label="noticeForm.title"
                                    value={edited.title}
                                    required={true}
                                    inputProps={{"maxlength": this.codeMaxLength,}}
                                    onChange={v=>this.updateAttribute("title", v)}
                                    />
                                </Grid>
                            </Grid> */}
                        
                            <Contributions {...this.props} updateAttribute={this.updateAttribute} contributionKey={WEBAPP_FEEDBACK_CONTRIBUTION_KEY} />
                        </Grid>
                    </Paper>

                    
                    <Contributions {...this.props} updateAttribute={this.updateAttribute} contributionKey={WEBAPP_FEEDBACK_PANELS_CONTRIBUTION_KEY} />
                </Grid>
            </Grid>
        );
    }
}

export default withModulesManager(withTheme(
    withStyles(styles)(FeedbackMasterPanel)
));