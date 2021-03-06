import React, { useEffect } from "react";
import { BreadcrumbEntry } from "./navigation";
import { useBreadcrumbsContext } from "../contexts/BreacrumbsContext";
import { useRouteMatch } from "react-router-dom";
import { AdditionalView } from "../CMSAppProps";


interface AdditionalViewRouteProps {
    additionalView: AdditionalView;
}

function AdditionalViewRoute({
                                 additionalView
                             }: AdditionalViewRouteProps) {

    const { url } = useRouteMatch();

    const breadcrumb: BreadcrumbEntry = {
        title: additionalView.name,
        url: url
    };

    const breadcrumbsContext = useBreadcrumbsContext();

    useEffect(() => {
        breadcrumbsContext.set({
            breadcrumbs: [breadcrumb]
        });
    }, []);

    return <React.Fragment>
        {additionalView.view}
    </React.Fragment>;
}

export default AdditionalViewRoute;
