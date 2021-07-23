import messages_en from "./translations/en.json";
import messages_np from "./translations/np.json";
import WebappMainMenu from "./menu/WebappMainMenu";
import NoticesPage
 from "./pages/NoticesPage";
const ROUTE_TO_NOTICE = "webapp/notices";
const ADD_NOTICE = "webapp/notice";
const EDIT_NOTICE = "webapp/edit_notice";
const PAYMENTS_PAGE = "webapp/payments";
const FEEDBACK_PAGE = "webapp/feedbacks";
const REGISTRATIONS_PAGE = "webapp/registrations";

import reducer from "./reducers";
import NoticePage from "./pages/NoticePage";
import PaymentsPage from "./pages/PaymentsPage";
import FeedbackPage from "./pages/FeedbackPage";
import RegistrationPage from "./pages/RegistrationPage";


const ROUTE_WEBAPP_NOTICE = "webapp/notice";
const ROUTE_WEBAPP_NOTICES = "webapp/notices";

const DEFAULT_CONFIG = {
	"translations": [{ key: 'en', messages: messages_en }],
	"reducers": [{ key: 'webapp', reducer }],
	"core.MainMenu" : [WebappMainMenu],
	"refs": [
		{ key: "webapp.route.notice_edit", ref: ADD_NOTICE },
		{ key: "webapp.route.notice", ref: ROUTE_WEBAPP_NOTICE },
		{ key: "webapp.route.notices", ref: ROUTE_WEBAPP_NOTICES },
	],
	"core.Router": [
		{ path: ROUTE_TO_NOTICE, component: NoticesPage },
		{ path: ADD_NOTICE+"/:notice_id?", component: NoticePage },
		// { path: EDIT_NOTICE +"/:notice_id", component: NoticePage },
		{ path: PAYMENTS_PAGE, component: PaymentsPage },
		{ path: FEEDBACK_PAGE, component: FeedbackPage },
		{ path: REGISTRATIONS_PAGE, component: RegistrationPage },
	],
}
export const FeWebapp = (cfg) => {
	return { ...DEFAULT_CONFIG, ...cfg };
}