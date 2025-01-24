import Header from "@/components/UI/Header";
import { ArrowRightAlt } from "@mui/icons-material";
import {
  Box,
  Container,
  Grid,
  ListItemButton,
  ListItemText,
  Typography,
  List,
  ListItem,
  Code,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import DashboardLayout from "./department/departmentLayout";

const ApiDoc = () => {
  const [section, setSection] = useState("redirect");
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setSection(entry.target.id);
        }
      });
    });

    // const sectionToObserve = document.querySelector("#redirect");
    // const sectionToObserve1 = document.querySelector("#api");
    // const sectionToObserve2 = document.querySelector("#iframe");

    // observer.observe(sectionToObserve);
    // observer.observe(sectionToObserve1);
    // observer.observe(sectionToObserve2);

    // // Cleanup the observer when the component unmounts
    // return () => {
    //   observer.unobserve(sectionToObserve);
    //   observer.unobserve(sectionToObserve1);
    //   observer.unobserve(sectionToObserve2);
    // };
  }, []);

  return (
    <Header>
      <main className="p-6 space-y-6">
        <Grid container spacing={4} sx={{ padding: 2, mb: 8 }}>
          <Grid item={true} xs={12}>
            {/* <Typography>Contact Developer</Typography> */}
            <Box maxHeight={"91vh"} overflow={"hidden"}>
              <Grid container>
                <Grid item xs={3}>
                  <Box pt={3}>
                    <Typography textAlign={"center"} variant="h5" pb={3}>
                      Him Access Integration
                    </Typography>
                    <ListItemButton
                      selected={section === "redirect"}
                      component="a"
                      href="#redirect"
                    >
                      <ListItemText primary="Integrate using Redirect" />
                    </ListItemButton>

                    <ListItemButton
                      selected={section === "api"}
                      component="a"
                      href="#api"
                    >
                      <ListItemText primary="Integrate using API" />
                    </ListItemButton>

                    <ListItemButton
                      selected={section === "iframe"}
                      component="a"
                      href="#iframe"
                    >
                      <ListItemText primary="Integrate using iFrame" />
                    </ListItemButton>
                    <ListItemButton
                      selected={section === "user"}
                      component="a"
                      href="#user"
                    >
                      <ListItemText primary="Integrate for exisiting user" />
                    </ListItemButton>
                  </Box>
                </Grid>
                <Grid item xs={9}>
                  <Box
                    pt={3}
                    maxHeight={"90vh"}
                    overflow={"scroll"}
                    className="scrollbarHide"
                  >
                    <Container>
                      <Typography variant="h5" pb={3}>
                        API Documentation
                      </Typography>

                      <section>
                        <Typography variant="h6" id="redirect" pb={2}>
                          Integrate using Redirect
                        </Typography>
                        <Typography>
                          Steps for integrating using Redirect:
                        </Typography>

                        <List>
                          <ListItem>
                            Departments need to create their department account.
                          </ListItem>
                          <ListItem>
                            Departments need to create a service (service logo,
                            service name, success URL, logout URL).
                          </ListItem>
                          <ListItem>
                            Departments need to create a login button on their
                            website with a link like &nbsp;
                            {process.env.NEXT_PUBLIC_API_BASE_URL}
                            /login?service_id=&quot;service_id&quot;.
                          </ListItem>
                          <ListItem>
                            If a user clicks on the button, they will be
                            redirected to the Him Access website&quot;s login page.
                          </ListItem>
                          <ListItem>
                            If the user successfully authenticates, they will be
                            redirected to the provided success page with a
                            token.
                          </ListItem>
                          <ListItem>
                            Now the department needs to send a request to
                            receive the token, service_id, and secret_key for
                            getting user information.
                          </ListItem>
                        </List>

                        <Typography variant="h6">Example Request:</Typography>
                        <Paper
                          elevation={3}
                          sx={{
                            padding: 2,
                            bgcolor: "#1e1e1e",
                            color: "#fff",
                            marginBottom: 2,
                          }}
                        >
                          url: {process.env.NEXT_PUBLIC_API_BASE_URL}
                          /validateToken
                          <pre>
                            {`{
    "token": "a03ecb3d-f67b-4158-b5ca-d06d17d39765",
    "secret_key": "4ffc52fb-ca02-47ea-9ee1-cb9a2cf490ef",
    "service_id": "10000035"
}`}
                          </pre>
                        </Paper>

                        <Typography variant="h6">Example Response:</Typography>
                        <Paper
                          elevation={3}
                          sx={{
                            padding: 2,
                            bgcolor: "#1e1e1e",
                            color: "#fff",
                            marginBottom: 2,
                          }}
                        >
                          <pre>
                            {`{
    "sso_id": 3669,
    "vault_id": 0,
    "userName": "deepak",
    "name": "Deepak Sharma",
    "mobile": "8963957652",
    "email": "pankajbatham27@gmail.com",
    "gender": "Male",
    "dob": "1989-06-30",
    "co": "S/O: Dharam Prakash",
    "street": "Village Pahal",
    "lm": "Tehsil Dhami",
    "loc": "District Shimla",
    "vtc": "Pahl (162)",
    "dist": "Shimla",
    "state": "Himachal Pradesh",
    "pc": "171007",
    "UsersArray": [{
      "sso_id": "xxxx",
      "service_id": "xxxxxxx",
      "userName": "khushkumar@gmail.com",
      "mobile": "95868xxxxx",
      "email": "xxxxx@gmail.com",
      "primaryUser": false
    }],
    "aadhaarNumber": "U2FsdGVkX18k31NbOOTCg+z"
}`}
                          </pre>
                        </Paper>
                      </section>

                      <section>
                        <Typography variant="h5" id="api" pb={3} pt={3}>
                          Integrate using API
                        </Typography>
                        <Typography>
                          Steps for integrating using API:
                        </Typography>

                        <List>
                          <ListItem>
                            Departments need to create their department account.
                          </ListItem>
                          <ListItem>
                            Departments need to create a service (service logo,
                            service name, success URL, logout URL).
                          </ListItem>
                          <ListItem>
                            Departments need to create a login form on their
                            website and pass user credentials with service_id
                            and secret_key (users can log in with mobile OTP
                            too).
                          </ListItem>
                          <ListItem>
                            The Him Access website will return user details.
                          </ListItem>
                        </List>

                        <Typography variant="h6">Example Requests:</Typography>
                        <Typography
                          variant="body"
                          display={"flex"}
                          alignItems={"center"}
                          p={2}
                          fontWeight={"bold"}
                        >
                          <ArrowRightAlt /> 1st Login option
                        </Typography>
                        <Paper
                          elevation={3}
                          sx={{
                            padding: 2,
                            bgcolor: "#1e1e1e",
                            color: "#fff",
                            marginBottom: 2,
                          }}
                        >
                          <pre>
                            {`
url: ${process.env.NEXT_PUBLIC_API_BASE_URL}/validate-user
{
    "secret_key": "4ffc52fb-ca02-47ea-9ee1-cb9a2cf490ef",
    "service_id": "10000035",
    "username": "test",
    "password": "******"
}`}
                          </pre>
                        </Paper>

                        <Typography variant="h6">Example Response:</Typography>
                        <Paper
                          elevation={3}
                          sx={{
                            padding: 2,
                            bgcolor: "#1e1e1e",
                            color: "#fff",
                            marginBottom: 2,
                          }}
                        >
                          <pre>
                            {`{
    "name": "Deepak Sharma",
    "mobile": "8963957652",
    "email": "pankajbatham27@gmail.com",
    "gender": "Male",
    "dob": "1989-06-30",
    "co": "S/O: Dharam Prakash",
    "street": "Village Pahal",
    "lm": "Tehsil Dhami",
    "loc": "District Shimla",
    "vtc": "Pahl (162)",
    "dist": "Shimla",
    "state": "Himachal Pradesh",
    "pc": "171007"
}`}
                          </pre>
                        </Paper>

                        <Typography
                          variant="body"
                          display={"flex"}
                          alignItems={"center"}
                          p={2}
                          fontWeight={"bold"}
                        >
                          <ArrowRightAlt /> 2nd Login option
                        </Typography>
                        <Paper
                          elevation={3}
                          sx={{
                            padding: 2,
                            bgcolor: "#1e1e1e",
                            color: "#fff",
                            marginBottom: 2,
                          }}
                        >
                          <pre>
                            {`
url: ${process.env.NEXT_PUBLIC_API_BASE_URL}/send-otp
{
    "secret_key": "4ffc52fb-ca02-47ea-9ee1-cb9a2cf490ef",
    "service_id": "10000035",
    "mobile": "9876543210"
}`}
                          </pre>

                          <pre>
                            {`url: ${process.env.NEXT_PUBLIC_API_BASE_URL}/verify-otp
{
    "secret_key": "4ffc52fb-ca02-47ea-9ee1-cb9a2cf490ef",
    "service_id": "10000035",
    "mobile": "9876543210",
    "otp": "12345"
}`}
                          </pre>
                        </Paper>

                        <Typography variant="h6">Example Response:</Typography>
                        <Paper
                          elevation={3}
                          sx={{
                            padding: 2,
                            bgcolor: "#1e1e1e",
                            color: "#fff",
                            marginBottom: 2,
                          }}
                        >
                          <pre>
                            {`{
    "name": "Deepak Sharma",
    "mobile": "8963957652",
    "email": "pankajbatham27@gmail.com",
    "gender": "Male",
    "dob": "1989-06-30",
    "co": "S/O: Dharam Prakash",
    "street": "Village Pahal",
    "lm": "Tehsil Dhami",
    "loc": "District Shimla",
    "vtc": "Pahl (162)",
    "dist": "Shimla",
    "state": "Himachal Pradesh",
    "pc": "171007"
}`}
                          </pre>
                        </Paper>
                      </section>

                      <section>
                        <Typography variant="h5" id="iframe" pb={3} pt={3}>
                          Integrate using iFrame
                        </Typography>
                        <Typography>
                          Steps for integrating using iFrame:
                        </Typography>

                        <List>
                          <ListItem>
                            Departments need to create their department account.
                          </ListItem>
                          <ListItem>
                            Departments need to create a service (service logo,
                            service name, success URL, logout URL).
                          </ListItem>
                          <ListItem>
                            Departments need to add a script file in the header
                            (
                            <pre>
                              <b>{`<script src="${process.env.NEXT_PUBLIC_API_BASE_URL}/iframe/iframe.js" defer=""></script>`}</b>
                            </pre>
                            ).
                          </ListItem>
                          <ListItem>
                            Add two div elements anywhere in the HTML:
                          </ListItem>
                          <pre>
                            <b>
                              &lt;div class=&quot;backdrop&quot;&gt;&lt;/div&gt;
                              &lt;div id=&quot;iframeContainer&quot;
                              class=&quot;iframe-container&quot;&gt;&lt;/div&gt;
                            </b>
                          </pre>
                          <ListItem>
                            Departments need to create a button with an
                            `onClick` event function named&nbsp;
                            <b>`getIframeSSO(&quot;service_id&quot;)`</b>.
                          </ListItem>
                          <ListItem>
                            If a user clicks the button, the iFrame will be
                            loaded on the same page.
                          </ListItem>
                          <ListItem>
                            If the user successfully authenticates, they will be
                            redirected to the provided success page with a
                            token.
                          </ListItem>
                          <ListItem>
                            Now the department needs to send a request to
                            receive the token, service_id, and secret_key for
                            getting user information.
                          </ListItem>
                        </List>

                        <Typography variant="h6">Example Request:</Typography>
                        <Paper
                          elevation={3}
                          sx={{
                            padding: 2,
                            bgcolor: "#1e1e1e",
                            color: "#fff",
                            marginBottom: 2,
                          }}
                        >
                          <pre>
                            {`url: https://'Authorization': ${process.env.NEXT_PUBLIC_API_BASE_URL}/validateToken
{
    "token": "a03ecb3d-f67b-4158-b5ca-d06d17d39765",
    "secret_key": "4ffc52fb-ca02-47ea-9ee1-cb9a2cf490ef",
    "service_id": "10000035"
}`}
                          </pre>
                        </Paper>

                        <Typography variant="h6">Example Response:</Typography>
                        <Paper
                          elevation={3}
                          sx={{
                            padding: 2,
                            bgcolor: "#1e1e1e",
                            color: "#fff",
                            marginBottom: 2,
                          }}
                        >
                          <pre>
                            {`{
    "sso_id": 3669,
    "vault_id": 0,
    "userName": "deepak",
    "name": "Deepak Sharma",
    "mobile": "8963957652",
    "email": "pankajbatham27@gmail.com",
    "gender": "Male",
    "dob": "1989-06-30",
    "co": "S/O: Dharam Prakash",
    "street": "Village Pahal",
    "lm": "Tehsil Dhami",
    "loc": "District Shimla",
    "vtc": "Pahl (162)",
    "dist": "Shimla",
    "state": "Himachal Pradesh",
    "pc": "171007",
    "UsersArray": [{
      "sso_id": "xxxx",
      "service_id": "xxxxxxx",
      "userName": "khushkumar@gmail.com",
      "mobile": "95868xxxxx",
      "email": "xxxxx@gmail.com",
      "primaryUser": false
    }],
    "aadhaarNumber": "U2FsdGVkX18k31NbOOTCg+z"
}`}
                          </pre>
                        </Paper>
                      </section>

                      <section>
                        <Typography variant="h5" id="user" pb={3} pt={3}>
                          Integrate for exisiting user
                        </Typography>
                        <Typography>
                          Steps for integrating using API:
                        </Typography>

                        <List>
                          <ListItem>Departments need to share API.</ListItem>
                        </List>

                        <Typography variant="h6">Example Requests:</Typography>
                        <Typography
                          variant="body"
                          display={"flex"}
                          alignItems={"center"}
                          p={2}
                          fontWeight={"bold"}
                        >
                          <ArrowRightAlt /> 1st User information
                        </Typography>
                        <Paper
                          elevation={3}
                          sx={{
                            padding: 2,
                            bgcolor: "#1e1e1e",
                            color: "#fff",
                            marginBottom: 2,
                          }}
                        >
                          <pre>
                            {`
url: {Service URL}/user/getCitizenUserInfoAPI
{
    "username": "test",
    "password": "******"
}`}
                          </pre>
                        </Paper>

                        <Typography variant="h6">Example Response:</Typography>
                        <Paper
                          elevation={3}
                          sx={{
                            padding: 2,
                            bgcolor: "#1e1e1e",
                            color: "#fff",
                            marginBottom: 2,
                          }}
                        >
                          <pre>
                            {`{
    "name": "Deepak Sharma",
    "mobile": "8963957652",
    "email": "pankajbatham27@gmail.com",
    "userName": "deepak007",
    "password": "*****"
}`}
                          </pre>
                        </Paper>

                        <Typography
                          variant="body"
                          display={"flex"}
                          alignItems={"center"}
                          p={2}
                          fontWeight={"bold"}
                        >
                          <ArrowRightAlt /> 2nd Decrypt Password
                        </Typography>
                        <Paper
                          elevation={3}
                          sx={{
                            padding: 2,
                            bgcolor: "#1e1e1e",
                            color: "#fff",
                            marginBottom: 2,
                          }}
                        >
                          <pre>
                            For decryption of password department will share
                            decryption algoridham.
                            {/* {`
url: {Service URL}/user/decryptPassword
{
  "userName": "deepak007",
  "password": "*****"
}`} */}
                          </pre>
                        </Paper>

                        {/* <Typography variant="h6">Example Response:</Typography>
                        <Paper
                          elevation={3}
                          sx={{
                            padding: 2,
                            bgcolor: "#1e1e1e",
                            color: "#fff",
                            marginBottom: 2,
                          }}
                        >
                          <pre>
                            {`{
   "password": "*****"
}`}
                          </pre>
                        </Paper> */}
                      </section>
                    </Container>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </main>
    </Header>
  );
};
export default ApiDoc;
