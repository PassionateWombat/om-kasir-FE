'use client'
import { FC, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
const validationSchema =
    Yup.object({
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string().required("Password is required"),
    })
type LoginFormValues = {
    email: string;
    password: string;
};
const LoginForm: FC = () => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const handleSubmit = async (
        values: LoginFormValues,
        formikHelpers: FormikHelpers<LoginFormValues>
    ) => {
        setError(null);
        try {
            const result = await signIn("credentials", {
                redirect: false,
                email: values.email,
                password: values.password,
            });

            if (result?.error) {
                if (result.error === "CredentialsSignin") {
                    setError("Invalid email or password");
                } else {
                    setError(
                        result?.error || "An unexpected error occurred. Please try again."
                    );
                }
            } else if (!result?.error) {
                alert("Login success");
                formikHelpers.resetForm();
                router.refresh();
            }
        } catch (error) {
            alert(error)
            // showToast("An unexpected error occurred:" + error, "error");
            // setError("An unexpected error occurred. Please try again.");
        } finally {
        }
    };
    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Formik
                        initialValues={{ email: "", password: "" }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {() => (
                            <Form>
                                <div className="flex flex-col gap-6">
                                    <div className="grid gap-3">
                                        <Label htmlFor="email">Email</Label>
                                        <Field
                                            name="email"
                                            as={Input}
                                            type="email"
                                            placeholder="email@example.com"
                                        />
                                        <ErrorMessage
                                            name="email"
                                            component="p"
                                            className="text-sm text-red-500"
                                        />
                                    </div>

                                    <div className="grid gap-3">
                                        <div className="flex items-center">
                                            <Label htmlFor="password">Password</Label>
                                            <a
                                                href="#"
                                                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                            >
                                                Forgot your password?
                                            </a>
                                        </div>
                                        <Field
                                            name="password"
                                            as={Input}
                                            type="password"
                                        />
                                        <ErrorMessage
                                            name="password"
                                            component="p"
                                            className="text-sm text-red-500"
                                        />
                                    </div>

                                    {error && <span className="text-red-500">{error}</span>}

                                    <div className="flex flex-col gap-3">
                                        <Button type="submit" className="w-full">
                                            Login
                                        </Button>
                                    </div>
                                </div>

                                <div className="mt-4 text-center text-sm">
                                    Don&apos;t have an account?{" "}
                                    <a href="#" className="underline underline-offset-4">
                                        Sign up
                                    </a>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </CardContent>
            </Card>
        </div>
    );
}

export default LoginForm;