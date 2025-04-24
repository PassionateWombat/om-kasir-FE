import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";
import { LoginResponse, TokenClaims } from "./types/auth/Token";
import { jwtDecode } from "jwt-decode";
import { jwtVerify } from "jose";

export const { handlers, signIn, signOut, auth } = NextAuth({
    pages: {
        signIn: "/login",
        error: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 1,
    },
    secret: process.env.AUTH_SECRET,
    trustHost: true,
    debug: process.env.NODE_ENV === "development",
    providers: [
        // GoogleProvider({
        //     clientId: process.env.GOOGLE_CLIENT_ID,
        //     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        // }),
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email" },
                password: { label: "Password", type: "password" },
            },
            async authorize({ email, password }) {
                const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/1.0.0/auth/login`;
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                });

                if (!response.ok) {
                    return null;
                }

                const { data } = (await response.json()) as LoginResponse;

                // Verify the JWT signature
                const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

                try {
                    await jwtVerify(data.access_token, secret);
                    // console.log("Token verified!", data.accessToken);
                } catch (err) {
                    console.error("JWT verification failed:", err);
                    return null;
                }

                const decodedToken = jwtDecode<TokenClaims>(data.access_token);

                // Extract claims from the decoded token
                // const { sub, scope, userId, imageUrl } = decodedToken;
                const { scope, userId, email: emailClaim } = decodedToken;

                const parsedResponse: User = {
                    email: emailClaim,
                    token: {
                        accessToken: {
                            claims: decodedToken,
                            value: data.access_token,
                        }
                    },
                    roles: scope.split(" "),
                    userId: parseInt(userId),
                    // imageUrl: imageUrl,
                };

                return parsedResponse ?? null;
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            session.accessToken = token.accessToken.value;
            // session.refreshToken = token.refreshToken.value;
            session.user = {
                ...session.user,
                roles: token.roles,
                id: token.accessToken.claims.userId,
                email: token.accessToken.claims.sub ?? "",
                // imageUrl: (token.imageUrl as string) ?? "",
            };
            return session;
        },
        async jwt({ token, user }) {
            // console.log("IN JWT CALLBACK: ", user, account);

            if (user) {
                token = {
                    accessToken: {
                        claims: user.token.accessToken.claims,
                        value: user.token.accessToken.value,
                    },
                    // refreshToken: {
                    //     claims: user.token.refreshToken.claims,
                    //     value: user.token.refreshToken.value,
                    // },
                    roles: user.roles,
                    userId: user.userId,
                    // imageUrl: user.imageUrl,
                };
            }

            // Handle access token expiration and refresh logic
            if (
                token.accessToken.claims.exp &&
                Date.now() >= ((token.accessToken.claims.exp * 1000) - (60 * 1000))
            ) {
                const newToken = await refreshToken(token.accessToken.value);
                if (!newToken) {
                    return null;
                }
                token.accessToken = newToken;
            }

            return token;
        },
        async signIn({ user, account }) {
            // console.log("IN SIGNIN CALLBACK: ", user, account);

            if (account?.provider === "google") {
                // Exchange Google token for backend JWT
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google-login`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ token: account.id_token }),
                    }
                );

                if (!response.ok) {
                    console.error("Failed to exchange Google token");
                    return false;
                }

                const { data } = (await response.json()) as LoginResponse;
                // const { data } = await response.json();
                if (!data?.access_token) {
                    console.error("No access token received from backend");
                    return false;
                }

                const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

                try {
                    await jwtVerify(data.access_token, secret);
                    // console.log("Token verified!", data.accessToken);
                } catch (err) {
                    console.error("JWT verification failed:", err);
                    return false;
                }

                const decodedToken = jwtDecode<TokenClaims>(data.access_token);

                user.token = {
                    accessToken: {
                        claims: decodedToken,
                        value: data.access_token,
                    },
                    // refreshToken: {
                    //     claims: jwtDecode<TokenClaims>(data.refreshToken),
                    //     value: data.refreshToken,
                    // },
                };
                user.roles = decodedToken.scope.split(" ");
                user.userId = parseInt(decodedToken.userId);
                // user.imageUrl = decodedToken.imageUrl;
            }

            return true;
        },
    },
});

const refreshToken = async (refreshToken: string) => {
    // console.log("Refreshing token...");
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/1.0.0/auth/refresh`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${refreshToken}`,
        },
        // body: JSON.stringify({ token: refreshToken }),
    });
    if (!response.ok) {
        console.error("Failed to refresh access token");
        return null;
    }
    const { data } = (await response.json()) as LoginResponse;

    if (!data?.access_token) {
        console.error("No access token received from backend");
        return false;
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

    try {
        await jwtVerify(data.access_token, secret);
        // console.log("Refreshed token verified!", data.accessToken);
    } catch (err) {
        console.error("JWT verification failed:", err);
        return null;
    }

    const decodedToken = jwtDecode<TokenClaims>(data.access_token);

    return {
        claims: decodedToken,
        value: data.access_token,
    };
};