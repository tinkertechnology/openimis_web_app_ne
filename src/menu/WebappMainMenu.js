import React, {Component} from "react";
import {Keyboard, ScreenShare, Note, Payment, ImageSearch,Feedback, SupervisorAccount} from "@material-ui/icons";
import {MainMenuContribution, withModulesManager} from "@openimis/fe-core";

class WebappMainMenu extends Component {
    render(){
        const {rights} = this.props;
        const {intl} = this.props;
        let entries = []
        entries.push(
            {
                text: "Notices",
                icon: <Note />,
                route: "/webapp/notices"
            },
            {
                text: "Add Notice",
                icon: <Payment />,
                route: "/webapp/notice"
            },
            {
                text: "Renewal Requests",
                icon: <ImageSearch />,
                route: "/webapp/payments"
            },
            {
                text: "Feedbacks",
                icon: <Feedback />,
                route: "/webapp/feedbacks"
            },
            {
                text: "Registrations",
                icon: <SupervisorAccount />,
                route: "/webapp/registrations"
            },
                         
        );
        if(!entries.length) return null;
        return(
            <MainMenuContribution
            {...this.props}
            header="APP"
            icon={<ScreenShare />}
            entries={entries}
            />
        )
    }
}

export default withModulesManager(WebappMainMenu);