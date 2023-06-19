import {
    Button,
    Grid,
    TextField,
    Typography
} from "@mui/material";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/userContext";
import authService from "../../services/authService";
import { useNavigate } from "react-router-dom";


const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string().required("Required"),
});

export default function LoginForm() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const initialValues = {
        email: "",
        password: "",
    };

    const onSubmit = async (values) => {
        let userResp = await authService.login(values);
        console.log("LoginForm.jsx: userResp: ", userResp);
        await setUser(userResp);
        console.log("LoginForm.jsx: user: ", user);
        
        navigate( 
            userResp.roles.includes("cliente") 
            ? "/store"
            : userResp.roles.includes("logistica")
                ? "/logistica"
                : "/transporte"
        );
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {(formik) => (
                <Form>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h4">Login</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="email"
                                name="email"
                                label="Email"
                                variant="outlined"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="password"
                                name="password"
                                label="Password"
                                variant="outlined"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                type="submit"
                                disabled={!formik.isValid}
                            >
                                Login
                            </Button>
                        </Grid>
                    </Grid>
                </Form>
            )}
        </Formik>
    );
}
