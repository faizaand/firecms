import React from "react";
import {
    Box,
    Button,
    createStyles,
    Grid,
    makeStyles,
    Theme
} from "@material-ui/core";
import "firebase/analytics";
import "firebase/auth";
import "firebase/storage";
import "firebase/firestore";
import { useAuthContext } from "./contexts/AuthContext";
import { useAppConfigContext } from "./contexts/AppConfigContext";
import { CMSAppProps } from "./CMSAppProps";
import firebase from "firebase";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        logo: {
            padding: theme.spacing(3),
            maxWidth: 260
        }
    })
);

interface LoginViewProps {
    skipLoginButtonEnabled?: boolean,
    logo?: string,
}

export function LoginView({ skipLoginButtonEnabled, logo }: LoginViewProps) {

    const classes = useStyles();

    const authContext = useAuthContext();
    const appConfigContext: CMSAppProps | undefined = useAppConfigContext();

    let errorView: any;
    if (authContext.authProviderError) {
        if (authContext.authProviderError.code === "auth/operation-not-allowed") {
            errorView =
                <>
                    <Box p={2}>
                        You need to enable Google login in your project
                    </Box>

                    {appConfigContext?.firebaseConfig &&
                    <Box p={2}>
                        <a href={`https://console.firebase.google.com/project/${appConfigContext.firebaseConfig["projectId"]}/authentication/providers`}
                           rel="noopener noreferrer"
                           target="_blank">
                            <Button variant="outlined"
                                    color="primary">
                                Open Firebase configuration
                            </Button>
                        </a>
                    </Box>}
                </>;
        } else {
            errorView =
                <Box p={2}>
                    {authContext.authProviderError.message}
                </Box>;
        }
    }

    React.useEffect(() => {
        const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());

        const uiConfig: firebaseui.auth.Config = {
            callbacks: {
                signInSuccessWithAuthResult: (authResult, redirectUrl) => true,
                uiShown: () => authContext.setAuthLoading(false)
            },
            signInFlow: 'popup',
            signInOptions: [
                // more auth providers can be added here
                firebase.auth.EmailAuthProvider.PROVIDER_ID
            ],
        };
        ui.start("#firebase-ui", uiConfig);
    });

    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            style={{ minHeight: "100vh" }}
        >
            <Box m={1}>
                {logo &&
                <img className={classes.logo} src={logo}
                     alt={"Logo"}/>}
            </Box>

            <div id="firebase-ui"></div>

            {skipLoginButtonEnabled &&
            <Box m={2}>
                <Button onClick={authContext.skipLogin}>Skip
                    login</Button>
            </Box>
            }

            <Grid item xs={12}>

                {/* TODO: add link to https://console.firebase.google.com/u/0/project/[PROYECT_ID]/authentication/providers in order to enable google */}
                {/* in case the error code is auth/operation-not-allowed */}

                {authContext.notAllowedError &&
                <Box p={2}>It looks like you don't have access
                    to
                    the CMS,
                    based
                    on the specified Authenticator
                    configuration</Box>}

                {errorView}

            </Grid>
        </Grid>
    );
}
