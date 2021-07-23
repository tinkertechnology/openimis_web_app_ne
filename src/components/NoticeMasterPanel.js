import React, { Component, Fragment } from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Paper, Grid, Typography, Divider, Checkbox, FormControlLabel } from "@material-ui/core";
import {
    formatMessage, withTooltip,
    FormattedMessage, PublishedComponent, FormPanel,
    TextInput, Contributions, withModulesManager
} from "@openimis/fe-core";

const styles = theme => ({
    paper: theme.paper.paper,
    tableTitle: theme.table.title,
    item: theme.paper.item,
    fullHeight: {
        height: "100%"
    },
});

const WEBAPP_NOTICE_CONTRIBUTION_KEY = "webapp.Notice"
const WEBAPP_NOTICE_PANELS_CONTRIBUTION_KEY = "webapp.Notice.panels"

class InsureeMasterPanel extends FormPanel {

    constructor(props) {
        super(props);
        // this.chfIdMaxLength = props.modulesManager.getConf("fe-insuree", "insureeForm.chfIdMaxLength", 12);
    }

    render() {
        const {
            intl, classes, edited,
            title = "Notice", titleParams = { label: "" },
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
                                    <FormattedMessage module="webapp" id={title} values={titleParams} />
                                </Typography>
                            </Grid>
                            
                            {/* // RIGHT SIDE OF NOTICE TITLE // */}
                            <Grid item xs={9}>
                                <Grid container justify="flex-end">
                                    {/* {!!actions && (actions.map((a, idx) => {
                                        return(
                                            <Grid item key={`form-action-${idx}`} className={classes.paperHeaderAction}>
                                                { withTooltip(a.button, a.tooltip)}
                                            </Grid>
                                        )
                                    }))} */}
                                    {/* <TextInput
                                    autoFocus={true}
                                    module="webapp"
                                    label="noticeForm.title"
                                    value={edited.title}
                                    required={true}
                                    inputProps={{"maxlength": this.codeMaxLength,}}
                                    onChange={v=>this.updateAttribute("title", v)}
                                    /> */}
                                </Grid>
                            </Grid>
                        
                            <Contributions {...this.props} updateAttribute={this.updateAttribute} contributionKey={WEBAPP_NOTICE_CONTRIBUTION_KEY} />
                        </Grid>
                        <Divider />

                        <Grid container className={classes.item}>
                            <Grid item  xs={4} className={classes.item}>
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

                            <Grid item  xs={4} className={classes.item}>
                                <TextInput
                                    autoFocus={true}
                                    module="webapp"
                                    label="noticeForm.description"
                                    value={edited.description}
                                    required={true}
                                    inputProps={{"maxlength": this.codeMaxLength,}}
                                    onChange={v=>this.updateAttribute("description", v)}
                                />
                            </Grid>
                        </Grid>

                        
                    </Paper>

                    
                    <Contributions {...this.props} updateAttribute={this.updateAttribute} contributionKey={WEBAPP_NOTICE_PANELS_CONTRIBUTION_KEY} />
                </Grid>
            </Grid>
        );
    }
}

export default withModulesManager(withTheme(
    withStyles(styles)(InsureeMasterPanel)
));