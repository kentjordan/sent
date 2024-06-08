import { NextRequest, NextResponse } from "next/server";
import { InvalidTokenError, jwtDecode } from "jwt-decode"

export function middleware(req: NextRequest) {

    const url = req.nextUrl.clone();

    const refresh_token = req.cookies.get("refresh_token")?.value;

    try {
        const decodedRT = jwtDecode(refresh_token!);

        if (decodedRT.exp! > Math.ceil(Date.now() / 1000))
            return NextResponse.next();

        throw Error("JWT Expired");

    } catch (error) {
        if (error instanceof InvalidTokenError) {
            console.log(error, "No token provided.");
        }

        url.pathname = "/login"
        return NextResponse.redirect(url);
    }

}

export const config = {
    matcher: ["/inbox", "/profile/[username]", "/search", "/newsfeed"]
}